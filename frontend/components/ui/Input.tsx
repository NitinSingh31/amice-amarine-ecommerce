'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs uppercase font-bold tracking-wider text-brand-gray">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-surface-subtle border border-surface-border px-4 py-3 text-sm text-brand-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson transition-all',
            error && 'border-brand-crimson',
            className
          )}
          {...props}
        />
        {error && <p className="text-[11px] text-brand-crimson font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
