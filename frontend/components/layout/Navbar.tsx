'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, User, Menu, X, LogOut, Check } from 'lucide-react';
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
            ? 'bg-background/95 backdrop-blur-md border-surface-border shadow-2xl'
            : 'bg-background/80 backdrop-blur-sm border-surface-border/50'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-brand-white p-2 hover:text-brand-crimson transition-colors"
                aria-label="Toggle Navigation Drawer"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo Wordmark */}
            <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
              <Link href="/" className="group flex flex-col items-center lg:items-start">
                <span className="text-xl sm:text-2xl font-black tracking-[0.25em] uppercase text-white group-hover:text-brand-crimson transition-colors font-display">
                  AMICE AMARINE
                </span>
                <span className="text-[9px] tracking-[0.4em] uppercase text-zinc-500 font-mono -mt-1 group-hover:text-zinc-300 transition-colors">
                  ANIME X STREETWEAR
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs font-bold tracking-[0.15em] text-zinc-300 hover:text-brand-crimson transition-all relative py-2 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-crimson transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions: Search, Wishlist, Account, Cart */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-zinc-300 hover:text-brand-crimson transition-colors p-2"
                aria-label="Search Catalog"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/account/wishlist"
                className="hidden sm:block text-zinc-300 hover:text-brand-crimson transition-colors p-2 relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {user?.wishlist && user.wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-crimson rounded-full" />
                )}
              </Link>

              {/* User Account / Dropdown */}
              <div className="relative">
                {isAuthenticated ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white p-2 border border-transparent hover:border-surface-border transition-colors"
                  >
                    <User className="w-4 h-4 text-brand-crimson" />
                    <span className="hidden md:inline font-bold uppercase truncate max-w-[90px]">
                      {user?.name.split(' ')[0]}
                    </span>
                  </button>
                ) : (
                  <Link
                    href="/account/login"
                    className="text-zinc-300 hover:text-brand-crimson transition-colors p-2 block"
                    aria-label="Customer Account Login"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )}

                {/* Authenticated Dropdown Menu */}
                {isAuthenticated && isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-surface-border shadow-2xl p-2 space-y-1 text-xs font-mono z-50 animate-in fade-in zoom-in-95"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-surface-border/50">
                      <p className="text-white font-bold uppercase truncate">{user?.name}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-3 py-2 text-zinc-300 hover:text-white hover:bg-surface transition-colors uppercase"
                    >
                      MY DASHBOARD
                    </Link>
                    <Link
                      href="/account/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-3 py-2 text-zinc-300 hover:text-white hover:bg-surface transition-colors uppercase"
                    >
                      SAVED WISHLIST ({user?.wishlist?.length || 0})
                    </Link>
                    {user?.role === 'super_admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-3 py-2 text-brand-crimson hover:bg-surface transition-colors uppercase font-bold"
                      >
                        ADMIN PORTAL
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-zinc-400 hover:text-brand-crimson hover:bg-surface transition-colors uppercase border-t border-surface-border/50 flex items-center justify-between"
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
                className="text-brand-white bg-surface-subtle border border-surface-border hover:border-brand-crimson transition-all px-3 py-2 flex items-center gap-2 group relative active:scale-95"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 text-zinc-300 group-hover:text-brand-crimson transition-colors" />
                <span className="text-xs font-mono font-bold text-white group-hover:text-brand-crimson">
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
        <div className="fixed inset-0 top-16 z-50 bg-background/98 backdrop-blur-xl border-t border-surface-border lg:hidden flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-left duration-200">
          <div className="space-y-6">
            <div className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">
              EXPLORE COLLECTIONS
            </div>
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-black tracking-wider uppercase text-zinc-200 hover:text-brand-crimson transition-colors flex items-center justify-between border-b border-surface-border/50 pb-3"
                >
                  <span>{link.label}</span>
                  <span className="text-zinc-600 font-mono text-sm">→</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-surface-border space-y-4">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-mono font-bold uppercase text-white"
                >
                  HELLO, {user?.name}
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-xs font-mono text-zinc-500 hover:text-brand-crimson uppercase"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link
                href="/account/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center text-xs uppercase font-mono tracking-widest text-white py-2.5 border border-brand-crimson bg-brand-crimson/10 font-bold"
              >
                CUSTOMER SIGN IN
              </Link>
            )}

            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center text-xs uppercase font-mono tracking-widest text-zinc-400 hover:text-white py-2 border border-surface-border bg-surface-subtle"
            >
              ADMIN PORTAL
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
