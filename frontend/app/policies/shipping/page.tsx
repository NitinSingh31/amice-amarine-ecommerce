import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Clock, ArrowLeft, AlertCircle } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy // AMICE AMARINE',
  description: 'Fast, secure all-India shipping terms and courier partners for Amice Amarine anime streetwear drops.',
};

export default function ShippingPolicyPage() {
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
          SYNDICATE LOGISTICS // DISPATCH DISCIPLINE
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display">
          SHIPPING POLICY
        </h1>
        <p className="text-xs text-zinc-400 font-mono">
          Last revised: October 2026 • Verified for PAN-India Delivery
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-surface border border-surface-border space-y-2">
          <Truck className="w-5 h-5 text-brand-crimson" />
          <h3 className="text-xs font-bold uppercase text-white font-mono">FREE SHIPPING</h3>
          <p className="text-[11px] text-zinc-400">
            Complimentary express dispatch on all prepaid & COD orders over ₹999.
          </p>
        </div>

        <div className="p-4 bg-surface border border-surface-border space-y-2">
          <Clock className="w-5 h-5 text-brand-cyan" />
          <h3 className="text-xs font-bold uppercase text-white font-mono">24-48H DISPATCH</h3>
          <p className="text-[11px] text-zinc-400">
            Orders pass rigorous inspection before air shipping via Delhivery or Bluedart.
          </p>
        </div>

        <div className="p-4 bg-surface border border-surface-border space-y-2">
          <ShieldCheck className="w-5 h-5 text-brand-amber" />
          <h3 className="text-xs font-bold uppercase text-white font-mono">LIVE RADAR TRACKING</h3>
          <p className="text-[11px] text-zinc-400">
            Real-time milestone updates with Air Waybill (AWB) copy at /tracking.
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className="space-y-8 text-xs leading-relaxed text-zinc-300 font-sans">
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <span className="text-brand-crimson">01.</span> DISPATCH & FULFILLMENT TIMELINES
          </h2>
          <p>
            All pieces from limited drops are manufactured from heavyweight 280–320 GSM luxury French Terry. Orders placed before 2:00 PM IST on business days are processed and passed to our fulfillment hub within 24–48 hours. During limited flash drops, dispatch may take up to 72 hours due to high volume.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <span className="text-brand-crimson">02.</span> DOMESTIC SHIPPING RATES (INDIA)
          </h2>
          <ul className="space-y-2 list-disc list-inside text-zinc-400">
            <li><strong>Orders above ₹999:</strong> FREE PAN-India Delivery.</li>
            <li><strong>Orders under ₹999:</strong> Flat ₹99 standard shipping fee.</li>
            <li><strong>Cash on Delivery (COD):</strong> Flat ₹50 courier verification surcharge applies.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <span className="text-brand-crimson">03.</span> ESTIMATED TRANSIT TIMES
          </h2>
          <div className="bg-surface border border-surface-border overflow-hidden">
            <table className="w-full text-left text-[11px] font-mono">
              <thead className="bg-surface-subtle text-zinc-400 border-b border-surface-border">
                <tr>
                  <th className="p-3">ZONE</th>
                  <th className="p-3">COVERAGE</th>
                  <th className="p-3">TRANSIT WINDOW</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-zinc-300">
                <tr>
                  <td className="p-3 font-bold text-white">Tier 1 Metro Hubs</td>
                  <td className="p-3">Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata</td>
                  <td className="p-3 text-brand-cyan">2 – 4 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Tier 2 & 3 Cities</td>
                  <td className="p-3">State capitals, major industrial and academic districts</td>
                  <td className="p-3 text-zinc-400">3 – 5 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Remote & Island Territories</td>
                  <td className="p-3">North-East states, J&K, Andaman & Nicobar</td>
                  <td className="p-3 text-zinc-400">5 – 8 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <span className="text-brand-crimson">04.</span> TRACKING YOUR CONSIGNMENT
          </h2>
          <p>
            Once your order leaves our facility, you will receive an SMS and WhatsApp notification containing your Air Waybill (AWB) number. You can monitor satellite milestones directly on our platform at{' '}
            <Link href="/tracking" className="text-brand-crimson underline hover:text-white">
              amiceamarine.com/tracking
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
