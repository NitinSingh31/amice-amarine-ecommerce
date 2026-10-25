'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth, UserAddress } from '@/context/AuthContext';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  ArrowLeft,
  Tag,
  CheckCircle2,
  AlertCircle,
  MapPin,
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
      const res = await fetch('http://localhost:5000/api/coupons/apply', {
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

      const res = await fetch('http://localhost:5000/api/checkout/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        clearCart();
        router.push(`/checkout/success?orderNumber=${data.data.orderNumber}&method=${paymentMethod}&total=${finalTotal}`);
      } else {
        setOrderError(data.error?.message || 'Failed to place order. Please try again.');
      }
    } catch {
      setOrderError('An unexpected server error occurred during order creation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-black uppercase tracking-tight text-white font-display">
          YOUR CART IS EMPTY
        </h1>
        <p className="text-xs text-zinc-400">
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
      <div className="border-b border-surface-border pb-4 flex items-center justify-between">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO CART
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1">
          <Lock className="w-3 h-3" /> 256-BIT ENCRYPTED CHECKOUT
        </span>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Checkout Steps */}
        <div className="lg:col-span-7 space-y-8">
          {orderError && (
            <div className="p-4 bg-brand-crimson/15 border border-brand-crimson text-brand-crimson text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{orderError}</span>
            </div>
          )}

          {/* STEP 1: CONTACT INFORMATION */}
          <section className="bg-surface border border-surface-border p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-crimson text-white text-[10px] flex items-center justify-center font-bold">1</span>
                CUSTOMER CONTACT
              </h2>
              {!isAuthenticated && (
                <Link href="/account/login" className="text-[10px] font-mono text-brand-crimson hover:underline uppercase">
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
          <section className="bg-surface border border-surface-border p-6 space-y-4">
            <div className="border-b border-surface-border pb-3 flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-crimson text-white text-[10px] flex items-center justify-center font-bold">2</span>
                SHIPPING ADDRESS (ALL INDIA)
              </h2>
              {user?.addresses && user.addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setUseNewAddress(!useNewAddress)}
                  className="text-[10px] font-mono text-brand-crimson hover:underline uppercase font-bold"
                >
                  {useNewAddress ? 'USE SAVED ADDRESS' : '+ NEW ADDRESS'}
                </button>
              )}
            </div>

            {/* Saved Addresses Selector */}
            {!useNewAddress && user?.addresses && user.addresses.length > 0 ? (
              <div className="space-y-3">
                <p className="text-[11px] font-mono text-zinc-400">SELECT DELIVERY LOCATION:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.addresses.map((addr, idx) => {
                    const isSelected = selectedAddressIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedAddressIndex(idx)}
                        className={`p-4 border cursor-pointer transition-all space-y-1 relative ${
                          isSelected
                            ? 'border-brand-crimson bg-brand-crimson/5 shadow-[0_0_12px_rgba(255,0,85,0.25)]'
                            : 'border-surface-border bg-surface-subtle hover:border-zinc-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white font-mono uppercase">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[8px] font-mono uppercase bg-brand-crimson text-white px-1.5 py-0.5 font-bold">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-zinc-400 line-clamp-2">
                          {addr.addressLine1}, {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="text-[10px] font-mono text-zinc-500">Phone: {addr.phone}</p>
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
                      placeholder="e.g. Flat 402, Neo Tokyo Heights, MG Road"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="LANDMARK / AREA (OPTIONAL)"
                      value={newAddress.addressLine2}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                      placeholder="Near Cyber Hub"
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
          <section className="bg-surface border border-surface-border p-6 space-y-4">
            <div className="border-b border-surface-border pb-3">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-crimson text-white text-[10px] flex items-center justify-center font-bold">3</span>
                PAYMENT SELECTION
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Razorpay Online (Prepaid) */}
              <div
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-5 border cursor-pointer transition-all space-y-2 relative ${
                  paymentMethod === 'razorpay'
                    ? 'border-brand-crimson bg-brand-crimson/5 shadow-[0_0_15px_rgba(255,0,85,0.3)]'
                    : 'border-surface-border bg-surface-subtle hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-brand-crimson" />
                    <span className="text-xs font-bold font-mono uppercase text-white">
                      PREPAID ONLINE
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase bg-emerald-500 text-black px-1.5 py-0.5">
                    SAVE 10% EXTRA
                  </span>
                </div>
                <p className="text-[11px] font-mono text-zinc-400">
                  Instant UPI (Google Pay, PhonePe, Paytm), All Debit/Credit Cards & Netbanking via Razorpay.
                </p>
                {paymentMethod === 'razorpay' && (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold block pt-1">
                    ✓ 10% Extra Prepaid Incentive Applied
                  </span>
                )}
              </div>

              {/* Option B: Cash on Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-5 border cursor-pointer transition-all space-y-2 relative ${
                  paymentMethod === 'cod'
                    ? 'border-brand-crimson bg-brand-crimson/5 shadow-[0_0_15px_rgba(255,0,85,0.3)]'
                    : 'border-surface-border bg-surface-subtle hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold font-mono uppercase text-white">
                      CASH ON DELIVERY (COD)
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400 border border-surface-border px-1 py-0.5">
                    +₹50 CONVENIENCE
                  </span>
                </div>
                <p className="text-[11px] font-mono text-zinc-400">
                  Pay with cash or scan delivery QR code upon parcel arrival at your doorstep.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface border border-surface-border p-6 space-y-6">
            <h3 className="text-xs font-mono uppercase font-bold tracking-wider text-white border-b border-surface-border pb-3">
              ORDER SUMMARY ({cart.length} PIECES)
            </h3>

            {/* Items List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs font-mono">
                  <div className="relative w-14 aspect-[3/4] bg-zinc-900 border border-surface-border shrink-0 overflow-hidden">
                    <Image
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'}
                      alt={item.product.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white uppercase line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-zinc-400">
                        SIZE: {item.variant.size} • QTY: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-white">
                      {formatINR(item.product.basePrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Box */}
            <div className="pt-3 border-t border-surface-border space-y-2">
              <label className="text-[11px] font-mono uppercase font-bold text-zinc-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-brand-crimson" /> PROMO / COUPON CODE
              </label>

              {appliedCoupon ? (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="font-bold text-emerald-400 uppercase">{appliedCoupon.code} APPLIED</span>
                    <p className="text-[10px] text-zinc-400">Saved {formatINR(appliedCoupon.discountAmount)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-zinc-500 hover:text-brand-crimson text-[10px] uppercase underline"
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
                    className="flex-1 bg-surface-subtle border border-surface-border px-3 py-2 text-xs font-mono text-white uppercase placeholder:text-zinc-600 focus:outline-none focus:border-brand-crimson"
                  />
                  <button
                    type="button"
                    disabled={couponLoading || !couponInput.trim()}
                    onClick={() => handleApplyCoupon()}
                    className="px-4 py-2 bg-white text-black text-xs font-bold font-mono uppercase hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'APPLY'}
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-[10px] font-mono text-brand-crimson">{couponError}</p>
              )}

              {/* Quick coupons preview */}
              {!appliedCoupon && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">SUGGESTIONS:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon('AMICE15')}
                    className="text-[9px] font-mono uppercase border border-surface-border px-1.5 py-0.5 text-zinc-400 hover:text-brand-crimson hover:border-brand-crimson"
                  >
                    AMICE15 (15% OFF)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon('DROP100')}
                    className="text-[9px] font-mono uppercase border border-surface-border px-1.5 py-0.5 text-zinc-400 hover:text-brand-crimson hover:border-brand-crimson"
                  >
                    DROP100 (₹100 OFF)
                  </button>
                </div>
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="pt-3 border-t border-surface-border space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal:</span>
                <span className="text-white font-bold">{formatINR(subtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount ({appliedCoupon.code}):</span>
                  <span>-{formatINR(appliedCoupon.discountAmount)}</span>
                </div>
              )}

              {prepaidDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Prepaid 10% Bonus Discount:</span>
                  <span>-{formatINR(prepaidDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-400">
                <span>Shipping:</span>
                <span className={shippingFee === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                  {shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}
                </span>
              </div>

              {codFee > 0 && (
                <div className="flex justify-between text-zinc-400">
                  <span>COD Convenience Fee:</span>
                  <span className="text-white">+{formatINR(codFee)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-surface-border flex justify-between items-baseline text-sm font-bold text-white">
                <span className="uppercase">Total Payable:</span>
                <span className="text-xl text-brand-crimson font-mono">
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
                className="py-4 text-sm"
              >
                {isSubmitting ? (
                  'PROCESSING ORDER...'
                ) : (
                  <>PLACE ORDER ({formatINR(finalTotal)}) <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>

              <div className="text-[10px] text-zinc-500 font-mono text-center space-y-1">
                <p>By placing this order you agree to Amice Amarine terms and shipping policy.</p>
                <p className="flex items-center justify-center gap-1.5 text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
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
