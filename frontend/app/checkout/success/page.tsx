'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  Search,
} from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'AA-2026-5729';
  const method = searchParams.get('method') || 'razorpay';
  const total = Number(searchParams.get('total')) || 3057;

  const today = new Date();
  const deliveryDate = new Date();
  deliveryDate.setDate(today.getDate() + 3);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 space-y-10">
      {/* Success Badge & Headline */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center mx-auto text-sage-800 shadow-xs">
          <CheckCircle2 className="w-8 h-8 text-sage-800" />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-terracotta-600 block font-semibold">
          ORDER CONFIRMED // DISPATCH INITIATED
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-sage-900 font-serif">
          THANK YOU FOR YOUR ORDER
        </h1>
        <p className="text-xs text-sage-600">
          Order Reference: <strong className="text-sage-900">{orderNumber}</strong> • Total Paid:{' '}
          <strong className="text-terracotta-600 font-bold">{formatINR(total)}</strong>
        </p>
      </div>

      {/* Order Status Timeline Card */}
      <div className="bg-white rounded-2xl border border-sage-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-sage-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase text-sage-900 font-serif">
              DISPATCH TIMELINE
            </span>
            <p className="text-[11px] text-sage-600">
              Estimated Delivery across India: <strong className="text-sage-900 font-semibold">{formattedDelivery}</strong>
            </p>
          </div>
          <span className="text-[10px] uppercase bg-linen-100 border border-sage-200 rounded-full px-3 py-1 text-sage-700 font-medium">
            {method === 'cod' ? 'CASH ON DELIVERY' : 'PREPAID ONLINE (RAZORPAY)'}
          </span>
        </div>

        {/* 4-Step Fulfillment Tracker */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-sage-900 text-linen-50 flex items-center justify-center mx-auto font-bold text-[10px]">
              ✓
            </div>
            <span className="text-[10px] font-semibold text-sage-900 uppercase block">Placed</span>
            <span className="text-[9px] text-sage-500">Just now</span>
          </div>

          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-terracotta-500 text-white flex items-center justify-center mx-auto font-bold text-[10px] animate-pulse">
              2
            </div>
            <span className="text-[10px] font-semibold text-terracotta-600 uppercase block">Quality Check</span>
            <span className="text-[9px] text-sage-500">Within 24h</span>
          </div>

          <div className="space-y-1 opacity-50">
            <div className="w-8 h-8 rounded-full bg-linen-200 text-sage-500 flex items-center justify-center mx-auto font-bold text-[10px]">
              3
            </div>
            <span className="text-[10px] uppercase block text-sage-600 font-medium">Shipped</span>
            <span className="text-[9px] text-sage-500">Express Delivery</span>
          </div>

          <div className="space-y-1 opacity-50">
            <div className="w-8 h-8 rounded-full bg-linen-200 text-sage-500 flex items-center justify-center mx-auto font-bold text-[10px]">
              4
            </div>
            <span className="text-[10px] uppercase block text-sage-600 font-medium">Delivered</span>
            <span className="text-[9px] text-sage-500">{formattedDelivery}</span>
          </div>
        </div>

        {/* What to expect box */}
        <div className="p-4 bg-linen-100 rounded-xl border border-sage-200/80 text-xs text-sage-700 space-y-1 leading-relaxed">
          <p className="text-sage-900 font-bold uppercase font-serif">WHAT HAPPENS NEXT?</p>
          <p>• A confirmation receipt has been sent to your email with your tax invoice details.</p>
          <p>• Once your items are inspected and packed, you will receive courier SMS tracking updates.</p>
          <p>• Need to adjust your size? 7-day hassle-free exchanges are available upon delivery.</p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href={'/tracking?order=' + orderNumber} className="w-full sm:w-auto">
            <Button variant="glow" size="md" className="w-full gap-2 shadow-xs">
              <Search className="w-4 h-4" /> TRACK SHIPMENT LIVE
            </Button>
          </Link>
          <Link href="/account" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full">
              MY ORDERS ARCHIVE
            </Button>
          </Link>
          <Link href="/collections/all-products" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full">
              CONTINUE BROWSING
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-20 text-center text-xs text-sage-500 animate-pulse font-medium">
          LOADING ORDER CONFIRMATION...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
