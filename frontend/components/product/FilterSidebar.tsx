'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

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
    <aside className="w-full lg:w-64 space-y-6 text-xs shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-sage-200/80">
        <span className="font-bold uppercase tracking-wider text-sage-900 flex items-center gap-1.5 font-serif text-sm">
          <SlidersHorizontal className="w-3.5 h-3.5 text-terracotta-500" /> FILTERS
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-[10px] text-sage-500 hover:text-terracotta-600 transition-colors flex items-center gap-1 uppercase font-semibold"
          >
            <RotateCcw className="w-3 h-3" /> RESET
          </button>
        )}
      </div>

      {/* Sort Selector */}
      <div className="space-y-2">
        <label className="text-[11px] uppercase tracking-wider font-semibold text-sage-700 block">
          SORT BY
        </label>
        <select
          value={selectedSort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="w-full bg-white border border-sage-200 rounded-xl p-2.5 text-xs text-sage-900 focus:outline-none focus:border-terracotta-500 shadow-2xs font-medium"
        >
          <option value="newest">Newest Drops</option>
          <option value="popular">Most Coveted / Bestsellers</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="discount">Highest Discount</option>
        </select>
      </div>

      {/* Size Pills Filter */}
      <div className="space-y-2 pt-2 border-t border-sage-100">
        <label className="text-[11px] uppercase tracking-wider font-semibold text-sage-700 block">
          SIZE
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {sizes.map((s) => {
            const isSelected = selectedSize.toUpperCase() === s;
            return (
              <button
                key={s}
                onClick={() => updateParam('size', isSelected ? null : s)}
                className={`py-2 text-[11px] font-semibold uppercase rounded-xl border transition-all text-center ${
                  isSelected
                    ? 'bg-sage-900 text-linen-50 border-sage-900 shadow-xs'
                    : 'bg-white border-sage-200 text-sage-700 hover:border-terracotta-400 shadow-2xs'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Discount Filter */}
      <div className="space-y-2 pt-2 border-t border-sage-100">
        <label className="text-[11px] uppercase tracking-wider font-semibold text-sage-700 block">
          MINIMUM DISCOUNT
        </label>
        <div className="space-y-1">
          {discounts.map((d) => (
            <button
              key={d.value}
              onClick={() => updateParam('discount', selectedDiscount === d.value ? null : d.value)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                selectedDiscount === d.value
                  ? 'bg-terracotta-50 text-terracotta-700 font-semibold border border-terracotta-200'
                  : 'text-sage-700 hover:bg-linen-100'
              }`}
            >
              <span>{d.label}</span>
              {selectedDiscount === d.value && <span className="text-terracotta-600">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
