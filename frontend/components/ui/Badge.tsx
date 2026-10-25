import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'crimson' | 'cyan' | 'amber' | 'neutral' | 'discount';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'crimson', children, ...props }) => {
  const variants = {
    crimson: 'bg-brand-crimson/15 text-brand-crimson border-brand-crimson/40',
    cyan: 'bg-brand-cyan/15 text-brand-cyan border-brand-cyan/40',
    amber: 'bg-brand-amber/15 text-brand-amber border-brand-amber/40',
    neutral: 'bg-surface-subtle text-brand-gray border-surface-border',
    discount: 'bg-brand-crimson text-white font-extrabold border-transparent shadow-[0_0_12px_rgba(255,0,85,0.5)]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest border rounded-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
