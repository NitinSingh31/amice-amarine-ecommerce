'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'glow' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      primary: 'bg-brand-white text-background hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]',
      secondary: 'bg-surface-subtle text-brand-white border border-surface-border hover:border-brand-crimson hover:text-brand-crimson',
      outline: 'bg-transparent text-brand-white border border-surface-border hover:border-brand-white hover:bg-white/5',
      glow: 'bg-brand-crimson text-white hover:bg-brand-crimson/90 glow-crimson hover:shadow-[0_0_30px_rgba(255,0,85,0.6)]',
      ghost: 'bg-transparent text-brand-gray hover:text-brand-white hover:bg-surface-subtle',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-sm gap-1.5',
      md: 'text-sm px-6 py-3 rounded-none gap-2',
      lg: 'text-base px-8 py-4 rounded-none gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
