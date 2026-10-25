'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Sparkles } from 'lucide-react';

interface AnnouncementBarProps {
  text?: string;
  link?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  text = '⚡ EXCLUSIVE DROP: FLAT 15% OFF ON PREPAID ORDERS | FREE SHIPPING OVER ₹999',
  link = '/collections/all-products',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800 text-zinc-200 text-xs py-2 px-4 select-none z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center font-medium tracking-wide">
        <Link
          href={link}
          className="flex items-center gap-2 hover:text-brand-crimson transition-colors group"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-crimson animate-pulse" />
          <span className="font-semibold tracking-wider">{text}</span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-brand-crimson bg-brand-crimson/10 px-2 py-0.5 border border-brand-crimson/30 group-hover:bg-brand-crimson group-hover:text-white transition-all">
            CLAIM NOW
          </span>
        </Link>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors p-1"
        aria-label="Dismiss promotional banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
