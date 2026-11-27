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
    <div className="relative bg-linen-100 border-b border-sage-200/80 text-sage-800 text-xs py-2 px-4 select-none z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center font-medium tracking-wide">
        <Link
          href={link}
          className="flex items-center gap-2 hover:text-terracotta-600 transition-colors group"
        >
          <Sparkles className="w-3.5 h-3.5 text-terracotta-500 animate-pulse" />
          <span className="font-medium tracking-wider text-sage-800">{text}</span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-semibold text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full border border-terracotta-200 group-hover:bg-terracotta-500 group-hover:text-white transition-all">
            CLAIM NOW
          </span>
        </Link>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-500 hover:text-sage-900 transition-colors p-1"
        aria-label="Dismiss promotional banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
