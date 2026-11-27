import React from 'react';
import Link from 'next/link';
import { FileText, Scale, AlertCircle, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions // AMICE AMARINE',
  description: 'Terms of service, purchasing agreements, and store conditions for Amice Amarine anime streetwear.',
};

export default function TermsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-surface-border pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Storefront
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-amber block font-bold">
          LEGAL FRAMEWORK // SYNDICATE CODE
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display">
          TERMS & CONDITIONS
        </h1>
        <p className="text-xs text-zinc-400 font-mono">
          Last revised: October 2026 • Governing Law: Jurisdiction of India
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-surface border border-surface-border space-y-2">
          <Scale className="w-5 h-5 text-brand-amber" />
          <h3 className="text-xs font-bold uppercase text-white font-mono">AUTHENTIC DROPS</h3>
          <p className="text-[11px] text-zinc-400">
            Original heavyweight streetwear apparel engineered in limited production runs.
          </p>
        </div>

        <div className="p-4 bg-surface border border-surface-border space-y-2">
          <FileText className="w-5 h-5 text-brand-cyan" />
          <h3 className="text-xs font-bold uppercase text-white font-mono">GST INVOICING</h3>
          <p className="text-[11px] text-zinc-400">
            Every transaction includes official 5% apparel GST invoices compliant with Indian tax laws.
          </p>
        </div>

        <div className="p-4 bg-surface border border-surface-border space-y-2">
          <AlertCircle className="w-5 h-5 text-brand-crimson" />
          <h3 className="text-xs font-bold uppercase text-white font-mono">ATOMIC INVENTORY</h3>
          <p className="text-[11px] text-zinc-400">
            Inventory is reserved on server confirmation. Price manipulation or scraping is prohibited.
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className="space-y-8 text-xs leading-relaxed text-zinc-300 font-sans">
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <span className="text-brand-amber">01.</span> AGREEMENT TO TERMS
          </h2>
          <p>
            By accessing Amice Amarine or submitting an order, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue use of the platform immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <span className="text-brand-amber">02.</span> PRICING & PAYMENT INTEGRITY
          </h2>
          <p>
            All listed prices are denominated in Indian Rupees (INR) and are inclusive of applicable GST taxes. The final payable total is calculated server-side. We reserve the right to cancel orders placed under erroneous price feeds or unauthorized promotional voucher usage.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <span className="text-brand-amber">03.</span> INTELLECTUAL PROPERTY
          </h2>
          <p>
            All architectural graphics, typography, photography, lookbook layouts, and branding associated with Amice Amarine are protected by copyright and intellectual property laws. Reproduction without written consent is strictly prohibited.
          </p>
        </section>
      </div>
    </div>
  );
}
