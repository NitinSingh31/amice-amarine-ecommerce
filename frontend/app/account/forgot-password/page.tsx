'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { API_BASE } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [devToken, setDevToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        if (data.data?.resetToken) {
          setDevToken(data.data.resetToken);
        }
      } else {
        setError(data.error?.message || 'Failed to dispatch reset transmission.');
      }
    } catch {
      setError('Network communication failure. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8 font-mono text-xs">
      <div className="space-y-3">
        <Link
          href="/account/login"
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-crimson block font-bold">
          SECURITY RECOVERY // CLEARANCE OVERRIDE
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-display">
          RECOVER ACCESS
        </h1>
        <p className="text-zinc-400">
          Enter your registered email address to receive password reset clearance instructions.
        </p>
      </div>

      {submitted ? (
        <div className="bg-surface border border-surface-border p-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-bold uppercase text-white font-mono">
            CLEARANCE TRANSMISSION SENT
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            If an operative account exists for <strong className="text-white">{email}</strong>, password reset instructions have been dispatched. Check your inbox and spam folder.
          </p>

          {devToken && (
            <div className="p-3 bg-surface-subtle border border-brand-cyan/40 space-y-2">
              <span className="text-[10px] uppercase font-bold text-brand-cyan block">
                DEVELOPER SANDBOX QUICK LINK:
              </span>
              <Link
                href={`/account/reset-password/${devToken}`}
                className="text-[11px] text-brand-crimson underline break-all block"
              >
                Click here to reset immediately in development
              </Link>
            </div>
          )}

          <div className="pt-2">
            <Link href="/account/login">
              <Button variant="outline" size="sm" fullWidth>
                RETURN TO LOGIN
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-surface border border-surface-border p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/50 text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="REGISTERED EMAIL"
            type="email"
            placeholder="operative@amiceamarine.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="glow"
            size="md"
            fullWidth
            disabled={loading}
          >
            {loading ? 'TRANSMITTING...' : 'SEND RESET INSTRUCTIONS'}
          </Button>
        </form>
      )}
    </div>
  );
}
