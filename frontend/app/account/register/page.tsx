'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    const res = await register(name, email, password, phone);
    setLoading(false);

    if (res.success) {
      router.push('/account');
    } else {
      setError(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-crimson block">
          JOIN THE UNDERGROUND
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-display">
          CREATE ACCOUNT
        </h1>
        <p className="text-xs text-zinc-400">
          Unlock exclusive member drops, fast checkout, and order archives.
        </p>
      </div>

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-surface p-6 sm:p-8 border border-surface-border shadow-2xl">
        {error && (
          <div className="p-3 bg-brand-crimson/10 border border-brand-crimson/40 text-brand-crimson text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="FULL NAME"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kenji Sato"
          />

          <Input
            label="EMAIL ADDRESS"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. kenji@tokyo.street"
          />

          <Input
            label="PHONE NUMBER (+91)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />

          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-brand-gray mb-1.5">
              PASSWORD (MIN 8 CHARACTERS)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-surface-subtle border border-surface-border px-4 py-3 text-sm text-brand-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-crimson"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-brand-gray mb-1.5">
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'CREATING ACCOUNT...' : 'JOIN AMICE AMARINE'} <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="pt-4 border-t border-surface-border/60 text-center">
          <p className="text-xs text-zinc-400">
            Already have an account?{' '}
            <Link href="/account/login" className="text-brand-crimson font-bold uppercase hover:underline">
              SIGN IN
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
