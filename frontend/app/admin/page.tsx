'use client';

import Link from 'next/link';
import { ShieldAlert, LayoutDashboard, ShoppingCart, Package, Tags, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <div className="border border-brand-crimson/40 bg-brand-crimson/5 p-6 space-y-3">
        <div className="flex items-center gap-2 text-brand-crimson font-mono font-bold text-sm uppercase">
          <ShieldAlert className="w-5 h-5" /> AMICE AMARINE // ADMIN SUITE (PHASE 1 FOUNDATION)
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          The Admin Dashboard is connected to MongoDB and secured with Role-Based Access Control (Super Admin, Manager, Order Manager).
          Admin API endpoints for products, orders, categories, and settings are operational on the backend.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-5 bg-surface border border-surface-border space-y-2">
          <LayoutDashboard className="w-6 h-6 text-brand-cyan" />
          <h3 className="text-sm font-bold uppercase text-white">Dashboard Overview</h3>
          <p className="text-xs text-zinc-400">Real-time revenue, order counts, customer spending.</p>
        </div>
        <div className="p-5 bg-surface border border-surface-border space-y-2">
          <Package className="w-6 h-6 text-brand-crimson" />
          <h3 className="text-sm font-bold uppercase text-white">Product Catalog</h3>
          <p className="text-xs text-zinc-400">Variant-level stock, prices, image uploads.</p>
        </div>
        <div className="p-5 bg-surface border border-surface-border space-y-2">
          <ShoppingCart className="w-6 h-6 text-brand-amber" />
          <h3 className="text-sm font-bold uppercase text-white">Order Management</h3>
          <p className="text-xs text-zinc-400">Tracking numbers, statuses, invoices, refunds.</p>
        </div>
        <div className="p-5 bg-surface border border-surface-border space-y-2">
          <Tags className="w-6 h-6 text-emerald-400" />
          <h3 className="text-sm font-bold uppercase text-white">Discounts & Coupons</h3>
          <p className="text-xs text-zinc-400">Prepaid discounts, free shipping thresholds.</p>
        </div>
        <div className="p-5 bg-surface border border-surface-border space-y-2">
          <Users className="w-6 h-6 text-purple-400" />
          <h3 className="text-sm font-bold uppercase text-white">Customers</h3>
          <p className="text-xs text-zinc-400">Order history, saved addresses, role management.</p>
        </div>
        <div className="p-5 bg-surface border border-surface-border space-y-2">
          <Settings className="w-6 h-6 text-zinc-300" />
          <h3 className="text-sm font-bold uppercase text-white">Store Settings</h3>
          <p className="text-xs text-zinc-400">Announcement bar, hero banner, shipping fees.</p>
        </div>
      </div>

      <div className="p-6 bg-surface-subtle border border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs uppercase font-bold text-white tracking-wider">Default Admin Credentials (Seeded):</h4>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Email: <span className="text-white">admin@amiceamarine.com</span> | Password: <span className="text-white">Admin@Amice2026!</span>
          </p>
        </div>
        <Link href="/admin/login">
          <Button variant="glow" size="md">
            ADMIN LOGIN →
          </Button>
        </Link>
      </div>
    </div>
  );
}
