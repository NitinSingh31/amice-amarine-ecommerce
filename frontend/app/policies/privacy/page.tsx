import React from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck, EyeOff, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy // AMICE AMARINE',
  description: 'Data encryption, customer privacy standards, and security protocols for Amice Amarine anime streetwear.',
};

export default function PrivacyPolicyPage() {
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
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-cyan block font-bold">
          SECURITY PROTOCOLS // CIPHER SAFEGUARD
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display">
          PRIVACY POLICY
        </h1>
        <p className="text-xs text-zinc-400 font-mono">
          Effective: October 2026 • Encrypted 256-bit Architecture
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-surface border border-surface-border space-y-2">
          <Lock className="w-5 h-5 text-brand-cyan" />
          <h3 className="text-xs font-bold uppercase text-white font-mono">256-BIT ENCRYPTION</h3>
          <p className="text-[11px] text-zinc-400">
            All customer accounts, credentials, and sessions are hashed with bcrypt and TLS 1.3 encryption.
          </p>
        </div>

        <div className="p-4 bg-surface border border-surface-border space-y-2">
          <EyeOff className="w-5 h-5 text-brand-crimson" />
          <h3 className="text-xs font-bold uppercase text-white font-mono">ZERO CARD DATA HELD</h3>
          <p className="text-[11px] text-zinc-400">
            Payment transactions are processed directly by RBI-licensed Razorpay payment infrastructure.
          </p>
        </div>

        <div className="p-4 bg-surface border border-surface-border space-y-2">
          <ShieldCheck className="w-5 h-5 text-brand-amber" />
          <h3 className="text-xs font-bold uppercase text-white font-mono">NO SPAM GUARANTEE</h3>
          <p className="text-[11px] text-zinc-400">
            We only send critical dispatch alerts, Air Waybill tracking, and secret drop invitations.
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className="space-y-8 text-xs leading-relaxed text-zinc-300 font-sans">
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <span className="text-brand-cyan">01.</span> INFORMATION WE COLLECT
          </h2>
          <p>
            When you purchase garments from Amice Amarine, we collect your shipping address, email address, phone number, and order history strictly for logistics fulfillment, GST invoicing, and milestone delivery notifications.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <span className="text-brand-cyan">02.</span> HOW WE PROTECT YOUR DATA
          </h2>
          <p>
            Customer authentication uses JWT tokens stored in HttpOnly, SameSite, Secure cookies. Passwords are never stored in plaintext and are salted with 12 bcrypt rounds. Zero telemetry or personal identification data is ever sold or leased to third-party ad brokers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <span className="text-brand-cyan">03.</span> THIRD-PARTY PARTNERS
          </h2>
          <p>
            We share only essential logistics data with verified third-party courier partners (Delhivery Express, Bluedart) and payment processing gateways (Razorpay) to fulfill and dispatch your consignments safely.
          </p>
        </section>
      </div>
    </div>
  );
}
