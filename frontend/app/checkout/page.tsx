'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth, UserAddress } from '@/context/AuthContext';
import { formatINR } from '@/lib/utils';
import { API_BASE } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  ArrowRight,
  ArrowLeft,
  Tag,
  AlertCircle,
  Lock,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart, freeShippingThreshold } = useCart();
  const { user, isAuthenticated, token } = useAuth();

  // Contact info
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Shipping Address State
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [useNewAddress, setUseNewAddress] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState<Omit<UserAddress, '_id'>>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    discountType: string;
    discountValue: number;
  } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  // Order submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Sync user info on mount
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setPhone(user.phone || '');
      if (user.addresses && user.addresses.length > 0) {
        const defaultIdx = user.addresses.findIndex((a) => a.isDefault);
        setSelectedAddressIndex(defaultIdx >= 0 ? defaultIdx : 0);
      } else {
        setUseNewAddress(true);
      }
    } else {
      setUseNewAddress(true);
    }
  }, [user]);

  // Calculations
  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : 99;
  const prepaidDiscount = paymentMethod === 'razorpay' ? Math.round((subtotal - couponDiscount) * 0.1) : 0;
  const codFee = paymentMethod === 'cod' ? 50 : 0;
  const finalTotal = Math.max(0, subtotal - couponDiscount - prepaidDiscount + shippingFee + codFee);

  // Apply Coupon Action
  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;

    setCouponError('');
    setCouponLoading(true);

    try {
      const res = await fetch(`${API_BASE}/coupons/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setAppliedCoupon(data.data);
        setCouponInput('');
      } else {
        setCouponError(data.error?.message || 'Invalid coupon code');
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError('Network error verifying coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // Place Order Action
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setOrderError('');
    setIsSubmitting(true);

    // Determine final shipping address
    let finalAddress: any = null;
    if (!useNewAddress && user?.addresses && user.addresses[selectedAddressIndex]) {
      finalAddress = user.addresses[selectedAddressIndex];
    } else {
      if (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine1 || !newAddress.city || !newAddress.postalCode) {
        setOrderError('Please complete all required shipping address fields.');
        setIsSubmitting(false);
        return;
      }
      finalAddress = newAddress;
    }

    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.product._id,
          variantId: item.variant._id,
          quantity: item.quantity,
        })),
        shippingAddress: finalAddress,
        customerEmail: email || user?.email || 'shopper@amiceamarine.com',
        customerPhone: phone || finalAddress.phone,
        couponCode: appliedCoupon?.code,
        paymentMethod,
      };

      const res = await fetch(`${API_BASE}/checkout/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const orderNumber = data.data.orderNumber;

        // If payment method is Razorpay (prepaid online), initiate Razorpay payment
        if (paymentMethod === 'razorpay') {
          try {
            if (typeof (window as any).Razorpay === 'undefined') {
              await new Promise<void>((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
                document.body.appendChild(script);
              });
            }

            const rzpInitRes = await fetch(`${API_BASE}/payments/razorpay/create-order`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderNumber }),
            });
            const rzpInitData = await rzpInitRes.json();

            if (!rzpInitRes.ok || !rzpInitData.success) {
              throw new Error(rzpInitData.error?.message || 'Could not initiate Razorpay transaction');
            }

            const { orderId, amount, currency, keyId } = rzpInitData.data;

            const options = {
              key: keyId,
              amount,
              currency,
              name: 'Amice Amarine Atelier',
              description: `Order ${orderNumber}`,
              order_id: orderId,
              handler: async function (response: any) {
                try {
                  const verifyRes = await fetch(`${API_BASE}/payments/razorpay/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      orderNumber,
                      razorpayPaymentId: response.razorpay_payment_id,
                      razorpayOrderId: response.razorpay_order_id,
                      razorpaySignature: response.razorpay_signature,
                    }),
                  });
                  const verifyData = await verifyRes.json();
                  if (verifyRes.ok && verifyData.success) {
                    clearCart();
                    router.push(`/checkout/success?order=${orderNumber}&payment=verified`);
                  } else {
                    router.push(`/checkout/success?order=${orderNumber}&payment=pending`);
                  }
                } catch {
                  router.push(`/checkout/success?order=${orderNumber}&payment=pending`);
                }
              },
              prefill: {
                name: finalAddress.fullName,
                email: email || user?.email,
                contact: phone || finalAddress.phone,
              },
              theme: {
                color: '#C87856',
              },
            };

            const rzpInstance = new (window as any).Razorpay(options);
            rzpInstance.open();
            setIsSubmitting(false);
            return;
          } catch (e: any) {
            console.warn('Razorpay checkout failed, proceeding with order record', e);
            clearCart();
            router.push(`/checkout/success?order=${orderNumber}&payment=pending`);
            return;
          }
        }

        // For Cash on Delivery
        clearCart();
        router.push(`/checkout/success?order=${orderNumber}&payment=cod`);
      } else {
        setOrderError(data.error?.message || 'Failed to process order. Please try again.');
        setIsSubmitting(false);
      }
    } catch {
      setOrderError('Network error connecting to checkout server.');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-sage-900 font-serif">
          YOUR BAG IS EMPTY
        </h1>
        <p className="text-xs text-sage-500">
          You don&apos;t have any pieces in your bag to checkout.
        </p>
        <div className="pt-2">
          <Link href="/collections/all-products">
            <Button variant="glow" size="md">
              EXPLORE DROPS
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Checkout Breadcrumb */}
      <div className="border-b border-sage-200 pb-4 flex items-center justify-between">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs text-sage-600 hover:text-sage-900 transition-colors uppercase font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO BAG
        </Link>
        <span className="text-[11px] uppercase tracking-wider text-sage-800 flex items-center gap-1 font-semibold">
          <Lock className="w-3.5 h-3.5 text-terracotta-500" /> 256-BIT ENCRYPTED CHECKOUT
        </span>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Checkout Steps */}
        <div className="lg:col-span-7 space-y-8">
          {orderError && (
            <div className="p-4 bg-terracotta-50 border border-terracotta-200 text-terracotta-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{orderError}</span>
            </div>
          )}

          {/* STEP 1: CONTACT INFORMATION */}
          <section className="bg-white rounded-2xl border border-sage-200/80 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-sage-100 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-sage-900 flex items-center gap-2 font-serif">
                <span className="w-5 h-5 rounded-full bg-sage-900 text-linen-50 text-[10px] flex items-center justify-center font-bold">1</span>
                CUSTOMER CONTACT
              </h2>
              {!isAuthenticated && (
                <Link href="/account/login" className="text-[10px] text-terracotta-600 hover:underline uppercase font-semibold">
                  HAVE AN ACCOUNT? LOG IN
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="EMAIL ADDRESS (FOR ORDER CONFIRMATION)"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kenji@amiceamarine.com"
              />
              <Input
                label="PHONE NUMBER (+91 FOR DELIVERY UPDATES)"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
          </section>

          {/* STEP 2: SHIPPING ADDRESS */}
          <section className="bg-white rounded-2xl border border-sage-200/80 p-6 space-y-4 shadow-xs">
            <div className="border-b border-sage-100 pb-3 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-sage-900 flex items-center gap-2 font-serif">
                <span className="w-5 h-5 rounded-full bg-sage-900 text-linen-50 text-[10px] flex items-center justify-center font-bold">2</span>
                SHIPPING ADDRESS (ALL INDIA)
              </h2>
              {user?.addresses && user.addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setUseNewAddress(!useNewAddress)}
                  className="text-[10px] text-terracotta-600 hover:underline uppercase font-bold"
                >
                  {useNewAddress ? 'USE SAVED ADDRESS' : '+ NEW ADDRESS'}
                </button>
              )}
            </div>

            {/* Saved Addresses Selector */}
            {!useNewAddress && user?.addresses && user.addresses.length > 0 ? (
              <div className="space-y-3">
                <p className="text-[11px] text-sage-600 font-medium">SELECT DELIVERY LOCATION:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.addresses.map((addr, idx) => {
                    const isSelected = selectedAddressIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedAddressIndex(idx)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all space-y-1 relative ${
                          isSelected
                            ? 'border-terracotta-500 bg-terracotta-50/60 shadow-xs'
                            : 'border-sage-200 bg-linen-50/50 hover:border-sage-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-sage-900 uppercase font-serif">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[9px] uppercase bg-sage-900 text-linen-50 px-2 py-0.5 rounded-full font-semibold">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-sage-600 line-clamp-2">
                          {addr.addressLine1}, {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="text-[10px] text-sage-500">Phone: {addr.phone}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* New Address Manual Form */
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="RECIPIENT FULL NAME"
                    required
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    placeholder="e.g. Kenji Sato"
                  />
                  <Input
                    label="DELIVERY CONTACT PHONE"
                    required
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="STREET ADDRESS / BUILDING / FLAT NO."
                      required
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                      placeholder="e.g. Flat 402, Neo Heights, MG Road"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="LANDMARK / AREA (OPTIONAL)"
                      value={newAddress.addressLine2}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                      placeholder="Near City Center"
                    />
                  </div>
                  <Input
                    label="CITY"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                  />
                  <Input
                    label="STATE"
                    required
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    placeholder="e.g. Karnataka"
                  />
                  <Input
                    label="6-DIGIT PIN CODE"
                    required
                    maxLength={6}
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    placeholder="e.g. 560001"
                  />
                  <Input
                    label="COUNTRY"
                    value={newAddress.country}
                    disabled
                  />
                </div>
              </div>
            )}
          </section>

          {/* STEP 3: PAYMENT METHOD */}
          <section className="bg-white rounded-2xl border border-sage-200/80 p-6 space-y-4 shadow-xs">
            <div className="border-b border-sage-100 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-sage-900 flex items-center gap-2 font-serif">
                <span className="w-5 h-5 rounded-full bg-sage-900 text-linen-50 text-[10px] flex items-center justify-center font-bold">3</span>
                PAYMENT SELECTION
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Razorpay Online (Prepaid) */}
              <div
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-5 rounded-xl border cursor-pointer transition-all space-y-2 relative ${
                  paymentMethod === 'razorpay'
                    ? 'border-terracotta-500 bg-terracotta-50/60 shadow-xs'
                    : 'border-sage-200 bg-linen-50/50 hover:border-sage-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-terracotta-600" />
                    <span className="text-xs font-bold uppercase text-sage-900 font-serif">
                      PREPAID ONLINE
                    </span>
                  </div>
                  <span className="text-[9px] font-bold uppercase bg-sage-800 text-linen-50 px-2 py-0.5 rounded-full">
                    SAVE 10% EXTRA
                  </span>
                </div>
                <p className="text-[11px] text-sage-600">
                  Instant UPI (Google Pay, PhonePe, Paytm), All Debit/Credit Cards & Netbanking via Razorpay.
                </p>
                {paymentMethod === 'razorpay' && (
                  <span className="text-[10px] text-sage-800 font-bold block pt-1">
                    ✓ 10% Extra Prepaid Incentive Applied
                  </span>
                )}
              </div>

              {/* Option B: Cash on Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-5 rounded-xl border cursor-pointer transition-all space-y-2 relative ${
                  paymentMethod === 'cod'
                    ? 'border-terracotta-500 bg-terracotta-50/60 shadow-xs'
                    : 'border-sage-200 bg-linen-50/50 hover:border-sage-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-ochre-600" />
                    <span className="text-xs font-bold uppercase text-sage-900 font-serif">
                      CASH ON DELIVERY (COD)
                    </span>
                  </div>
                  <span className="text-[9px] text-sage-600 border border-sage-200 px-1.5 py-0.5 rounded-full">
                    +₹50 CONVENIENCE
                  </span>
                </div>
                <p className="text-[11px] text-sage-600">
                  Pay with cash or scan delivery QR code upon parcel arrival at your doorstep.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-sage-200/80 p-6 space-y-6 shadow-xs">
            <h3 className="text-xs uppercase font-bold tracking-wider text-sage-900 border-b border-sage-100 pb-3 font-serif">
              ORDER SUMMARY ({cart.length} PIECES)
            </h3>

            {/* Items List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs p-2 rounded-xl bg-linen-50/60 border border-sage-100">
                  <div className="relative w-14 aspect-[3/4] bg-linen-100 rounded-lg border border-sage-200 shrink-0 overflow-hidden">
                    <Image
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'}
                      alt={item.product.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sage-900 uppercase line-clamp-1 font-serif">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-sage-500">
                        SIZE: {item.variant.size} • QTY: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-sage-900">
                      {formatINR(item.product.basePrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Box */}
            <div className="pt-3 border-t border-sage-100 space-y-2">
              <label className="text-[11px] uppercase font-bold text-sage-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-terracotta-500" /> PROMO / COUPON CODE
              </label>

              {appliedCoupon ? (
                <div className="p-3 bg-sage-50 border border-sage-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-sage-900 uppercase">{appliedCoupon.code} APPLIED</span>
                    <p className="text-[10px] text-sage-600">Saved {formatINR(appliedCoupon.discountAmount)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-terracotta-600 hover:text-terracotta-700 text-[10px] uppercase underline font-semibold"
                  >
                    REMOVE
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="e.g. AMICE15"
                    className="flex-1 bg-white border border-sage-200 rounded-xl px-3 py-2 text-xs text-sage-900 uppercase placeholder:text-sage-400 focus:outline-none focus:border-terracotta-500 shadow-2xs"
                  />
                  <button
                    type="button"
                    disabled={couponLoading || !couponInput.trim()}
                    onClick={() => handleApplyCoupon()}
                    className="px-4 py-2 bg-sage-900 text-linen-50 rounded-xl text-xs font-semibold uppercase hover:bg-terracotta-600 transition-colors disabled:opacity-50 shadow-xs"
                  >
                    {couponLoading ? '...' : 'APPLY'}
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-[10px] text-terracotta-600 font-medium">{couponError}</p>
              )}

              {/* Quick coupons preview */}
              {!appliedCoupon && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[9px] text-sage-500 uppercase font-medium">SUGGESTIONS:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon('AMICE15')}
                    className="text-[9px] uppercase border border-sage-200 rounded-full px-2 py-0.5 text-sage-700 hover:border-terracotta-500 hover:text-terracotta-600 bg-white"
                  >
                    AMICE15 (15% OFF)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon('DROP100')}
                    className="text-[9px] uppercase border border-sage-200 rounded-full px-2 py-0.5 text-sage-700 hover:border-terracotta-500 hover:text-terracotta-600 bg-white"
                  >
                    DROP100 (₹100 OFF)
                  </button>
                </div>
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="pt-3 border-t border-sage-100 space-y-2 text-xs">
              <div className="flex justify-between text-sage-600">
                <span>Subtotal:</span>
                <span className="text-sage-900 font-bold">{formatINR(subtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-sage-800 font-medium">
                  <span>Coupon Discount ({appliedCoupon.code}):</span>
                  <span>-{formatINR(appliedCoupon.discountAmount)}</span>
                </div>
              )}

              {prepaidDiscount > 0 && (
                <div className="flex justify-between text-sage-800 font-medium">
                  <span>Prepaid 10% Bonus Discount:</span>
                  <span>-{formatINR(prepaidDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sage-600">
                <span>Shipping:</span>
                <span className={shippingFee === 0 ? 'text-sage-800 font-bold' : 'text-sage-900'}>
                  {shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}
                </span>
              </div>

              {codFee > 0 && (
                <div className="flex justify-between text-sage-600">
                  <span>COD Convenience Fee:</span>
                  <span className="text-sage-900">+{formatINR(codFee)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-sage-100 flex justify-between items-baseline text-sm font-bold text-sage-900">
                <span className="uppercase font-serif">Total Payable:</span>
                <span className="text-2xl text-terracotta-600 font-serif font-bold">
                  {formatINR(finalTotal)}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                variant="glow"
                size="lg"
                fullWidth
                disabled={isSubmitting}
                className="py-4 text-sm shadow-sm"
              >
                {isSubmitting ? (
                  'PROCESSING ORDER...'
                ) : (
                  <>PLACE ORDER ({formatINR(finalTotal)}) <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>

              <div className="text-[10px] text-sage-500 text-center space-y-1">
                <p>By placing this order you agree to Amice Amarine terms and shipping policy.</p>
                <p className="flex items-center justify-center gap-1.5 text-sage-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-sage-700" />
                  Razorpay Secured • 7-Day Size Exchanges
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
