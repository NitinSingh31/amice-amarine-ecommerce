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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-surface-border text-white flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-surface-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-crimson" />
              <h2 className="text-sm font-black uppercase tracking-wider">YOUR CART</h2>
              <span className="text-xs font-mono text-zinc-500">({cart.length} items)</span>
            </div>
            <button
              onClick={closeCart}
              className="text-zinc-400 hover:text-white p-1 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-surface-subtle border-b border-surface-border px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 text-xs font-mono mb-1.5">
              <Truck className="w-3.5 h-3.5 text-brand-crimson" />
              {diff > 0 ? (
                <span>
                  Add <strong className="text-brand-crimson">{formatINR(diff)}</strong> more for{' '}
                  <strong className="text-white">FREE SHIPPING</strong>
                </span>
              ) : (
                <span className="text-emerald-400 font-bold">
                  🎉 YOU UNLOCKED FREE SHIPPING ACROSS INDIA!
                </span>
              )}
            </div>
            <div className="w-full bg-zinc-800 h-1.5 overflow-hidden">
              <div
                className="bg-brand-crimson h-full transition-all duration-500 glow-crimson"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <ShoppingBag className="w-12 h-12 text-zinc-700" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                    YOUR CART IS EMPTY
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-xs">
                    Explore our heavyweight anime oversized tees, hoodies, and jackets.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
                >
                  START BROWSING
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-surface border border-surface-border"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 aspect-[3/4] bg-zinc-900 border border-surface-border shrink-0 overflow-hidden">
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
                        <h4 className="text-xs font-bold uppercase line-clamp-1 text-white">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-500 hover:text-brand-crimson p-0.5 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400 mt-0.5 space-x-2">
                        <span>SIZE: <strong className="text-white">{item.variant.size}</strong></span>
                        <span>COLOR: <strong className="text-white">{item.variant.color}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-surface-border bg-zinc-900">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:text-brand-crimson text-zinc-400"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:text-brand-crimson text-zinc-400"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-xs font-mono font-bold text-white">
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
            <div className="p-4 sm:p-6 border-t border-surface-border bg-surface-subtle space-y-4">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal:</span>
                  <span className="text-white font-bold">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping:</span>
                  <span className={subtotal >= freeShippingThreshold ? 'text-emerald-400' : 'text-white'}>
                    {subtotal >= freeShippingThreshold ? 'FREE' : formatINR(99)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-surface-border">
                  <span>Total:</span>
                  <span className="text-base text-brand-crimson">
                    {formatINR(subtotal + (subtotal >= freeShippingThreshold ? 0 : 99))}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Link href="/checkout" onClick={closeCart} className="block w-full">
                  <Button variant="glow" size="lg" fullWidth className="py-3.5">
                    CHECKOUT NOW <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <p className="text-[10px] text-center text-zinc-500 font-mono">
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
