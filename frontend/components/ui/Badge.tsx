import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'crimson' | 'cyan' | 'amber' | 'neutral' | 'discount';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'crimson', children, ...props }) => {
  const variants = {
    crimson: 'bg-terracotta-50 text-terracotta-600 border-terracotta-200/80',
    cyan: 'bg-sage-100/80 text-sage-800 border-sage-200/80',
    amber: 'bg-ochre-100 text-ochre-800 border-ochre-200',
    neutral: 'bg-linen-100 text-sage-700 border-sage-200/60',
    discount: 'bg-terracotta-500 text-white font-semibold border-transparent shadow-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-[10px] uppercase font-medium tracking-wider border rounded-full',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
