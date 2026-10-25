'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant } from '@/types';
import { formatINR } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Zap, Heart, Truck, RefreshCw, Shield, MapPin, CheckCircle2 } from 'lucide-react';

interface ProductDetailsClientProps {
  product: Product;
}

export const ProductDetailsClient: React.FC<ProductDetailsClientProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isProductWishlisted } = useAuth();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants?.[0] || ({} as any));
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<{ checked: boolean; valid?: boolean; message?: string }>({
    checked: false,
  });
  const [activeTab, setActiveTab] = useState<'specs' | 'fit' | 'shipping'>('specs');

  const wishlisted = isProductWishlisted(product._id);

  // Persist to recently viewed
  useEffect(() => {
    try {
      const recent = JSON.parse(localStorage.getItem('amice_recently_viewed') || '[]');
      const filtered = recent.filter((p: any) => p._id !== product._id);
      filtered.unshift({
        _id: product._id,
        name: product.name,
        slug: product.slug,
        basePrice: product.basePrice,
        compareAtPrice: product.compareAtPrice,
        discountPercentage: product.discountPercentage,
        images: product.images,
      });
      localStorage.setItem('amice_recently_viewed', JSON.stringify(filtered.slice(0, 6)));
    } catch (e) {
      console.warn('Recently viewed error', e);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedVariant.sku) return;
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedVariant || !selectedVariant.sku) return;
    addToCart(product, selectedVariant, quantity);
    router.push('/checkout');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      const today = new Date();
      today.setDate(today.getDate() + 3);
      const deliveryDate = today.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
      setPincodeStatus({
        checked: true,
        valid: true,
        message: `Estimated delivery by ${deliveryDate}. Cash on Delivery Available.`,
      });
    } else {
      setPincodeStatus({
        checked: true,
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code.',
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Left Column: Image Gallery */}
      <div className="lg:col-span-7 space-y-4">
        <div className="relative aspect-[3/4] w-full border border-surface-border bg-zinc-900 overflow-hidden group">
          <Image
            src={product.images[selectedImage] || product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'}
            alt={product.name}
            fill
            priority
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          {product.discountPercentage > 0 && (
            <div className="absolute top-4 left-4 z-10">
              <Badge variant="discount">{product.discountPercentage}% OFF</Badge>
            </div>
          )}
        </div>

        {/* Thumbnails rail */}
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(idx)}
                className={`relative aspect-square border overflow-hidden transition-all ${
                  selectedImage === idx ? 'border-brand-crimson ring-1 ring-brand-crimson' : 'border-surface-border opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover object-center" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Buy Box & Options */}
      <div className="lg:col-span-5 space-y-6">
        <div className="space-y-2 border-b border-surface-border pb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-crimson">
              {typeof product.category === 'object' ? product.category.name : 'STREETWEAR'}
            </span>
            <button
              onClick={() => toggleWishlist(product._id)}
              className="text-zinc-400 hover:text-brand-crimson p-1 transition-colors flex items-center gap-1 text-xs font-mono"
              aria-label="Wishlist toggle"
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-brand-crimson text-brand-crimson' : ''}`} />
              <span className="text-[10px] hidden sm:inline">{wishlisted ? 'SAVED' : 'SAVE'}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display">
            {product.name}
          </h1>

          {product.subtitle && (
            <p className="text-xs sm:text-sm text-zinc-400 font-medium">
              {product.subtitle}
            </p>
          )}

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pt-3">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {formatINR(product.basePrice)}
            </span>
            {product.compareAtPrice > product.basePrice && (
              <span className="text-base text-zinc-500 line-through font-mono">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
            <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5">
              INCLUSIVE OF ALL TAXES
            </span>
          </div>
        </div>

        {/* Size Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="uppercase text-zinc-300">
              SELECT SIZE: <strong className="text-white">{selectedVariant?.size}</strong>
            </span>
            {selectedVariant?.stock <= 5 && selectedVariant?.stock > 0 && (
              <span className="text-amber-400 font-bold">
                🔥 ONLY {selectedVariant.stock} LEFT IN STOCK!
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {product.variants?.map((v) => {
              const isSelected = selectedVariant?.sku === v.sku;
              const isOutOfStock = v.stock <= 0;

              return (
                <button
                  key={v.sku}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => setSelectedVariant(v)}
                  className={`py-3 text-xs font-mono font-bold uppercase border transition-all text-center ${
                    isSelected
                      ? 'border-brand-crimson bg-brand-crimson/15 text-brand-crimson shadow-[0_0_12px_rgba(255,0,85,0.4)]'
                      : isOutOfStock
                      ? 'border-zinc-800 bg-zinc-950 text-zinc-600 line-through cursor-not-allowed'
                      : 'border-surface-border bg-surface text-white hover:border-zinc-400'
                  }`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity Stepper & Add to Cart */}
        <div className="space-y-3 pt-2">
          <div className="flex gap-3">
            <div className="flex items-center border border-surface-border bg-surface px-3 py-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-zinc-400 hover:text-white px-1"
              >
                -
              </button>
              <span className="px-3 text-xs font-mono font-bold text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(selectedVariant?.stock || 10, quantity + 1))}
                className="text-zinc-400 hover:text-white px-1"
              >
                +
              </button>
            </div>

            <Button
              variant="glow"
              size="lg"
              fullWidth
              onClick={handleAddToCart}
              className="py-4"
            >
              <ShoppingBag className="w-4 h-4 mr-2" /> ADD TO CART
            </Button>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleBuyNow}
            className="py-4"
          >
            <Zap className="w-4 h-4 mr-2" /> BUY NOW (FAST CHECKOUT)
          </Button>
        </div>

        {/* Pincode Availability Checker */}
        <div className="p-4 bg-surface-subtle border border-surface-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
            <MapPin className="w-4 h-4 text-brand-crimson" /> CHECK DELIVERY AVAILABILITY
          </div>
          <form onSubmit={handleCheckPincode} className="flex gap-2">
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter 6-digit Pincode"
              maxLength={6}
              className="flex-1 bg-zinc-900 border border-surface-border px-3 py-2 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-crimson"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-surface border border-surface-border text-xs font-bold uppercase hover:bg-white hover:text-black transition-colors"
            >
              CHECK
            </button>
          </form>

          {pincodeStatus.checked && (
            <div className={`flex items-start gap-1.5 text-xs font-mono ${pincodeStatus.valid ? 'text-emerald-400' : 'text-brand-crimson'}`}>
              {pincodeStatus.valid && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
              <span>{pincodeStatus.message}</span>
            </div>
          )}
        </div>

        {/* Specifications Tabs */}
        <div className="border-t border-surface-border pt-4 space-y-3">
          <div className="flex border-b border-surface-border text-xs font-mono">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 font-bold uppercase transition-colors ${
                activeTab === 'specs'
                  ? 'border-b-2 border-brand-crimson text-brand-crimson'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              SPECIFICATIONS
            </button>
            <button
              onClick={() => setActiveTab('fit')}
              className={`px-4 py-2 font-bold uppercase transition-colors ${
                activeTab === 'fit'
                  ? 'border-b-2 border-brand-crimson text-brand-crimson'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              DESCRIPTION & FIT
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-4 py-2 font-bold uppercase transition-colors ${
                activeTab === 'shipping'
                  ? 'border-b-2 border-brand-crimson text-brand-crimson'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              SHIPPING & EXCHANGES
            </button>
          </div>

          <div className="p-2 text-xs font-mono text-zinc-300 leading-relaxed">
            {activeTab === 'specs' && product.specifications && (
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-surface-border/40 py-1">
                    <span className="text-zinc-500 uppercase">{k}:</span>
                    <span className="text-white font-medium">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'fit' && (
              <div className="space-y-2 font-sans">
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-2">
                <p>• <strong>Free Domestic Shipping</strong> on all prepaid orders over ₹999.</p>
                <p>• <strong>Standard Shipping:</strong> ₹99 for orders under ₹999 across all Indian PIN codes.</p>
                <p>• <strong>7-Day Size Exchanges:</strong> Hassle-free exchanges if the size doesn&apos;t fit your silhouette.</p>
                <p>• <strong>COD Available:</strong> Cash on Delivery available at checkout.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
