'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { SearchModal } from './SearchModal';
import { Logo } from '@/components/ui/Logo';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const collectionsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Primary desktop navigation links
  const mainNavLinks = [
    { label: 'HOME', href: '/' },
    { label: 'SHOP ALL', href: '/collections/all-products' },
    { label: 'OVERSIZED TEES', href: '/collections/oversized-t-shirts' },
    { label: 'HOODIES', href: '/collections/hoodies' },
  ];

  // Dropdown items for more categories
  const collectionDropdown = [
    { label: 'JACKETS & OUTERWEAR', href: '/collections/jackets', desc: 'Denim, utility & tactical parkas' },
    { label: 'BOTTOMS & TRACKPANTS', href: '/collections/bottoms', desc: 'Barrel cargo & relaxed fits' },
    { label: 'ACCESSORIES & BAGS', href: '/collections/accessories', desc: 'Sling bags & utility packs' },
    { label: 'EXPLORE ALL PRODUCTS', href: '/collections/all-products', desc: 'Complete luxury drop catalog' },
  ];

  // Full category links for mobile drawer
  const allNavLinks = [
    { label: 'HOME', href: '/' },
    { label: 'SHOP ALL', href: '/collections/all-products' },
    { label: 'OVERSIZED TEES', href: '/collections/oversized-t-shirts' },
    { label: 'HOODIES', href: '/collections/hoodies' },
    { label: 'JACKETS', href: '/collections/jackets' },
    { label: 'BOTTOMS', href: '/collections/bottoms' },
    { label: 'ACCESSORIES', href: '/collections/accessories' },
    { label: 'TRACK ORDER', href: '/tracking' },
  ];

  const handleCollectionsEnter = () => {
    if (collectionsTimeoutRef.current) clearTimeout(collectionsTimeoutRef.current);
    setIsCollectionsOpen(true);
  };

  const handleCollectionsLeave = () => {
    collectionsTimeoutRef.current = setTimeout(() => {
      setIsCollectionsOpen(false);
    }, 150);
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300 border-b',
          isScrolled
            ? 'bg-linen-50/95 backdrop-blur-md border-sage-200/80 shadow-xs'
            : 'bg-linen-50/90 backdrop-blur-sm border-sage-200/60'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-sage-800 p-2 rounded-full hover:bg-linen-200/60 hover:text-terracotta-600 transition-colors"
                aria-label="Toggle Navigation Drawer"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo with deliberate right breathing margin */}
            <div className="flex-1 lg:flex-none flex justify-center lg:justify-start shrink-0 mr-2 sm:mr-4 lg:mr-8 xl:mr-12">
              <Link href="/" className="py-1 flex items-center" aria-label="Amice Amarine Home">
                <Logo size="md" />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7 flex-1 justify-start">
              {mainNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      'text-xs font-semibold tracking-[0.14em] transition-all relative py-2 group whitespace-nowrap',
                      isActive ? 'text-terracotta-600' : 'text-sage-700 hover:text-terracotta-600'
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        'absolute bottom-0 left-0 h-[2px] bg-terracotta-500 transition-all duration-300',
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      )}
                    />
                  </Link>
                );
              })}

              {/* Collections Hover Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleCollectionsEnter}
                onMouseLeave={handleCollectionsLeave}
              >
                <button
                  onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                  className={cn(
                    'flex items-center gap-1 text-xs font-semibold tracking-[0.14em] transition-all py-2 group whitespace-nowrap',
                    isCollectionsOpen || (pathname.startsWith('/collections') && !mainNavLinks.some((l) => l.href === pathname))
                      ? 'text-terracotta-600'
                      : 'text-sage-700 hover:text-terracotta-600'
                  )}
                  aria-expanded={isCollectionsOpen}
                  aria-haspopup="true"
                >
                  <span>MORE</span>
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 transition-transform duration-200',
                      isCollectionsOpen && 'rotate-180 text-terracotta-600'
                    )}
                  />
                  <span
                    className={cn(
                      'absolute bottom-0 left-0 h-[2px] bg-terracotta-500 transition-all duration-300',
                      isCollectionsOpen ? 'w-full' : 'w-0 group-hover:w-full'
                    )}
                  />
                </button>

                {isCollectionsOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-72 bg-linen-50/98 backdrop-blur-xl border border-sage-200 rounded-2xl shadow-xl p-2.5 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-sage-400 border-b border-sage-200/60">
                      Curated Categories
                    </div>
                    {collectionDropdown.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsCollectionsOpen(false)}
                        className="flex flex-col px-3 py-2 rounded-xl text-sage-800 hover:bg-linen-100 hover:text-terracotta-600 transition-colors group/item"
                      >
                        <span className="text-xs font-bold tracking-wide group-hover/item:text-terracotta-600">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-sage-500 group-hover/item:text-sage-700">
                          {item.desc}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Track Order */}
              <Link
                href="/tracking"
                className={cn(
                  'text-xs font-semibold tracking-[0.14em] transition-all relative py-2 group whitespace-nowrap',
                  pathname === '/tracking' ? 'text-terracotta-600' : 'text-sage-700 hover:text-terracotta-600'
                )}
              >
                TRACK ORDER
                <span
                  className={cn(
                    'absolute bottom-0 left-0 h-[2px] bg-terracotta-500 transition-all duration-300',
                    pathname === '/tracking' ? 'w-full' : 'w-0 group-hover:w-full'
                  )}
                />
              </Link>
            </nav>

            {/* Actions: Search, Wishlist, Account, Cart */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-sage-700 hover:text-terracotta-600 transition-colors p-2 rounded-full hover:bg-linen-200/60"
                aria-label="Search Catalog"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/account/wishlist"
                className="hidden sm:flex items-center justify-center text-sage-700 hover:text-terracotta-600 transition-colors p-2 relative rounded-full hover:bg-linen-200/60"
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
                    className="flex items-center gap-1.5 text-xs text-sage-800 hover:text-terracotta-600 p-2 rounded-full hover:bg-linen-200/60 transition-colors"
                  >
                    <User className="w-4 h-4 text-terracotta-500" />
                    <span className="hidden md:inline font-semibold uppercase truncate max-w-[90px]">
                      {user?.name.split(' ')[0]}
                    </span>
                  </button>
                ) : (
                  <Link
                    href="/account/login"
                    className="text-sage-700 hover:text-terracotta-600 transition-colors p-2 rounded-full hover:bg-linen-200/60 block"
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
                className="text-sage-900 bg-linen-100 hover:bg-linen-200/80 border border-sage-200/90 hover:border-terracotta-500 rounded-full transition-all px-3.5 py-1.5 flex items-center gap-2 group relative active:scale-95 shadow-2xs"
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
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-block py-1"
              aria-label="Amice Amarine Home"
            >
              <Logo size="md" />
            </Link>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-sage-500">
              EXPLORE COLLECTIONS
            </div>
            <div className="flex flex-col space-y-4">
              {allNavLinks.map((link) => (
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
