'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Send, ShieldCheck, Truck, RefreshCcw, CreditCard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-linen-100 border-t border-sage-200 text-sage-700">
      {/* Features Bar */}
      <div className="border-b border-sage-200/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage-200/60 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-terracotta-600" />
            </div>
            <div>
              <h4 className="text-xs uppercase font-serif font-bold text-sage-900 tracking-wider">Free Shipping</h4>
              <p className="text-[11px] text-sage-600">All India on orders above ₹999</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage-200/60 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-sage-700" />
            </div>
            <div>
              <h4 className="text-xs uppercase font-serif font-bold text-sage-900 tracking-wider">100% Heavy Cotton</h4>
              <p className="text-[11px] text-sage-600">280–320 GSM French Terry</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage-200/60 flex items-center justify-center shrink-0">
              <RefreshCcw className="w-5 h-5 text-ochre-600" />
            </div>
            <div>
              <h4 className="text-xs uppercase font-serif font-bold text-sage-900 tracking-wider">7-Day Easy Exchange</h4>
              <p className="text-[11px] text-sage-600">Hassle-free size swaps</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage-200/60 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-sage-700" />
            </div>
            <div>
              <h4 className="text-xs uppercase font-serif font-bold text-sage-900 tracking-wider">UPI / COD Available</h4>
              <p className="text-[11px] text-sage-600">100% secure Razorpay checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Ethos */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block" aria-label="Amice Amarine Home">
              <div className="relative h-11 w-48 -ml-1">
                <Image
                  src="/images/logo-horizontal.png"
                  alt="Amice Amarine Logo"
                  fill
                  sizes="192px"
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-sage-600 max-w-sm">
              Effortless elegance, deeply rooted. We engineer luxury anime-inspired streetwear designed for uncompromising silhouettes crafted from heavyweight French Terry and bio-washed combed cotton.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-sage-200 text-sage-700 hover:text-terracotta-600 hover:border-terracotta-500 shadow-2xs transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-sage-900 font-serif">Collections</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/collections/oversized-t-shirts" className="text-sage-600 hover:text-terracotta-600 transition-colors">
                  Oversized T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/collections/hoodies" className="text-sage-600 hover:text-terracotta-600 transition-colors">
                  Heavyweight Hoodies
                </Link>
              </li>
              <li>
                <Link href="/collections/jackets" className="text-sage-600 hover:text-terracotta-600 transition-colors">
                  Tactical Denim Jackets
                </Link>
              </li>
              <li>
                <Link href="/collections/bottoms" className="text-sage-600 hover:text-terracotta-600 transition-colors">
                  Barrel Cargo Trackpants
                </Link>
              </li>
              <li>
                <Link href="/collections/accessories" className="text-sage-600 hover:text-terracotta-600 transition-colors">
                  Accessories & Caps
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-sage-900 font-serif">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tracking" className="text-sage-600 hover:text-terracotta-600 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="text-sage-600 hover:text-terracotta-600 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="text-sage-600 hover:text-terracotta-600 transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="text-sage-600 hover:text-terracotta-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="text-sage-600 hover:text-terracotta-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sage-600 hover:text-terracotta-600 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-sage-900 font-serif">Drop Alerts</h4>
            <p className="text-xs text-sage-600">
              Join the syndicate. Get 10% off your first drop and secret early access.
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white border border-sage-200/80 rounded-xl px-3 py-2.5 text-xs text-sage-900 placeholder:text-sage-400 focus:outline-none focus:border-terracotta-500 shadow-2xs"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-sage-900 text-linen-50 rounded-lg text-xs font-semibold hover:bg-terracotta-500 transition-colors flex items-center justify-center"
                  aria-label="Subscribe"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-sage-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sage-500">
          <div>
            © {new Date().getFullYear()} AMICE AMARINE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider bg-white border border-sage-200/80 rounded-full px-2.5 py-0.5 text-sage-600">
              RAZORPAY SECURED
            </span>
            <span className="text-[10px] uppercase tracking-wider bg-white border border-sage-200/80 rounded-full px-2.5 py-0.5 text-sage-600">
              UPI / CARDS / COD
            </span>
            <Link href="/admin" className="text-sage-500 hover:text-terracotta-600 transition-colors">
              [ADMIN PORTAL]
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
