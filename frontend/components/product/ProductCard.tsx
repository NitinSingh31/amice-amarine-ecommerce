'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatINR } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800';
  const secondaryImage = product.images[1] || primaryImage;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-sage-200/80 overflow-hidden transition-all duration-300 hover:border-terracotta-300 hover:shadow-md">
      {/* Product Image Container */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-[3/4] w-full overflow-hidden bg-linen-100">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Hover image fade */}
        {product.images[1] && (
          <Image
            src={secondaryImage}
            alt={`${product.name} back view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.discountPercentage > 0 && (
            <Badge variant="discount">
              {product.discountPercentage}% OFF
            </Badge>
          )}
          {product.isNewArrival && (
            <Badge variant="cyan">NEW DROP</Badge>
          )}
          {product.isBestseller && (
            <Badge variant="amber">BESTSELLER</Badge>
          )}
        </div>

        {/* Quick Add Overlay on Desktop */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-sage-950/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden sm:flex items-center justify-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5 bg-sage-900 hover:bg-terracotta-600 px-4 py-2 rounded-full w-full justify-center shadow-xs transition-colors">
            <ShoppingBag className="w-3.5 h-3.5" /> SELECT SIZE
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-sage-500 block truncate">
            {typeof product.category === 'object' ? product.category.name : 'STREETWEAR'}
          </span>
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-semibold tracking-tight text-sage-900 line-clamp-1 hover:text-terracotta-600 transition-colors uppercase font-serif mt-0.5">
              {product.name}
            </h3>
          </Link>
          {product.subtitle && (
            <p className="text-[11px] text-sage-500 line-clamp-1 mt-0.5">
              {product.subtitle}
            </p>
          )}
        </div>

        {/* Price and Sizes row */}
        <div className="pt-2 border-t border-sage-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-sage-900">
              {formatINR(product.basePrice)}
            </span>
            {product.compareAtPrice > product.basePrice && (
              <span className="text-xs text-sage-400 line-through">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Size Pills Preview */}
          <div className="flex items-center gap-1 text-[9px] text-sage-600">
            {product.variants?.slice(0, 3).map((v) => (
              <span key={v.sku} className="bg-linen-100 border border-sage-200/80 rounded-md px-1.5 py-0.5 font-medium">
                {v.size}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
