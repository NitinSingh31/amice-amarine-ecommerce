'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, Mail, ArrowRight, Shield, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push('/account');
    } else {
      setError(res.message || 'Invalid email or password.');
    }
  };

  const fillDemoCustomer = () => {
    setEmail('shopper@amiceamarine.com');
    setPassword('Customer@Amice2026!');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@amiceamarine.com');
    setPassword('Admin@Amice2026!');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-crimson block">
          AMICE AMARINE SYNDICATE
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-display">
          CUSTOMER LOGIN
        </h1>
        <p className="text-xs text-zinc-400">
          Sign in to access your order archives, saved addresses, and secret drops.
        </p>
      </div>

      {/* Quick Demo Fill Buttons for Testing */}
      <div className="p-3 bg-surface border border-surface-border space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">
          ⚡ QUICK DEMO CREDENTIALS:
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={fillDemoCustomer}
            className="p-2 border border-surface-border bg-surface-subtle hover:border-brand-crimson hover:text-brand-crimson text-left transition-colors"
          >
            <div className="text-[10px] font-bold text-white uppercase">Demo Customer</div>
            <div className="text-[9px] text-zinc-500 truncate">shopper@amice...</div>
          </button>
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="p-2 border border-surface-border bg-surface-subtle hover:border-brand-cyan hover:text-brand-cyan text-left transition-colors"
          >
            <div className="text-[10px] font-bold text-white uppercase">Super Admin</div>
            <div className="text-[9px] text-zinc-500 truncate">admin@amice...</div>
          </button>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-surface p-6 sm:p-8 border border-surface-border shadow-2xl">
        {error && (
          <div className="p-3 bg-brand-crimson/10 border border-brand-crimson/40 text-brand-crimson text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="EMAIL ADDRESS"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. kenji@amiceamarine.com"
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs uppercase font-bold tracking-wider text-brand-gray">
                PASSWORD
              </label>
              <Link
                href="/account/forgot-password"
                className="text-[10px] font-mono text-zinc-500 hover:text-brand-crimson transition-colors uppercase"
              >
                FORGOT PASSWORD?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-surface-subtle border border-surface-border px-4 py-3 text-sm text-brand-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-crimson"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="glow"
            size="lg"
            fullWidth
            disabled={loading}
            className="py-3.5"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN TO SYNDICATE'} <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="pt-4 border-t border-surface-border/60 text-center">
          <p className="text-xs text-zinc-400">
            Don&apos;t have an account yet?{' '}
            <Link href="/account/register" className="text-brand-crimson font-bold uppercase hover:underline">
              CREATE ONE
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
