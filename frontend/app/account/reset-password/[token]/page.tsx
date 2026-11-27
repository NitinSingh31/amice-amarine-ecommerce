'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { API_BASE } from '@/lib/api';

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const token = params.token;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/reset-password/${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        if (data.data?.token) {
          localStorage.setItem('amice_token', data.data.token);
          if (data.data?.user) {
            localStorage.setItem('amice_user', JSON.stringify(data.data.user));
          }
        }
        setTimeout(() => {
          router.push('/account');
        }, 1500);
      } else {
        setError(data.error?.message || 'Token is invalid or has expired.');
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
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-cyan block font-bold">
          SECURITY OVERRIDE // CREDENTIAL RE-ENCRYPTION
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-display">
          SET NEW PASSWORD
        </h1>
        <p className="text-zinc-400">
          Enter your new password below. It will be salted with 12 bcrypt rounds.
        </p>
      </div>

      {success ? (
        <div className="bg-surface border border-emerald-500/50 p-6 space-y-3 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-bold uppercase text-white font-mono">
            CREDENTIALS RE-ESTABLISHED
          </h2>
          <p className="text-zinc-400">
            Your new password has been verified. Redirecting you to your account control room...
          </p>
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
            label="NEW PASSWORD (MIN 8 CHARS)"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="CONFIRM NEW PASSWORD"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="glow"
            size="md"
            fullWidth
            disabled={loading}
          >
            {loading ? 'RE-ENCRYPTING...' : 'CONFIRM NEW PASSWORD'}
          </Button>
        </form>
      )}
    </div>
  );
}
