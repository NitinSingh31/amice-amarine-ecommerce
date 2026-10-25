'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Send, ShieldCheck, Truck, RefreshCcw, CreditCard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400">
      {/* Features Bar */}
      <div className="border-b border-zinc-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <Truck className="w-7 h-7 text-brand-crimson shrink-0" />
            <div>
              <h4 className="text-xs uppercase font-bold text-white tracking-wider">Free Shipping</h4>
              <p className="text-[11px] text-zinc-500">All India on orders above ₹999</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-brand-cyan shrink-0" />
            <div>
              <h4 className="text-xs uppercase font-bold text-white tracking-wider">100% Heavy Cotton</h4>
              <p className="text-[11px] text-zinc-500">240-280 GSM luxury knit</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCcw className="w-7 h-7 text-brand-amber shrink-0" />
            <div>
              <h4 className="text-xs uppercase font-bold text-white tracking-wider">7-Day Easy Exchange</h4>
              <p className="text-[11px] text-zinc-500">Hassle-free size swaps</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-xs uppercase font-bold text-white tracking-wider">UPI / COD Available</h4>
              <p className="text-[11px] text-zinc-500">100% secure Razorpay checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Ethos */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-black tracking-[0.2em] uppercase text-white">
              AMICE AMARINE
            </h3>
            <p className="text-xs leading-relaxed text-zinc-400 max-w-sm">
              We engineer premium anime-inspired streetwear designed for uncompromising silhouettes.
              Crafted from heavyweight French Terry and bio-washed combed cotton with high-density architectural graphics.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-surface-subtle border border-surface-border text-zinc-300 hover:text-brand-crimson hover:border-brand-crimson transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-white">Collections</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/collections/oversized-t-shirts" className="hover:text-brand-crimson transition-colors">
                  Oversized T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/collections/hoodies" className="hover:text-brand-crimson transition-colors">
                  Heavyweight Hoodies
                </Link>
              </li>
              <li>
                <Link href="/collections/jackets" className="hover:text-brand-crimson transition-colors">
                  Tactical Denim Jackets
                </Link>
              </li>
              <li>
                <Link href="/collections/bottoms" className="hover:text-brand-crimson transition-colors">
                  Barrel Cargo Trackpants
                </Link>
              </li>
              <li>
                <Link href="/collections/backpacks" className="hover:text-brand-crimson transition-colors">
                  Crossbody Sling Packs
                </Link>
              </li>
              <li>
                <Link href="/collections/accessories" className="hover:text-brand-crimson transition-colors">
                  Desk Mats & Caps
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-white">Customer Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tracking" className="hover:text-brand-crimson transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-brand-crimson transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-brand-crimson transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-brand-crimson transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-brand-crimson transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-crimson transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-white">Drop Alerts</h4>
            <p className="text-xs text-zinc-400">
              Join the syndicate. Get 10% off your first drop and secret early access.
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-surface-subtle border border-surface-border px-3 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-crimson"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-brand-white text-black text-xs font-bold hover:bg-brand-crimson hover:text-white transition-colors flex items-center justify-center"
                  aria-label="Subscribe"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} AMICE AMARINE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider bg-surface-subtle border border-surface-border px-2 py-1 text-zinc-400">
              RAZORPAY SECURED
            </span>
            <span className="text-[10px] uppercase tracking-wider bg-surface-subtle border border-surface-border px-2 py-1 text-zinc-400">
              UPI / CARDS / COD
            </span>
            <Link href="/admin" className="text-zinc-500 hover:text-brand-crimson transition-colors">
              [ADMIN PORTAL]
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
