'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowLeft, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [subject, setSubject] = useState('Order Tracking / Delivery Inquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-surface-border pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Storefront
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-crimson block font-bold">
          CUSTOMER RADAR // DIRECT COMMS
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display">
          CONTACT THE SYNDICATE
        </h1>
        <p className="text-xs text-zinc-400 font-mono">
          Need help with size fitting, live orders, or custom requests? We respond within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="p-5 bg-surface border border-surface-border space-y-3">
            <Mail className="w-6 h-6 text-brand-crimson" />
            <h3 className="text-xs font-bold uppercase text-white font-mono">EMAIL CONCIERGE</h3>
            <p className="text-[11px] text-zinc-400">
              For order assistance, exchanges, and wholesale:
            </p>
            <a
              href="mailto:support@amiceamarine.com"
              className="text-xs font-mono text-brand-crimson hover:underline block"
            >
              support@amiceamarine.com
            </a>
          </div>

          <div className="p-5 bg-surface border border-surface-border space-y-3">
            <Clock className="w-6 h-6 text-brand-cyan" />
            <h3 className="text-xs font-bold uppercase text-white font-mono">HOURS OF OPERATION</h3>
            <p className="text-[11px] text-zinc-400">
              Monday – Saturday: 10:00 AM – 7:00 PM IST<br />
              Sunday: Syndicate Rest & Drop R&D
            </p>
          </div>

          <div className="p-5 bg-surface border border-surface-border space-y-3">
            <MapPin className="w-6 h-6 text-brand-amber" />
            <h3 className="text-xs font-bold uppercase text-white font-mono">HEADQUARTERS & FULFILLMENT</h3>
            <p className="text-[11px] text-zinc-400">
              Amice Amarine Apparel Ltd.<br />
              Industrial Design District, Lower Parel<br />
              Mumbai, MH 400013, India
            </p>
          </div>

          <div className="p-4 bg-surface-subtle border border-surface-border text-center">
            <p className="text-xs font-mono text-zinc-400 mb-2">Already have an active order?</p>
            <Link href="/tracking">
              <Button variant="outline" size="sm" fullWidth>
                TRACK SATELLITE RADAR
              </Button>
            </Link>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          {isSent ? (
            <div className="bg-surface border border-emerald-500/50 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold uppercase text-white font-mono">
                DISPATCH TICKET LOGGED
              </h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Thank you for reaching out, <strong className="text-white">{name}</strong>. A support operative will review your message and reply to <strong className="text-white">{email}</strong> within 24 hours.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsSent(false);
                  setMessage('');
                }}
              >
                SEND ANOTHER MESSAGE
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-surface border border-surface-border p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="YOUR NAME"
                  placeholder="e.g. Kenji Sato"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="EMAIL ADDRESS"
                  type="email"
                  placeholder="e.g. kenji@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="ORDER NUMBER (OPTIONAL)"
                  placeholder="e.g. AA-2026-1234"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                    INQUIRY TOPIC
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-surface-subtle border border-surface-border px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-crimson font-mono"
                  >
                    <option value="Order Tracking / Delivery Inquiry">Order Tracking / Delivery</option>
                    <option value="Size Exchange / Return Request">Size Exchange / Return</option>
                    <option value="Fabric & Sizing Advice">Fabric & Sizing Advice</option>
                    <option value="Secret Drops / Syndicate Early Access">Secret Drops / Early Access</option>
                    <option value="Other">Other Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                  YOUR MESSAGE
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry or order details..."
                  className="w-full bg-surface-subtle border border-surface-border px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-crimson font-mono resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="glow"
                size="md"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
