'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';
import { Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSearch() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const json = await res.json();
          setProducts(json.data?.products || []);
          setTotal(json.meta?.total || 0);
        }
      } catch (err) {
        console.error('Search fetch failed', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSearch();
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3 border-b border-surface-border pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> HOME
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-crimson block">
              CATALOG SEARCH
            </span>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-display">
              RESULTS FOR &quot;{q}&quot;
            </h1>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {total} PRODUCTS FOUND
          </span>
        </div>
      </div>

      {/* Grid or Empty State */}
      {loading ? (
        <div className="text-center py-20 font-mono text-xs text-zinc-500 animate-pulse">
          SEARCHING DATABASE ARCHIVES...
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-surface-border p-8 space-y-4">
          <Search className="w-12 h-12 text-zinc-700 mx-auto" />
          <h3 className="text-sm uppercase font-mono font-bold text-zinc-300">
            NO PRODUCTS FOUND MATCHING YOUR SEARCH
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Try searching for terms like &quot;oversized&quot;, &quot;hoodie&quot;, &quot;denim&quot;, &quot;cargo&quot;, or browse our categories.
          </p>
          <div className="pt-2">
            <Link
              href="/collections/all-products"
              className="inline-block px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
            >
              EXPLORE ALL PRODUCTS
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center font-mono text-xs text-zinc-500">
          LOADING SEARCH RESULTS...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
