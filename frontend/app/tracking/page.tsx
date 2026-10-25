'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Printer,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  XCircle,
  FileText,
  MapPin,
  Calendar,
} from 'lucide-react';

interface Stage {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  timestamp: string | null;
}

interface OrderItem {
  productId: string;
  variantId: string;
  productName: string;
  variantTitle: string;
  sku: string;
  image: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

interface OrderTrackingData {
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  courierPartner: string;
  trackingAwb: string;
  estimatedDelivery: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  couponCode?: string;
  stages: Stage[];
  isCancellable: boolean;
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialOrder = searchParams.get('order') || '';

  const [orderInput, setOrderInput] = useState(initialOrder);
  const [phoneInput, setPhoneInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<OrderTrackingData | null>(null);
  const [copiedAwb, setCopiedAwb] = useState(false);

  // Modals
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Ordered wrong size / style');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  const fetchTracking = async (orderNum: string, phoneNum?: string) => {
    if (!orderNum.trim()) return;
    setIsLoading(true);
    setError(null);
    setCancelSuccessMsg(null);

    try {
      let url = 'http://localhost:5000/api/orders/track/' + encodeURIComponent(orderNum.trim());
      if (phoneNum && phoneNum.trim()) {
        url += '?phone=' + encodeURIComponent(phoneNum.trim());
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Order tracking not found.');
      }

      setOrderData(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order tracking.');
      setOrderData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrder) {
      setOrderInput(initialOrder);
      fetchTracking(initialOrder);
    }
  }, [initialOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderInput.trim()) return;
    router.push('/tracking?order=' + encodeURIComponent(orderInput.trim()));
    fetchTracking(orderInput, phoneInput);
  };

  const handleCopyAwb = () => {
    if (!orderData?.trackingAwb) return;
    navigator.clipboard.writeText(orderData.trackingAwb);
    setCopiedAwb(true);
    setTimeout(() => setCopiedAwb(false), 2000);
  };

  const handleCancelOrder = async () => {
    if (!orderData) return;
    setIsCancelling(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('amice_token') : null;
      const res = await fetch('http://localhost:5000/api/orders/' + orderData.orderNumber + '/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: 'Bearer ' + token }),
        },
        body: JSON.stringify({ reason: cancelReason }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Could not cancel order.');
      }

      setCancelSuccessMsg('Order has been cancelled successfully. Any reserved inventory was restored.');
      setIsCancelModalOpen(false);
      fetchTracking(orderData.orderNumber);
    } catch (err: any) {
      alert(err.message || 'Cancellation failed.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16 space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-crimson block font-bold">
          SYNDICATE LOGISTICS // LIVE RADAR
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display">
          TRACK YOUR GEAR
        </h1>
        <p className="text-xs font-mono text-zinc-400 max-w-lg mx-auto">
          Real-time GPS telemetry, dispatch milestones, and express courier tracking for your oversized streetwear drop.
        </p>
      </div>

      {/* Lookup Bar */}
      <div className="bg-surface border border-surface-border p-5 sm:p-6 shadow-2xl">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              placeholder="ENTER ORDER NUMBER (E.G. AA-2026-5729)"
              value={orderInput}
              onChange={(e) => setOrderInput(e.target.value)}
              className="w-full bg-surface-subtle border border-surface-border px-4 py-3 text-xs font-mono text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-brand-crimson transition-colors"
            />
          </div>
          <div className="sm:col-span-4 relative">
            <input
              type="text"
              placeholder="PHONE NUMBER (OPTIONAL)"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full bg-surface-subtle border border-surface-border px-4 py-3 text-xs font-mono text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-brand-crimson transition-colors"
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              variant="glow"
              size="md"
              disabled={isLoading || !orderInput.trim()}
              className="w-full h-full py-3"
            >
              {isLoading ? 'SCANNING...' : 'LOCATE'}
            </Button>
          </div>
        </form>

        {/* Quick Demo Pill */}
        <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-zinc-500">
          <span>Quick Demo Test:</span>
          <button
            type="button"
            onClick={() => {
              setOrderInput('AA-2026-5729');
              fetchTracking('AA-2026-5729');
            }}
            className="text-brand-crimson hover:underline uppercase font-bold"
          >
            AA-2026-5729
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/50 flex items-center gap-3 text-xs font-mono text-red-300">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Cancel Success Alert */}
      {cancelSuccessMsg && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 flex items-center gap-3 text-xs font-mono text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{cancelSuccessMsg}</span>
        </div>
      )}

      {/* Loaded Order Display */}
      {orderData && (
        <div className="space-y-8 animate-fadeIn">
          {/* Order Snapshot Header */}
          <div className="bg-surface border border-surface-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xl font-black font-display text-white">
                  {orderData.orderNumber}
                </span>
                <span
                  className={'text-[10px] font-mono uppercase px-2.5 py-0.5 font-bold border ' +
                    (orderData.status === 'cancelled'
                      ? 'bg-red-950/60 text-red-400 border-red-500/50'
                      : orderData.status === 'delivered'
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/50'
                      : 'bg-brand-crimson/10 text-brand-crimson border-brand-crimson/40')
                  }
                >
                  {orderData.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400">
                Booked on: {new Date(orderData.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* CTAs: Invoice & Cancel */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsInvoiceOpen(true)}
                className="gap-2 text-[11px]"
              >
                <FileText className="w-3.5 h-3.5" /> TAX INVOICE
              </Button>

              {orderData.isCancellable && orderData.status !== 'cancelled' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCancelModalOpen(true)}
                  className="gap-2 text-[11px] border-red-900/50 text-red-400 hover:bg-red-950/30 hover:border-red-500"
                >
                  <XCircle className="w-3.5 h-3.5" /> CANCEL ORDER
                </Button>
              )}
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="bg-surface border border-surface-border p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-surface-border pb-4">
              <div>
                <h3 className="text-sm font-black font-display uppercase text-white">
                  SHIPMENT RADAR // MILESTONES
                </h3>
                <p className="text-[11px] font-mono text-zinc-400">
                  Estimated Delivery Date:{' '}
                  <strong className="text-white">
                    {new Date(orderData.estimatedDelivery).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </strong>
                </p>
              </div>

              {/* Courier Badge */}
              <div className="flex items-center gap-2 bg-surface-subtle border border-surface-border px-3 py-1.5 font-mono text-xs">
                <Truck className="w-4 h-4 text-brand-crimson" />
                <span className="text-zinc-300 font-bold uppercase">{orderData.courierPartner}</span>
                <span className="text-zinc-500">|</span>
                <span className="text-zinc-400">{orderData.trackingAwb}</span>
                <button
                  type="button"
                  onClick={handleCopyAwb}
                  className="text-zinc-400 hover:text-white transition-colors"
                  title="Copy Tracking AWB"
                >
                  {copiedAwb ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Stepper Grid */}
            <div className="relative pl-6 sm:pl-0 sm:grid sm:grid-cols-6 gap-2 pt-2">
              {orderData.stages.map((stage, idx) => {
                const isCurrent =
                  stage.isCompleted &&
                  (idx === orderData.stages.length - 1 || !orderData.stages[idx + 1].isCompleted);

                return (
                  <div key={stage.id} className="relative mb-6 sm:mb-0 sm:text-center space-y-2">
                    {/* Circle Node */}
                    <div
                      className={'w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold font-mono transition-all ' +
                        (stage.isCompleted
                          ? isCurrent
                            ? 'bg-brand-crimson text-white shadow-[0_0_20px_rgba(255,0,60,0.6)] ring-2 ring-brand-crimson ring-offset-2 ring-offset-black animate-pulse'
                            : 'bg-emerald-500 text-black'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700')
                      }
                    >
                      {stage.isCompleted ? (isCurrent ? idx + 1 : '✓') : idx + 1}
                    </div>

                    {/* Stage Title */}
                    <div>
                      <span
                        className={'text-[11px] font-bold uppercase block font-mono ' +
                          (stage.isCompleted ? 'text-white' : 'text-zinc-500')
                        }
                      >
                        {stage.title}
                      </span>
                      <p className="text-[10px] font-mono text-zinc-400 mt-0.5 leading-snug">
                        {stage.description}
                      </p>
                      {stage.timestamp && (
                        <span className="text-[9px] font-mono text-zinc-500 block mt-1">
                          {new Date(stage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2-Column: Destination & Order Items */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Destination & Payment Details */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-surface border border-surface-border p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-surface-border pb-3 text-xs font-bold font-mono text-white uppercase">
                  <MapPin className="w-4 h-4 text-brand-crimson" /> DELIVERY DESTINATION
                </div>
                <div className="text-xs font-mono text-zinc-300 space-y-1">
                  <p className="text-white font-bold">{orderData.shippingAddress.fullName}</p>
                  <p className="text-zinc-400">{orderData.shippingAddress.addressLine1}</p>
                  {orderData.shippingAddress.addressLine2 && <p className="text-zinc-400">{orderData.shippingAddress.addressLine2}</p>}
                  <p>
                    {orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.postalCode}
                  </p>
                  <p className="text-zinc-500">{orderData.shippingAddress.country}</p>
                  <p className="text-zinc-400 pt-2">Phone: <strong className="text-white">{orderData.shippingAddress.phone}</strong></p>
                </div>
              </div>

              <div className="bg-surface border border-surface-border p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-surface-border pb-3 text-xs font-bold font-mono text-white uppercase">
                  <Package className="w-4 h-4 text-brand-crimson" /> PAYMENT DISPATCH METHOD
                </div>
                <div className="text-xs font-mono space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Payment Gateway:</span>
                    <span className="text-white uppercase font-bold">{orderData.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Payment Status:</span>
                    <span className="text-emerald-400 uppercase font-bold">{orderData.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Courier Partner:</span>
                    <span className="text-zinc-200">{orderData.courierPartner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Air Waybill (AWB):</span>
                    <span className="text-brand-crimson font-bold">{orderData.trackingAwb}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Ordered Items & Billing Summary */}
            <div className="md:col-span-7 bg-surface border border-surface-border p-6 space-y-6">
              <div className="border-b border-surface-border pb-3">
                <h3 className="text-xs font-bold font-mono text-white uppercase">
                  ORDERED GARMENTS ({orderData.items.reduce((s, i) => s + i.quantity, 0)})
                </h3>
              </div>

              <div className="space-y-4">
                {orderData.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-3 bg-surface-subtle border border-surface-border">
                    <div className="w-16 h-20 bg-zinc-900 border border-surface-border shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-black font-display uppercase text-white truncate">
                        {item.productName}
                      </h4>
                      <p className="text-[10px] font-mono text-zinc-400">{item.variantTitle}</p>
                      <p className="text-[10px] font-mono text-zinc-500">SKU: {item.sku}</p>
                      <div className="flex justify-between items-center pt-1 text-xs font-mono">
                        <span className="text-zinc-400">Qty: {item.quantity}</span>
                        <span className="text-white font-bold">{formatINR(item.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation breakdown */}
              <div className="border-t border-surface-border pt-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Garments Subtotal:</span>
                  <span className="text-white">{formatINR(orderData.subtotal)}</span>
                </div>
                {orderData.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount Applied ({orderData.couponCode || 'Promo'}):</span>
                    <span>-{formatINR(orderData.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Standard Logistics:</span>
                  <span className="text-white">{orderData.shippingFee === 0 ? 'FREE' : formatINR(orderData.shippingFee)}</span>
                </div>
                <div className="border-t border-surface-border pt-3 flex justify-between text-sm font-black text-white">
                  <span>TOTAL PAID:</span>
                  <span className="text-brand-crimson text-base">{formatINR(orderData.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INVOICE MODAL */}
      {isInvoiceOpen && orderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-white text-black w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 font-mono text-xs space-y-6 shadow-2xl rounded-none">
            {/* Invoice Top Header */}
            <div className="flex justify-between items-start border-b-2 border-black pb-4">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">AMICE AMARINE</h2>
                <p className="text-[10px] text-zinc-600">Amice Amarine Apparel Private Limited</p>
                <p className="text-[10px] text-zinc-600">Plot 42, Neon Sector, Shibuya Tech District, Mumbai - 400001</p>
                <p className="text-[10px] font-bold">GSTIN: 27AABCA1234F1Z5 | HSN: 61091000</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase bg-black text-white px-2 py-0.5 inline-block">
                  TAX INVOICE
                </span>
                <p className="text-xs font-bold mt-1">INV-{orderData.orderNumber.replace(/[^0-9]/g, '')}</p>
                <p className="text-[10px] text-zinc-600">
                  Date: {new Date(orderData.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>

            {/* Billed To / Shipped To */}
            <div className="grid grid-cols-2 gap-4 border-b border-zinc-200 pb-4">
              <div>
                <span className="font-bold uppercase text-[10px] text-zinc-500 block">BILLED TO / SHIP TO:</span>
                <p className="font-bold">{orderData.shippingAddress.fullName}</p>
                <p className="text-zinc-600">{orderData.shippingAddress.addressLine1}</p>
                <p className="text-zinc-600">{orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.postalCode}</p>
                <p className="text-zinc-600">Phone: {orderData.shippingAddress.phone}</p>
              </div>
              <div className="text-right">
                <span className="font-bold uppercase text-[10px] text-zinc-500 block">ORDER DETAILS:</span>
                <p>Order No: <strong>{orderData.orderNumber}</strong></p>
                <p>Payment: <strong className="uppercase">{orderData.paymentMethod}</strong> ({orderData.paymentStatus})</p>
                <p>Logistics: <strong>{orderData.courierPartner}</strong></p>
                <p>AWB: <strong>{orderData.trackingAwb}</strong></p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-black text-left uppercase text-[10px]">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">HSN</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {orderData.items.map((i, idx) => (
                  <tr key={idx}>
                    <td className="py-2">
                      <p className="font-bold">{i.productName}</p>
                      <p className="text-[10px] text-zinc-500">{i.variantTitle} | {i.sku}</p>
                    </td>
                    <td className="py-2 text-center text-zinc-600">61091000</td>
                    <td className="py-2 text-center">{i.quantity}</td>
                    <td className="py-2 text-right">{formatINR(i.unitPrice)}</td>
                    <td className="py-2 text-right font-bold">{formatINR(i.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tax Computation Breakdown */}
            <div className="border-t-2 border-black pt-4 flex justify-between items-start">
              <div className="text-[10px] text-zinc-600 space-y-1 max-w-xs">
                <p>GST Included: 5% Apparel GST (CGST 2.5% + SGST 2.5%).</p>
                <p>This is a computer-generated tax invoice. No physical signature required.</p>
              </div>
              <div className="w-64 space-y-1.5 text-right">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Subtotal:</span>
                  <span>{formatINR(orderData.subtotal)}</span>
                </div>
                {orderData.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-{formatINR(orderData.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-600">Shipping:</span>
                  <span>{orderData.shippingFee === 0 ? 'FREE' : formatINR(orderData.shippingFee)}</span>
                </div>
                <div className="flex justify-between font-black text-sm border-t border-black pt-2">
                  <span>TOTAL AMOUNT:</span>
                  <span>{formatINR(orderData.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="border-t border-zinc-200 pt-4 flex justify-end gap-3 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-black text-white font-bold flex items-center gap-2 hover:bg-zinc-800"
              >
                <Printer className="w-4 h-4" /> PRINT INVOICE
              </button>
              <button
                type="button"
                onClick={() => setIsInvoiceOpen(false)}
                className="px-4 py-2 border border-zinc-400 font-bold hover:bg-zinc-100"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCELLATION MODAL */}
      {isCancelModalOpen && orderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-surface border border-surface-border p-6 max-w-md w-full space-y-5 font-mono text-xs">
            <div className="flex items-center gap-2 text-red-400 font-bold uppercase">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              CONFIRM ORDER CANCELLATION
            </div>
            <p className="text-zinc-300">
              Are you sure you want to cancel order <strong className="text-white">{orderData.orderNumber}</strong>?
              This will restore all items back to inventory.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 uppercase block">Reason for cancellation:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-surface-subtle border border-surface-border px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-crimson"
              >
                <option value="Ordered wrong size / style">Ordered wrong size / style</option>
                <option value="Found alternative anime streetwear piece">Found alternative streetwear piece</option>
                <option value="Need to change delivery address">Need to change delivery address</option>
                <option value="Change of mind">Change of mind</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={isCancelling}
              >
                KEEP ORDER
              </Button>
              <Button
                variant="glow"
                size="sm"
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                {isCancelling ? 'CANCELLING...' : 'CONFIRM CANCEL'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-20 text-center font-mono text-xs text-zinc-500 animate-pulse">
          INITIALIZING SYNDICATE SATELLITE RADAR...
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}
