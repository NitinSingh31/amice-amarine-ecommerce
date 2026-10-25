'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, RotateCcw, Check } from 'lucide-react';

interface FilterSidebarProps {
  categories: any[];
  currentCategorySlug: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ categories, currentCategorySlug }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedSize = searchParams.get('size') || '';
  const selectedSort = searchParams.get('sort') || 'newest';
  const selectedInStock = searchParams.get('inStock') === 'true';
  const selectedDiscount = searchParams.get('discount') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FREE_SIZE'];
  const discounts = [
    { label: 'All Discounts', value: '' },
    { label: '20% or more', value: '20' },
    { label: '40% or more', value: '40' },
    { label: '50% or more', value: '50' },
  ];

  const hasActiveFilters = Boolean(selectedSize || selectedInStock || selectedDiscount || minPrice || maxPrice);

  return (
    <aside className="w-full lg:w-64 space-y-6 text-xs font-mono shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <span className="font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-brand-crimson" /> FILTERS
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-[10px] text-zinc-500 hover:text-brand-crimson transition-colors flex items-center gap-1 uppercase"
          >
            <RotateCcw className="w-3 h-3" /> RESET
          </button>
        )}
      </div>

      {/* Sort Selector */}
      <div className="space-y-2">
        <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-400 block">
          SORT BY
        </label>
        <select
          value={selectedSort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="w-full bg-surface-subtle border border-surface-border p-2.5 text-xs text-white focus:outline-none focus:border-brand-crimson"
        >
          <option value="newest">Newest Drops</option>
          <option value="popular">Most Coveted / Bestsellers</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="discount">Highest Discount</option>
        </select>
      </div>

      {/* Size Pills Filter */}
      <div className="space-y-2 pt-2 border-t border-surface-border/50">
        <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-400 block">
          SIZE
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {sizes.map((s) => {
            const isSelected = selectedSize.toUpperCase() === s;
            return (
              <button
                key={s}
                onClick={() => updateParam('size', isSelected ? null : s)}
                className={`py-2 text-[11px] font-bold uppercase border transition-all text-center ${
                  isSelected
                    ? 'bg-brand-crimson text-white border-brand-crimson shadow-[0_0_10px_rgba(255,0,85,0.4)]'
                    : 'bg-surface border-surface-border text-zinc-300 hover:border-zinc-500'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2 pt-2 border-t border-surface-border/50">
        <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-400 block">
          PRICE RANGE (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => updateParam('minPrice', e.target.value || null)}
            className="bg-surface border border-surface-border px-2.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-crimson"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => updateParam('maxPrice', e.target.value || null)}
            className="bg-surface border border-surface-border px-2.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-crimson"
          />
        </div>
      </div>

      {/* Availability Filter */}
      <div className="pt-2 border-t border-surface-border/50">
        <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-300 hover:text-white">
          <input
            type="checkbox"
            checked={selectedInStock}
            onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : null)}
            className="accent-brand-crimson w-4 h-4 rounded-none cursor-pointer"
          />
          <span className="text-[11px] uppercase tracking-wider font-bold">
            IN STOCK ONLY
          </span>
        </label>
      </div>

      {/* Discount Threshold */}
      <div className="space-y-2 pt-2 border-t border-surface-border/50">
        <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-400 block">
          DISCOUNT
        </label>
        <div className="space-y-1">
          {discounts.map((d) => (
            <button
              key={d.value}
              onClick={() => updateParam('discount', selectedDiscount === d.value ? null : d.value)}
              className={`w-full text-left px-2 py-1.5 text-xs transition-colors flex items-center justify-between ${
                selectedDiscount === d.value
                  ? 'text-brand-crimson font-bold bg-brand-crimson/10'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>{d.label}</span>
              {selectedDiscount === d.value && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
