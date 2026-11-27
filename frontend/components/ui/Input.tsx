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
          <label className="block text-xs uppercase font-semibold tracking-wider text-sage-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-white border border-sage-200/80 rounded-xl px-4 py-2.5 text-sm text-sage-900 placeholder:text-sage-400 focus:outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 transition-all shadow-xs',
            error && 'border-terracotta-500 focus:ring-terracotta-500/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-[11px] text-terracotta-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
