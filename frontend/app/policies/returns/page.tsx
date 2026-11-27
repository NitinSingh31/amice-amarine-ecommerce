import React from 'react';
import Link from 'next/link';
import { RefreshCcw, ShieldCheck, CheckCircle2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Exchanges // AMICE AMARINE',
  description: '7-day hassle-free size swaps and return policies for Amice Amarine anime streetwear pieces.',
};

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Navigation & Header */}
      <div className="space-y-3 border-b border-surface-border pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Storefront
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-crimson block font-bold">
          QUALITY GUARANTEE // UNCOMPROMISED SILHOUETTES
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display">
          RETURNS & EXCHANGES
        </h1>
        <p className="text-xs text-zinc-400 font-mono">
          Last updated: October 2026 • 7-Day Exchange Window
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-surface border border-surface-border space-y-2">
          <RefreshCcw className="w-5 h-5 text-brand-crimson" />
          <h3 className="text-xs font-bold uppercase text-white font-mono">7-DAY SIZE SWAP</h3>
          <p className="text-[11px] text-zinc-400">
            Complimentary size exchanges for oversized silhouettes within 7 days of delivery.
          </p>
        </div>

        <div className="p-4 bg-surface border border-surface-border space-y-2">
          <ShieldCheck className="w-5 h-5 text-brand-cyan" />
          <h3 className="text-xs font-bold uppercase text-white font-mono">DOORSTEP PICKUP</h3>
          <p className="text-[11px] text-zinc-400">
            Reverse pickup arranged automatically at your original delivery address.
          </p>
        </div>

        <div className="p-4 bg-surface border border-surface-border space-y-2">
          <CheckCircle2 className="w-5 h-5 text-brand-amber" />
          <h3 className="text-xs font-bold uppercase text-white font-mono">STORE CREDIT / REFUND</h3>
          <p className="text-[11px] text-zinc-400">
            Instant wallet credit or original bank source refund once quality inspected.
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className="space-y-8 text-xs leading-relaxed text-zinc-300 font-sans">
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <span className="text-brand-crimson">01.</span> ELIGIBILITY CRITERIA
          </h2>
          <p>
            To be eligible for an exchange or return:
          </p>
          <ul className="space-y-2 list-disc list-inside text-zinc-400">
            <li>The piece must be unworn, unwashed, and without perfume or cosmetic stains.</li>
            <li>Original garment tags, architectural zip cords, and holographic syndicate seals must remain intact.</li>
            <li>The return request must be initiated within 7 calendar days from the date of confirmed delivery.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <span className="text-brand-crimson">02.</span> HOW TO INITIATE AN EXCHANGE
          </h2>
          <p>
            1. Head to your customer dashboard at{' '}
            <Link href="/account" className="text-brand-crimson underline hover:text-white">
              /account
            </Link>{' '}
            or visit{' '}
            <Link href="/contact" className="text-brand-crimson underline hover:text-white">
              /contact
            </Link>.<br />
            2. Provide your Order Number (e.g., <code className="bg-surface px-1 py-0.5 text-white">AA-2026-XXXX</code>) and reason for exchange (e.g. need size L instead of M).<br />
            3. Our logistics courier will schedule reverse pickup within 24–48 hours.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <span className="text-brand-crimson">03.</span> DEFECTIVE OR DAMAGED ITEMS
          </h2>
          <p>
            Every Amice Amarine piece undergoes 2-stage quality assurance. In the rare event of a transit defect or incorrect item, notify us within 48 hours of delivery with photos of the garment and barcode label. We provide an immediate free priority replacement.
          </p>
        </section>
      </div>
    </div>
  );
}
