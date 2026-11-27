'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { API_BASE } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSuggestions([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/search/suggestions?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const json = await res.json();
          setSuggestions(json.data?.suggestions || []);
        }
      } catch (e) {
        console.warn('Search suggestions error', e);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const quickTags = ['OVERSIZED TEES', 'HOODIES', 'JACKETS', 'CARGO', 'FRENCH TERRY', 'HEAVYWEIGHT'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-sage-950/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 md:p-20">
        <div className="relative w-full max-w-2xl bg-linen-50 border border-sage-200 text-sage-900 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Search Header Form */}
          <form onSubmit={handleSearchSubmit} className="relative border-b border-sage-200 flex items-center p-4 sm:p-5 bg-white">
            <Search className="w-5 h-5 text-sage-400 mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search anime tees, hoodies, jackets, accessories..."
              className="w-full bg-transparent text-sm sm:text-base text-sage-900 placeholder:text-sage-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-sage-400 hover:text-sage-700 p-1"
                aria-label="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Body */}
          <div className="p-4 sm:p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Quick search tags */}
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-sage-500 block mb-2.5">
                POPULAR CATEGORIES
              </span>
              <div className="flex flex-wrap gap-2">
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      onClose();
                      router.push(`/search?q=${encodeURIComponent(tag.toLowerCase())}`);
                    }}
                    className="text-xs bg-white text-sage-700 border border-sage-200/80 px-3.5 py-1.5 rounded-full hover:border-terracotta-500 hover:text-terracotta-600 transition-colors shadow-2xs font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Search Suggestions */}
            {isLoading && (
              <div className="py-8 text-center text-xs text-sage-500">
                Searching collection...
              </div>
            )}

            {!isLoading && suggestions.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-sage-500 block">
                  PRODUCTS ({suggestions.length})
                </span>
                <div className="divide-y divide-sage-100">
                  {suggestions.map((p) => (
                    <Link
                      key={p._id}
                      href={`/products/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-linen-100 transition-colors group"
                    >
                      <div className="relative w-12 h-14 bg-linen-100 rounded-lg overflow-hidden shrink-0 border border-sage-200">
                        {p.images?.[0] && (
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            className="object-cover object-center"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-sage-900 group-hover:text-terracotta-600 transition-colors truncate">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-sage-500 truncate">
                          {p.subtitle || 'Streetwear Collection'}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-sage-900">
                          {formatINR(p.basePrice)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && query.length >= 2 && suggestions.length === 0 && (
              <div className="py-8 text-center text-xs text-sage-500">
                No products found matching &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
