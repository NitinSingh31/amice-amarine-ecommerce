'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function WishlistPage() {
  const { user, token, toggleWishlist } = useAuth();
  const { addToCart } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlist() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('http://localhost:5000/api/auth/wishlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setWishlistProducts(json.data.wishlist || []);
        }
      } catch (e) {
        console.warn('Fetch wishlist error', e);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, [token, user?.wishlist]);

  const handleRemove = async (productId: string) => {
    await toggleWishlist(productId);
    setWishlistProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const handleMoveToCart = (product: any) => {
    const defaultVariant = product.variants?.[0] || { sku: 'AA-DEFAULT', size: 'L', color: 'Black', stock: 10 };
    addToCart(product, defaultVariant, 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3 border-b border-surface-border pb-6">
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> MY ACCOUNT
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-crimson block">
              SAVED PIECES
            </span>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-display">
              YOUR WISHLIST
            </h1>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {wishlistProducts.length} ITEMS SAVED
          </span>
        </div>
      </div>

      {/* Grid or Empty */}
      {loading ? (
        <div className="text-center py-20 font-mono text-xs text-zinc-500 animate-pulse">
          LOADING WISHLIST ITEMS...
        </div>
      ) : wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map((p) => (
            <div
              key={p._id}
              className="bg-surface border border-surface-border flex flex-col justify-between group overflow-hidden"
            >
              <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden">
                <Image
                  src={p.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'}
                  alt={p.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => handleRemove(p._id)}
                  className="absolute top-2.5 right-2.5 p-2 bg-black/80 hover:bg-brand-crimson text-white transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase line-clamp-1 text-white">
                    {p.name}
                  </h3>
                  <div className="flex items-baseline gap-2 font-mono mt-1">
                    <span className="text-sm font-bold text-white">
                      {formatINR(p.basePrice)}
                    </span>
                    {p.compareAtPrice > p.basePrice && (
                      <span className="text-xs text-zinc-500 line-through">
                        {formatINR(p.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant="glow"
                  size="sm"
                  fullWidth
                  onClick={() => handleMoveToCart(p)}
                  className="py-2.5 text-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5 mr-1.5" /> ADD TO BAG
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-surface-border p-8 space-y-4">
          <Heart className="w-12 h-12 text-zinc-700 mx-auto" />
          <h3 className="text-sm uppercase font-mono font-bold text-zinc-300">
            YOUR WISHLIST IS CURRENTLY EMPTY
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Save items while exploring collections to revisit them later.
          </p>
          <div className="pt-2">
            <Link
              href="/collections/all-products"
              className="inline-block px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
            >
              EXPLORE DROPS
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
