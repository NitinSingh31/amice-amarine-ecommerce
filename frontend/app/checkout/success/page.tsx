'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'AA-2026-9901';
  const method = searchParams.get('method') || 'razorpay';
  const total = Number(searchParams.get('total')) || 2598;

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
        <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-crimson block font-bold">
          ORDER CONFIRMED // SYNDICATE DISPATCH
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-display">
          THANK YOU FOR YOUR ORDER
        </h1>
        <p className="text-xs font-mono text-zinc-400">
          Order Reference: <strong className="text-white">{orderNumber}</strong> • Total Paid:{' '}
          <strong className="text-brand-crimson">{formatINR(total)}</strong>
        </p>
      </div>

      {/* Order Status Timeline Card */}
      <div className="bg-surface border border-surface-border p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-white">
              DISPATCH TIMELINE
            </span>
            <p className="text-[11px] text-zinc-400 font-mono">
              Estimated Delivery across India: <strong className="text-emerald-400">{formattedDelivery}</strong>
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase bg-surface-subtle border border-surface-border px-2 py-1 text-zinc-300">
            {method === 'cod' ? 'CASH ON DELIVERY' : 'PREPAID ONLINE'}
          </span>
        </div>

        {/* 4-Step Fulfillment Tracker */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center mx-auto font-bold text-[10px]">
              ✓
            </div>
            <span className="text-[10px] font-bold text-white uppercase block">Placed</span>
            <span className="text-[9px] text-zinc-500">Just now</span>
          </div>

          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-brand-crimson text-white flex items-center justify-center mx-auto font-bold text-[10px] animate-pulse">
              2
            </div>
            <span className="text-[10px] font-bold text-brand-crimson uppercase block">Quality Check</span>
            <span className="text-[9px] text-zinc-500">Within 24h</span>
          </div>

          <div className="space-y-1 opacity-50">
            <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto font-bold text-[10px]">
              3
            </div>
            <span className="text-[10px] uppercase block text-zinc-400">Shipped</span>
            <span className="text-[9px] text-zinc-500">Bluedart</span>
          </div>

          <div className="space-y-1 opacity-50">
            <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto font-bold text-[10px]">
              4
            </div>
            <span className="text-[10px] uppercase block text-zinc-400">Delivered</span>
            <span className="text-[9px] text-zinc-500">{formattedDelivery}</span>
          </div>
        </div>

        {/* What to expect box */}
        <div className="p-4 bg-surface-subtle border border-surface-border text-xs font-mono text-zinc-400 space-y-1 leading-relaxed">
          <p className="text-white font-bold uppercase">WHAT HAPPENS NEXT?</p>
          <p>• A confirmation receipt has been sent to your email with your invoice details.</p>
          <p>• Once your streetwear items are inspected and packed, you will receive courier SMS tracking updates.</p>
          <p>• Need to adjust your size? 7-day hassle-free exchanges are available upon delivery.</p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/account" className="w-full sm:w-auto">
            <Button variant="glow" size="md" className="w-full">
              VIEW MY ORDERS <ArrowRight className="w-4 h-4 ml-1" />
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
        <div className="max-w-3xl mx-auto px-4 py-20 text-center font-mono text-xs text-zinc-500 animate-pulse">
          LOADING ORDER CONFIRMATION...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
