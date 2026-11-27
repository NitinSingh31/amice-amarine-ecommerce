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
import { ShoppingBag, Zap, Heart, MapPin, CheckCircle2, Ruler } from 'lucide-react';
import { ProductReviews } from './ProductReviews';
import { SizeGuideModal } from './SizeGuideModal';

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
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
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
        <div className="relative aspect-[3/4] w-full rounded-2xl border border-sage-200/80 bg-linen-100 overflow-hidden shadow-xs group">
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
                className={`relative aspect-square rounded-xl border overflow-hidden transition-all shadow-2xs ${
                  selectedImage === idx ? 'border-terracotta-500 ring-2 ring-terracotta-500/20' : 'border-sage-200 opacity-70 hover:opacity-100'
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
        <div className="space-y-2 border-b border-sage-200/80 pb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-semibold tracking-wider text-terracotta-600">
              {typeof product.category === 'object' ? product.category.name : 'STREETWEAR'}
            </span>
            <button
              onClick={() => toggleWishlist(product._id)}
              className="text-sage-500 hover:text-terracotta-600 p-1 transition-colors flex items-center gap-1 text-xs"
              aria-label="Wishlist toggle"
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-terracotta-500 text-terracotta-500' : ''}`} />
              <span className="text-[10px] hidden sm:inline font-semibold">{wishlisted ? 'SAVED' : 'SAVE'}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-sage-900 font-serif leading-tight">
            {product.name}
          </h1>

          {product.subtitle && (
            <p className="text-xs sm:text-sm text-sage-600 font-normal">
              {product.subtitle}
            </p>
          )}

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pt-3">
            <span className="text-2xl sm:text-3xl font-bold text-sage-900">
              {formatINR(product.basePrice)}
            </span>
            {product.compareAtPrice > product.basePrice && (
              <span className="text-base text-sage-400 line-through">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
            <span className="text-xs font-semibold text-sage-800 bg-sage-100 border border-sage-200 rounded-full px-2.5 py-0.5">
              INCLUSIVE OF ALL TAXES
            </span>
          </div>
        </div>

        {/* Size Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="uppercase text-sage-700 font-medium">
              SELECT SIZE: <strong className="text-sage-900">{selectedVariant?.size}</strong>
            </span>
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 underline underline-offset-4 flex items-center gap-1 transition-colors"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Size Guide & Fit Advisor</span>
            </button>
          </div>

          {selectedVariant?.stock <= 5 && selectedVariant?.stock > 0 && (
            <div className="text-[11px] text-terracotta-600 font-semibold">
              🔥 ONLY {selectedVariant.stock} LEFT IN STOCK FOR SIZE {selectedVariant.size}!
            </div>
          )}

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
                  className={`py-3 text-xs font-semibold uppercase rounded-xl border transition-all text-center ${
                    isSelected
                      ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-700 shadow-xs'
                      : isOutOfStock
                      ? 'border-sage-200/60 bg-linen-100 text-sage-400 line-through cursor-not-allowed'
                      : 'border-sage-200 bg-white text-sage-800 hover:border-sage-400 shadow-2xs'
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
            <div className="flex items-center border border-sage-200 bg-white rounded-full px-4 py-2 shadow-2xs text-sage-800">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-sage-500 hover:text-sage-900 px-1 font-bold"
              >
                -
              </button>
              <span className="px-3 text-xs font-bold text-sage-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(selectedVariant?.stock || 10, quantity + 1))}
                className="text-sage-500 hover:text-sage-900 px-1 font-bold"
              >
                +
              </button>
            </div>

            <Button
              variant="glow"
              size="lg"
              fullWidth
              onClick={handleAddToCart}
              className="py-4 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 mr-2" /> ADD TO CART
            </Button>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleBuyNow}
            className="py-4 shadow-sm"
          >
            <Zap className="w-4 h-4 mr-2 text-ochre-400" /> BUY NOW (FAST CHECKOUT)
          </Button>
        </div>

        {/* Pincode Availability Checker */}
        <div className="p-4 bg-linen-100 rounded-2xl border border-sage-200/80 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-sage-900">
            <MapPin className="w-4 h-4 text-terracotta-500" /> CHECK DELIVERY AVAILABILITY
          </div>
          <form onSubmit={handleCheckPincode} className="flex gap-2">
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter 6-digit Pincode"
              maxLength={6}
              className="flex-1 bg-white border border-sage-200 rounded-xl px-3.5 py-2 text-xs text-sage-900 placeholder:text-sage-400 focus:outline-none focus:border-terracotta-500 shadow-2xs"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-sage-900 text-linen-50 rounded-xl text-xs font-semibold uppercase hover:bg-terracotta-600 transition-colors shadow-xs"
            >
              CHECK
            </button>
          </form>

          {pincodeStatus.checked && (
            <div className={`flex items-start gap-1.5 text-xs ${pincodeStatus.valid ? 'text-sage-800' : 'text-terracotta-600 font-medium'}`}>
              {pincodeStatus.valid && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-sage-700" />}
              <span>{pincodeStatus.message}</span>
            </div>
          )}
        </div>

        {/* Specifications Tabs */}
        <div className="border-t border-sage-200/80 pt-4 space-y-3">
          <div className="flex border-b border-sage-200 text-xs">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 font-semibold uppercase transition-colors ${
                activeTab === 'specs'
                  ? 'border-b-2 border-terracotta-500 text-terracotta-600'
                  : 'text-sage-500 hover:text-sage-900'
              }`}
            >
              SPECIFICATIONS
            </button>
            <button
              onClick={() => setActiveTab('fit')}
              className={`px-4 py-2 font-semibold uppercase transition-colors ${
                activeTab === 'fit'
                  ? 'border-b-2 border-terracotta-500 text-terracotta-600'
                  : 'text-sage-500 hover:text-sage-900'
              }`}
            >
              DESCRIPTION & FIT
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-4 py-2 font-semibold uppercase transition-colors ${
                activeTab === 'shipping'
                  ? 'border-b-2 border-terracotta-500 text-terracotta-600'
                  : 'text-sage-500 hover:text-sage-900'
              }`}
            >
              SHIPPING & EXCHANGES
            </button>
          </div>

          <div className="p-2 text-xs text-sage-700 leading-relaxed">
            {activeTab === 'specs' && product.specifications && (
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-sage-100 py-1.5">
                    <span className="text-sage-500 uppercase font-medium">{k}:</span>
                    <span className="text-sage-900 font-semibold">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'fit' && (
              <div className="space-y-2">
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

      {/* Customer Reviews & Silhouette Ratings */}
      <ProductReviews productId={product._id} productName={product.name} />

      {/* Interactive Size Guide & Fit Advisor Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        categoryName={typeof product.category === 'object' ? product.category.name : 'T-Shirts'}
        onSelectSize={(size) => {
          const matching = product.variants?.find((v) => v.size.toUpperCase() === size.toUpperCase());
          if (matching && matching.stock > 0) {
            setSelectedVariant(matching);
          }
        }}
        currentSize={selectedVariant?.size}
      />
    </div>
  );
};
