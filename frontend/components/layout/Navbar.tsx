'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, Heart, User, Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { SearchModal } from './SearchModal';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { itemCount, openCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'SHOP ALL', href: '/collections/all-products' },
    { label: 'OVERSIZED TEES', href: '/collections/oversized-t-shirts' },
    { label: 'HOODIES', href: '/collections/hoodies' },
    { label: 'JACKETS', href: '/collections/jackets' },
    { label: 'BOTTOMS', href: '/collections/bottoms' },
    { label: 'ACCESSORIES', href: '/collections/accessories' },
    { label: 'TRACK ORDER', href: '/tracking' },
  ];

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300 border-b',
          isScrolled
            ? 'bg-linen-50/95 backdrop-blur-md border-sage-200/80 shadow-xs'
            : 'bg-linen-50/80 backdrop-blur-sm border-sage-100'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-sage-800 p-2 hover:text-terracotta-600 transition-colors"
                aria-label="Toggle Navigation Drawer"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
              <Link href="/" className="group flex items-center py-1" aria-label="Amice Amarine Home">
                <div className="relative h-12 w-28 sm:h-14 sm:w-36 flex items-center justify-center">
                  <Image
                    src="/images/logo.jpg"
                    alt="Amice Amarine Logo"
                    fill
                    priority
                    sizes="(max-width: 640px) 112px, 144px"
                    className="object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs font-semibold tracking-wider text-sage-700 hover:text-terracotta-600 transition-all relative py-2 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-terracotta-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions: Search, Wishlist, Account, Cart */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-sage-700 hover:text-terracotta-600 transition-colors p-2 rounded-full hover:bg-linen-100"
                aria-label="Search Catalog"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/account/wishlist"
                className="hidden sm:block text-sage-700 hover:text-terracotta-600 transition-colors p-2 relative rounded-full hover:bg-linen-100"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {user?.wishlist && user.wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-terracotta-500 rounded-full" />
                )}
              </Link>

              {/* User Account / Dropdown */}
              <div className="relative">
                {isAuthenticated ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 text-xs text-sage-800 hover:text-terracotta-600 p-2 rounded-full hover:bg-linen-100 transition-colors"
                  >
                    <User className="w-4 h-4 text-terracotta-500" />
                    <span className="hidden md:inline font-semibold uppercase truncate max-w-[90px]">
                      {user?.name.split(' ')[0]}
                    </span>
                  </button>
                ) : (
                  <Link
                    href="/account/login"
                    className="text-sage-700 hover:text-terracotta-600 transition-colors p-2 rounded-full hover:bg-linen-100 block"
                    aria-label="Customer Account Login"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )}

                {/* Authenticated Dropdown Menu */}
                {isAuthenticated && isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white border border-sage-200 rounded-2xl shadow-xl p-2 space-y-1 text-xs z-50 animate-in fade-in zoom-in-95"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-sage-100">
                      <p className="text-sage-900 font-bold uppercase truncate">{user?.name}</p>
                      <p className="text-[10px] text-sage-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-3 py-2 text-sage-700 hover:text-sage-900 hover:bg-linen-100 rounded-lg transition-colors uppercase font-medium"
                    >
                      MY DASHBOARD
                    </Link>
                    <Link
                      href="/account/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-3 py-2 text-sage-700 hover:text-sage-900 hover:bg-linen-100 rounded-lg transition-colors uppercase font-medium"
                    >
                      SAVED WISHLIST ({user?.wishlist?.length || 0})
                    </Link>
                    {user?.role === 'super_admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-3 py-2 text-terracotta-600 hover:bg-terracotta-50 rounded-lg transition-colors uppercase font-bold"
                      >
                        ADMIN PORTAL
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-sage-600 hover:text-terracotta-600 hover:bg-linen-100 rounded-lg transition-colors uppercase border-t border-sage-100 flex items-center justify-between font-medium"
                    >
                      <span>SIGN OUT</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="text-sage-900 bg-linen-100 border border-sage-200 hover:border-terracotta-500 rounded-full transition-all px-3.5 py-1.5 flex items-center gap-2 group relative active:scale-95 shadow-2xs"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 text-sage-700 group-hover:text-terracotta-600 transition-colors" />
                <span className="text-xs font-bold text-sage-900 group-hover:text-terracotta-600">
                  {itemCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-linen-50/98 backdrop-blur-xl border-t border-sage-200 lg:hidden flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-left duration-200">
          <div className="space-y-6">
            <div className="relative h-12 w-28 -ml-1">
              <Image
                src="/images/logo.jpg"
                alt="Amice Amarine Logo"
                fill
                sizes="112px"
                className="object-contain object-left mix-blend-multiply"
              />
            </div>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-sage-500">
              EXPLORE COLLECTIONS
            </div>
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-bold tracking-wide uppercase text-sage-800 hover:text-terracotta-600 transition-colors flex items-center justify-between border-b border-sage-200/60 pb-3"
                >
                  <span>{link.label}</span>
                  <span className="text-sage-400 font-sans text-sm">→</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-sage-200 space-y-4">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-bold uppercase text-sage-900"
                >
                  HELLO, {user?.name}
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-xs text-sage-600 hover:text-terracotta-600 uppercase font-medium"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link
                href="/account/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center text-xs uppercase tracking-wider text-white py-2.5 rounded-full bg-terracotta-500 hover:bg-terracotta-600 font-semibold"
              >
                CUSTOMER SIGN IN
              </Link>
            )}

            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center text-xs uppercase tracking-wider text-sage-700 hover:text-sage-900 py-2 border border-sage-200 bg-linen-100 rounded-full font-medium"
            >
              ADMIN PORTAL
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
