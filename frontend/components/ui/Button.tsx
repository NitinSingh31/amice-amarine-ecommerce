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
    const baseStyles =
      'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      primary: 'bg-sage-900 text-linen-50 hover:bg-sage-800 shadow-xs hover:shadow-sm',
      secondary: 'bg-linen-100 text-sage-900 border border-sage-200 hover:border-terracotta-500 hover:text-terracotta-600',
      outline: 'bg-transparent text-sage-900 border border-sage-200 hover:border-sage-800 hover:bg-linen-100/60',
      glow: 'bg-terracotta-500 text-white hover:bg-terracotta-600 shadow-xs hover:shadow-sm',
      ghost: 'bg-transparent text-sage-600 hover:text-sage-900 hover:bg-linen-100/60',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 rounded-full gap-1.5',
      md: 'text-xs sm:text-sm px-5 py-2.5 rounded-full gap-2 font-medium',
      lg: 'text-sm sm:text-base px-7 py-3 rounded-full gap-2.5 font-medium',
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
