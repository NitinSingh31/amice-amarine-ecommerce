'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Flame } from 'lucide-react';
import { formatINR } from '@/lib/utils';
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

  // Debounced search suggestions fetch
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/search/suggestions?q=${encodeURIComponent(query.trim())}`);
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

  const quickTags = ['OVERSIZED TEES', 'HOODIES', 'JACKETS', 'CARGO', 'BLEACH', 'SOLO LEVELING', 'VESTS'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 md:p-20">
        <div className="relative w-full max-w-2xl bg-zinc-950 border border-surface-border text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Search Header Form */}
          <form onSubmit={handleSearchSubmit} className="relative border-b border-surface-border flex items-center p-4 sm:p-5">
            <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search anime tees, hoodies, jackets, accessories..."
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-zinc-600 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-zinc-500 hover:text-white mr-2"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-2 py-1 text-xs font-mono text-zinc-400 hover:text-white border border-surface-border bg-surface-subtle"
            >
              ESC
            </button>
          </form>

          {/* Quick Trending Tags */}
          <div className="px-5 py-3 bg-surface-subtle border-b border-surface-border/50 flex items-center gap-2 overflow-x-auto text-xs font-mono">
            <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1 shrink-0">
              <Flame className="w-3 h-3 text-brand-crimson" /> TRENDING:
            </span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setQuery(tag);
                  router.push(`/search?q=${encodeURIComponent(tag)}`);
                  onClose();
                }}
                className="px-2 py-0.5 bg-surface border border-surface-border text-zinc-400 hover:text-white hover:border-brand-crimson text-[10px] uppercase whitespace-nowrap transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results Suggestions */}
          <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-3">
            {isLoading && (
              <div className="text-center py-8 text-xs font-mono text-zinc-500 animate-pulse">
                SEARCHING THE ARCHIVES...
              </div>
            )}

            {!isLoading && suggestions.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                  PRODUCTS ({suggestions.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestions.map((item) => (
                    <Link
                      key={item._id}
                      href={`/products/${item.slug}`}
                      onClick={onClose}
                      className="flex gap-3 p-2.5 bg-surface border border-surface-border hover:border-brand-crimson transition-all group"
                    >
                      <div className="relative w-14 aspect-[3/4] bg-zinc-900 border border-surface-border shrink-0 overflow-hidden">
                        <Image
                          src={item.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'}
                          alt={item.name}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-mono text-brand-crimson uppercase block">
                            {typeof item.category === 'object' ? item.category.name : 'STREETWEAR'}
                          </span>
                          <h4 className="text-xs font-bold uppercase line-clamp-1 text-white group-hover:text-brand-crimson transition-colors">
                            {item.name}
                          </h4>
                        </div>
                        <div className="flex items-baseline gap-2 font-mono">
                          <span className="text-xs font-bold text-white">
                            {formatINR(item.basePrice)}
                          </span>
                          {item.discountPercentage > 0 && (
                            <Badge variant="discount" className="text-[8px] px-1 py-0">
                              {item.discountPercentage}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && query.length >= 2 && suggestions.length === 0 && (
              <div className="text-center py-10 space-y-2">
                <p className="text-xs font-mono text-zinc-400 uppercase">
                  NO PRODUCTS FOUND FOR &quot;{query}&quot;
                </p>
                <p className="text-[11px] text-zinc-600">
                  Try checking spelling or search with broader keywords like &quot;tee&quot;, &quot;hoodie&quot;, &quot;jacket&quot;.
                </p>
              </div>
            )}
          </div>

          {/* View Full Search Results Footer */}
          {query.trim().length >= 2 && (
            <div className="p-3 bg-surface-subtle border-t border-surface-border text-center">
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-brand-crimson hover:underline uppercase"
              >
                VIEW ALL RESULTS FOR &quot;{query}&quot; <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
