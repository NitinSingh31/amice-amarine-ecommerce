'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const CartDrawer: React.FC = () => {
  const { cart, isOpen, closeCart, updateQuantity, removeFromCart, subtotal, freeShippingThreshold } = useCart();

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const diff = freeShippingThreshold - subtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-sage-950/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-linen-50 border-l border-sage-200 text-sage-900 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-sage-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-terracotta-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider font-serif">YOUR BAG</h2>
              <span className="text-xs text-sage-500">({cart.length} items)</span>
            </div>
            <button
              onClick={closeCart}
              className="text-sage-500 hover:text-sage-900 p-1 transition-colors rounded-full"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-linen-100 border-b border-sage-200 px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 text-xs mb-1.5 font-medium">
              <Truck className="w-3.5 h-3.5 text-terracotta-500" />
              {diff > 0 ? (
                <span className="text-sage-800">
                  Add <strong className="text-terracotta-600 font-bold">{formatINR(diff)}</strong> more for{' '}
                  <strong className="text-sage-900">FREE SHIPPING</strong>
                </span>
              ) : (
                <span className="text-sage-800 font-bold">
                  🎉 YOU UNLOCKED FREE SHIPPING ACROSS INDIA!
                </span>
              )}
            </div>
            <div className="w-full bg-sage-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-terracotta-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <ShoppingBag className="w-12 h-12 text-sage-300" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-sage-800 font-serif">
                    YOUR BAG IS EMPTY
                  </h3>
                  <p className="text-xs text-sage-500 max-w-xs">
                    Explore our luxury heavyweight French Terry tees, hoodies, and jackets.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-sage-900 text-linen-50 text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-terracotta-600 transition-colors shadow-xs"
                >
                  START BROWSING
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white rounded-2xl border border-sage-200/80 shadow-2xs"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 aspect-[3/4] bg-linen-100 rounded-xl border border-sage-200/60 shrink-0 overflow-hidden">
                    <Image
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'}
                      alt={item.product.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold uppercase line-clamp-1 text-sage-900 font-serif">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-sage-400 hover:text-terracotta-600 p-0.5 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[10px] text-sage-500 mt-0.5 space-x-2">
                        <span>SIZE: <strong className="text-sage-800">{item.variant.size}</strong></span>
                        <span>COLOR: <strong className="text-sage-800">{item.variant.color}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-sage-200 bg-white rounded-full px-2 py-0.5 shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:text-terracotta-600 text-sage-500"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-sage-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:text-terracotta-600 text-sage-500"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-xs font-bold text-sage-900">
                        {formatINR(item.product.basePrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Box */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-sage-200 bg-linen-100 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-sage-600">
                  <span>Subtotal:</span>
                  <span className="text-sage-900 font-bold">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sage-600">
                  <span>Shipping:</span>
                  <span className={subtotal >= freeShippingThreshold ? 'text-sage-800 font-bold' : 'text-sage-900'}>
                    {subtotal >= freeShippingThreshold ? 'FREE' : formatINR(99)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-sage-900 pt-2 border-t border-sage-200">
                  <span>Total:</span>
                  <span className="text-base text-terracotta-600 font-serif font-bold">
                    {formatINR(subtotal + (subtotal >= freeShippingThreshold ? 0 : 99))}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Link href="/checkout" onClick={closeCart} className="block w-full">
                  <Button variant="glow" size="lg" fullWidth className="py-3.5 shadow-sm">
                    CHECKOUT NOW <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <p className="text-[10px] text-center text-sage-500">
                  100% Secure Checkout with Razorpay • UPI / Cards / COD Supported
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
