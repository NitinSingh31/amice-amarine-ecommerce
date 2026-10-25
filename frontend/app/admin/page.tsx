'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  ShieldAlert,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Settings,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Truck,
  ExternalLink,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  LogOut,
  Sparkles,
  Users,
  Eye,
  Check,
  X,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const router = useRouter();

  // Admin Login State
  const [loginEmail, setLoginEmail] = useState('admin@amiceamarine.com');
  const [loginPassword, setLoginPassword] = useState('Admin@Amice2026!');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'coupons' | 'settings'>('analytics');

  // Data States
  const [analytics, setAnalytics] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Modals & Forms
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'oversized-t-shirts',
    basePrice: 1499,
    compareAtPrice: 2499,
    tags: 'cyberpunk,oversized,streetwear',
    fit: 'Oversized Boxy Fit',
    images: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
    stockS: 15,
    stockM: 25,
    stockL: 35,
    stockXL: 20,
    stockXXL: 10,
  });

  const [isUpdateOrderStatusOpen, setIsUpdateOrderStatusOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('shipped');
  const [courierName, setCourierName] = useState('Delhivery Express');
  const [trackingAwb, setTrackingAwb] = useState('DEL-20269988-EXP');
  const [statusNote, setStatusNote] = useState('Dispatched via air courier express.');

  const [isNewCouponModalOpen, setIsNewCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: 'CYBER25',
    description: 'Special 25% Off Cyber Drop promotion',
    discountType: 'percentage',
    discountValue: 25,
    minCartValue: 1499,
    maxDiscountAmount: 500,
  });

  const [settingsForm, setSettingsForm] = useState({
    freeShippingThreshold: 999,
    standardShippingFee: 99,
    codFee: 50,
    codEnabled: true,
    bannerText: '🚨 EXCLUSIVE DROP: FLAT 15% OFF ON PREPAID ORDERS | FREE SHIPPING OVER ₹999',
  });

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const isAdmin = user && ['super_admin', 'manager', 'order_manager'].includes(user.role);

  // Auth Action
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await login(loginEmail, loginPassword);
      if (!res.success) {
        setLoginError(res.message || 'Failed to authenticate as administrator.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login error occurred.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleOneClickSuperAdmin = async () => {
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await login('admin@amiceamarine.com', 'Admin@Amice2026!');
      if (!res.success) {
        setLoginError(res.message || 'Failed to authenticate as super admin.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login error occurred.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Fetch Admin Data
  const fetchAdminData = async () => {
    if (!isAdmin) return;
    setIsLoadingData(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('amice_token') : null;
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: 'Bearer ' + token }),
    };

    try {
      const [analyticsRes, productsRes, ordersRes, couponsRes, settingsRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/analytics', { headers }),
        fetch('http://localhost:5000/api/admin/products', { headers }),
        fetch('http://localhost:5000/api/admin/orders', { headers }),
        fetch('http://localhost:5000/api/admin/coupons', { headers }),
        fetch('http://localhost:5000/api/admin/settings', { headers }),
      ]);

      const [aData, pData, oData, cData, sData] = await Promise.all([
        analyticsRes.json(),
        productsRes.json(),
        ordersRes.json(),
        couponsRes.json(),
        settingsRes.json(),
      ]);

      if (aData.success) setAnalytics(aData.data);
      if (pData.success) setProducts(pData.data.products);
      if (oData.success) setOrders(oData.data.orders);
      if (cData.success) setCoupons(cData.data.coupons);
      if (sData.success) {
        setSettings(sData.data.settings);
        setSettingsForm({
          freeShippingThreshold: sData.data.settings.shipping.freeShippingThreshold,
          standardShippingFee: sData.data.settings.shipping.standardShippingFee,
          codFee: sData.data.settings.shipping.codFee,
          codEnabled: sData.data.settings.shipping.codEnabled,
          bannerText: sData.data.settings.banner.text,
        });
      }
    } catch (e) {
      console.error('Failed to load admin dashboard data:', e);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  // Create Product Action
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('amice_token') : null;

    const variants = [
      { size: 'S', color: 'Obsidian Black', sku: 'AA-' + newProduct.name.substring(0, 4).toUpperCase() + '-S', stock: Number(newProduct.stockS) },
      { size: 'M', color: 'Obsidian Black', sku: 'AA-' + newProduct.name.substring(0, 4).toUpperCase() + '-M', stock: Number(newProduct.stockM) },
      { size: 'L', color: 'Obsidian Black', sku: 'AA-' + newProduct.name.substring(0, 4).toUpperCase() + '-L', stock: Number(newProduct.stockL) },
      { size: 'XL', color: 'Obsidian Black', sku: 'AA-' + newProduct.name.substring(0, 4).toUpperCase() + '-XL', stock: Number(newProduct.stockXL) },
      { size: 'XXL', color: 'Obsidian Black', sku: 'AA-' + newProduct.name.substring(0, 4).toUpperCase() + '-XXL', stock: Number(newProduct.stockXXL) },
    ];

    try {
      const res = await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: 'Bearer ' + token }),
        },
        body: JSON.stringify({
          name: newProduct.name,
          category: newProduct.category,
          basePrice: Number(newProduct.basePrice),
          compareAtPrice: Number(newProduct.compareAtPrice),
          tags: newProduct.tags.split(',').map((t) => t.trim()),
          fit: newProduct.fit,
          images: [newProduct.images],
          variants,
          status: 'published',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to create product');

      setFeedbackMsg('New product ' + newProduct.name + ' successfully added to live catalog.');
      setIsNewProductModalOpen(false);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete Product Action
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm('Are you sure you want to remove ' + name + ' from the store?')) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('amice_token') : null;
    try {
      const res = await fetch('http://localhost:5000/api/admin/products/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: 'Bearer ' + token }),
        },
      });
      if (res.ok) {
        setFeedbackMsg('Product ' + name + ' removed.');
        fetchAdminData();
      }
    } catch (e: any) {
      alert('Delete failed: ' + e.message);
    }
  };

  // Update Order Status Action
  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('amice_token') : null;

    try {
      const res = await fetch('http://localhost:5000/api/admin/orders/' + selectedOrder.orderNumber + '/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: 'Bearer ' + token }),
        },
        body: JSON.stringify({
          status: newStatus,
          courierName,
          trackingNumber: trackingAwb,
          note: statusNote,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to update order status');

      setFeedbackMsg('Order ' + selectedOrder.orderNumber + ' updated to ' + newStatus + '.');
      setIsUpdateOrderStatusOpen(false);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Create Coupon Action
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('amice_token') : null;

    try {
      const res = await fetch('http://localhost:5000/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: 'Bearer ' + token }),
        },
        body: JSON.stringify(newCoupon),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to create coupon');

      setFeedbackMsg('Coupon ' + newCoupon.code + ' activated successfully.');
      setIsNewCouponModalOpen(false);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete Coupon Action
  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm('Deactivate coupon ' + code + '?')) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('amice_token') : null;
    try {
      const res = await fetch('http://localhost:5000/api/admin/coupons/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: 'Bearer ' + token }),
        },
      });
      if (res.ok) {
        setFeedbackMsg('Coupon ' + code + ' deactivated.');
        fetchAdminData();
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Save Settings Action
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('amice_token') : null;

    try {
      const res = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: 'Bearer ' + token }),
        },
        body: JSON.stringify({
          shipping: {
            freeShippingThreshold: Number(settingsForm.freeShippingThreshold),
            standardShippingFee: Number(settingsForm.standardShippingFee),
            codFee: Number(settingsForm.codFee),
            codEnabled: settingsForm.codEnabled,
          },
          banner: {
            text: settingsForm.bannerText,
            link: '/collections/all-products',
            isActive: true,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to save settings');

      setFeedbackMsg('Store policies and announcement settings updated live.');
      fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 1. IF NOT LOGGED IN AS ADMIN: DISPLAY SECURE ADMIN GATEWAY
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-8 font-mono text-xs">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-brand-crimson/10 border border-brand-crimson/40 flex items-center justify-center mx-auto text-brand-crimson">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-crimson block font-bold">
            RESTRICTED CLEARANCE // LEVEL 5
          </span>
          <h1 className="text-2xl font-black uppercase text-white font-display">
            ADMIN CONTROL ROOM
          </h1>
          <p className="text-zinc-400 text-xs">
            Role-Based Access Control gate. Authorized personnel only.
          </p>
        </div>

        {/* 1-Click Demo Login */}
        <div className="p-4 bg-surface border border-brand-crimson/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 uppercase font-bold">DEMO SUPER ADMIN</span>
            <span className="text-[9px] bg-brand-crimson/20 text-brand-crimson px-1.5 py-0.5 border border-brand-crimson/30 uppercase font-bold">
              SUPER_ADMIN
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Login as <strong className="text-white">admin@amiceamarine.com</strong> with full root clearance.
          </p>
          <Button
            type="button"
            variant="glow"
            size="sm"
            fullWidth
            onClick={handleOneClickSuperAdmin}
            disabled={loginLoading}
          >
            {loginLoading ? 'AUTHENTICATING...' : '1-CLICK SUPER ADMIN LOGIN'}
          </Button>
        </div>

        {/* Custom Login Form */}
        <form onSubmit={handleAdminLogin} className="bg-surface border border-surface-border p-6 space-y-4">
          {loginError && (
            <div className="p-3 bg-red-950/40 border border-red-500/50 text-red-300 text-xs">
              {loginError}
            </div>
          )}

          <Input
            label="ADMIN EMAIL"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />

          <Input
            label="ADMIN SECRET KEY / PASSWORD"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="outline" size="md" fullWidth disabled={loginLoading}>
            {loginLoading ? 'VERIFYING...' : 'ENTER CONTROL ROOM'}
          </Button>
        </form>
      </div>
    );
  }

  // 2. LOGGED IN AS ADMIN: DISPLAY FULL ADMIN SUITE
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-mono text-xs">
      {/* Top Banner & Profile Bar */}
      <div className="bg-surface border border-surface-border p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-crimson text-white flex items-center justify-center font-black font-display text-lg">
            AA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black uppercase text-white font-display">
                AMICE AMARINE // ADMIN SUITE
              </span>
              <span className="text-[9px] bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/40 px-2 py-0.5 font-bold uppercase">
                {user.role}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Logged in as {user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5 text-[11px]">
              <Eye className="w-3.5 h-3.5" /> VISIT STOREFRONT
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={logout} className="gap-1.5 text-[11px] text-zinc-400 hover:text-white">
            <LogOut className="w-3.5 h-3.5" /> EXIT
          </Button>
        </div>
      </div>

      {/* Global Toast Feedback Message */}
      {feedbackMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedbackMsg}</span>
          </div>
          <button type="button" onClick={() => setFeedbackMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigation Tab Bar */}
      <div className="flex flex-wrap gap-2 border-b border-surface-border pb-3">
        <button
          onClick={() => setActiveTab('analytics')}
          className={'px-4 py-2 font-bold uppercase flex items-center gap-2 transition-all ' +
            (activeTab === 'analytics'
              ? 'bg-brand-crimson text-white shadow-[0_0_15px_rgba(255,0,60,0.5)]'
              : 'bg-surface border border-surface-border text-zinc-400 hover:text-white hover:bg-surface-subtle')
          }
        >
          <LayoutDashboard className="w-4 h-4" /> OVERVIEW & KPIS
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={'px-4 py-2 font-bold uppercase flex items-center gap-2 transition-all ' +
            (activeTab === 'products'
              ? 'bg-brand-crimson text-white shadow-[0_0_15px_rgba(255,0,60,0.5)]'
              : 'bg-surface border border-surface-border text-zinc-400 hover:text-white hover:bg-surface-subtle')
          }
        >
          <Package className="w-4 h-4" /> PRODUCTS ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={'px-4 py-2 font-bold uppercase flex items-center gap-2 transition-all ' +
            (activeTab === 'orders'
              ? 'bg-brand-crimson text-white shadow-[0_0_15px_rgba(255,0,60,0.5)]'
              : 'bg-surface border border-surface-border text-zinc-400 hover:text-white hover:bg-surface-subtle')
          }
        >
          <ShoppingCart className="w-4 h-4" /> ORDERS & FULFILLMENT ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={'px-4 py-2 font-bold uppercase flex items-center gap-2 transition-all ' +
            (activeTab === 'coupons'
              ? 'bg-brand-crimson text-white shadow-[0_0_15px_rgba(255,0,60,0.5)]'
              : 'bg-surface border border-surface-border text-zinc-400 hover:text-white hover:bg-surface-subtle')
          }
        >
          <Tags className="w-4 h-4" /> COUPONS ({coupons.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={'px-4 py-2 font-bold uppercase flex items-center gap-2 transition-all ' +
            (activeTab === 'settings'
              ? 'bg-brand-crimson text-white shadow-[0_0_15px_rgba(255,0,60,0.5)]'
              : 'bg-surface border border-surface-border text-zinc-400 hover:text-white hover:bg-surface-subtle')
          }
        >
          <Settings className="w-4 h-4" /> STORE SETTINGS
        </button>
      </div>

      {/* 1. OVERVIEW & KPIS */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 bg-surface border border-surface-border space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">GROSS REVENUE</span>
              <span className="text-xl font-black text-brand-crimson font-display">
                {formatINR(analytics.kpi.grossRevenue)}
              </span>
            </div>

            <div className="p-4 bg-surface border border-surface-border space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">TOTAL ORDERS</span>
              <span className="text-xl font-black text-white font-display">
                {analytics.kpi.totalOrders}
              </span>
            </div>

            <div className="p-4 bg-surface border border-surface-border space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">AVG ORDER VALUE</span>
              <span className="text-xl font-black text-white font-display">
                {formatINR(analytics.kpi.averageOrderValue)}
              </span>
            </div>

            <div className="p-4 bg-surface border border-surface-border space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">CATALOG ITEMS</span>
              <span className="text-xl font-black text-white font-display">
                {analytics.kpi.totalProducts}
              </span>
            </div>

            <div className="p-4 bg-surface border border-surface-border space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">REGISTERED SHOPPERS</span>
              <span className="text-xl font-black text-white font-display">
                {analytics.kpi.totalCustomers}
              </span>
            </div>

            <div className="p-4 bg-surface border border-surface-border space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">LOW STOCK ITEMS</span>
              <span className={'text-xl font-black font-display ' + (analytics.kpi.lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400')}>
                {analytics.kpi.lowStockCount}
              </span>
            </div>
          </div>

          {/* Status Breakdown Bar */}
          <div className="p-5 bg-surface border border-surface-border space-y-3">
            <h3 className="text-xs uppercase font-bold text-white tracking-wider">
              ORDER PIPELINE DISTRIBUTION
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3 bg-surface-subtle border border-surface-border">
                <span className="text-xs text-zinc-400 block uppercase">Order Placed</span>
                <span className="text-lg font-black text-white">{analytics.statusDistribution.placed}</span>
              </div>
              <div className="p-3 bg-surface-subtle border border-surface-border">
                <span className="text-xs text-zinc-400 block uppercase">Payment Verified</span>
                <span className="text-lg font-black text-emerald-400">{analytics.statusDistribution.paymentConfirmed}</span>
              </div>
              <div className="p-3 bg-surface-subtle border border-surface-border">
                <span className="text-xs text-zinc-400 block uppercase">Shipped in Transit</span>
                <span className="text-lg font-black text-cyan-400">{analytics.statusDistribution.shipped}</span>
              </div>
              <div className="p-3 bg-surface-subtle border border-surface-border">
                <span className="text-xs text-zinc-400 block uppercase">Delivered</span>
                <span className="text-lg font-black text-emerald-400">{analytics.statusDistribution.delivered}</span>
              </div>
              <div className="p-3 bg-surface-subtle border border-surface-border">
                <span className="text-xs text-zinc-400 block uppercase">Cancelled</span>
                <span className="text-lg font-black text-red-400">{analytics.statusDistribution.cancelled}</span>
              </div>
            </div>
          </div>

          {/* Recent Orders Stream */}
          <div className="bg-surface border border-surface-border p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-xs uppercase font-bold text-white tracking-wider">
                RECENT SYNDICATE TRANSACTIONS
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className="text-brand-crimson hover:underline text-[11px] font-bold uppercase"
              >
                VIEW ALL ORDERS →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-surface-border text-zinc-500 uppercase text-[10px]">
                    <th className="py-2.5">Order No</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Items</th>
                    <th className="py-2.5">Amount</th>
                    <th className="py-2.5">Payment</th>
                    <th className="py-2.5">Fulfillment</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/50">
                  {analytics.recentOrders.map((ord: any) => (
                    <tr key={ord._id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-3 font-bold text-white">{ord.orderNumber}</td>
                      <td className="py-3 text-zinc-400">{ord.customerEmail}</td>
                      <td className="py-3 text-zinc-300">{ord.items.length} garments</td>
                      <td className="py-3 font-bold text-brand-crimson">{formatINR(ord.totalAmount)}</td>
                      <td className="py-3">
                        <span className="uppercase text-[10px] text-emerald-400">
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-[9px] uppercase px-2 py-0.5 border border-brand-crimson/30 bg-brand-crimson/10 text-brand-crimson font-bold">
                          {ord.fulfillmentStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={'/tracking?order=' + ord.orderNumber}
                          target="_blank"
                          className="text-zinc-400 hover:text-white uppercase font-bold text-[10px]"
                        >
                          TRACK ↗
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black uppercase text-white font-display">CATALOG INVENTORY</h2>
              <p className="text-[11px] text-zinc-400">Create, manage, and update variant-level stock.</p>
            </div>
            <Button
              variant="glow"
              size="sm"
              onClick={() => setIsNewProductModalOpen(true)}
              className="gap-2 text-[11px]"
            >
              <Plus className="w-3.5 h-3.5" /> ADD NEW GARMENT
            </Button>
          </div>

          <div className="bg-surface border border-surface-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-surface-border bg-surface-subtle text-zinc-500 uppercase text-[10px]">
                    <th className="p-3">Preview</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Total Stock</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/50">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-surface-subtle/40 transition-colors">
                      <td className="p-3">
                        <div className="w-10 h-12 bg-zinc-900 border border-surface-border overflow-hidden">
                          <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-3 font-bold text-white">
                        <p>{prod.name}</p>
                        <span className="text-[10px] text-zinc-500 font-normal">/{prod.slug}</span>
                      </td>
                      <td className="p-3 text-zinc-400 uppercase text-[10px]">{prod.category}</td>
                      <td className="p-3 text-brand-crimson font-bold">{formatINR(prod.basePrice)}</td>
                      <td className="p-3">
                        <span className={'font-bold ' + (prod.totalStock <= 10 ? 'text-amber-400' : 'text-emerald-400')}>
                          {prod.totalStock} units
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-[9px] uppercase px-2 py-0.5 border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 font-bold">
                          {prod.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <Link
                          href={'/products/' + prod.slug}
                          target="_blank"
                          className="text-zinc-400 hover:text-white inline-block"
                          title="View on store"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod._id, prod.name)}
                          className="text-zinc-500 hover:text-brand-crimson inline-block"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ORDERS & FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black uppercase text-white font-display">ORDERS & SHIPMENT DISPATCH</h2>
              <p className="text-[11px] text-zinc-400">Update fulfillment status, assign courier partners, and attach AWB codes.</p>
            </div>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord._id} className="bg-surface border border-surface-border p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border/60 pb-3">
                  <div>
                    <span className="text-sm font-bold text-white font-display uppercase">
                      ORDER #{ord.orderNumber}
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      Customer: <strong className="text-white">{ord.shippingAddress.fullName}</strong> ({ord.customerEmail} • {ord.customerPhone})
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-brand-crimson">
                      {formatINR(ord.totalAmount)}
                    </span>
                    <span className="text-[9px] uppercase px-2 py-0.5 border border-brand-crimson/40 bg-brand-crimson/10 text-brand-crimson font-bold">
                      {ord.fulfillmentStatus.replace(/_/g, ' ')}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(ord);
                        setNewStatus(ord.fulfillmentStatus);
                        setCourierName(ord.courierName || 'Delhivery Express');
                        setTrackingAwb(ord.trackingNumber || ('DEL-' + ord.orderNumber.replace(/[^0-9]/g, '') + '-EXP'));
                        setIsUpdateOrderStatusOpen(true);
                      }}
                      className="text-[11px]"
                    >
                      UPDATE STATUS
                    </Button>
                  </div>
                </div>

                {/* Items & Shipping row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-2">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">ITEMS PACKED:</span>
                    {ord.items.map((i: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-zinc-300">
                        <span>{i.quantity}x {i.productName} ({i.variantTitle})</span>
                        <span className="font-bold text-white">{formatINR(i.totalPrice)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">DISPATCH LOGISTICS:</span>
                    <p className="text-zinc-300">Address: {ord.shippingAddress.addressLine1}, {ord.shippingAddress.city} - {ord.shippingAddress.postalCode}</p>
                    <p className="text-zinc-400">Courier: <strong className="text-white">{ord.courierName || 'Delhivery Express'}</strong></p>
                    <p className="text-zinc-400">AWB Code: <strong className="text-brand-crimson">{ord.trackingNumber || 'PENDING'}</strong></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. COUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black uppercase text-white font-display">DISCOUNT PROMOS & COUPONS</h2>
              <p className="text-[11px] text-zinc-400">Create promotional discount codes and percentage haul vouchers.</p>
            </div>
            <Button
              variant="glow"
              size="sm"
              onClick={() => setIsNewCouponModalOpen(true)}
              className="gap-2 text-[11px]"
            >
              <Plus className="w-3.5 h-3.5" /> CREATE PROMO CODE
            </Button>
          </div>

          <div className="bg-surface border border-surface-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-surface-border bg-surface-subtle text-zinc-500 uppercase text-[10px]">
                    <th className="p-3">Coupon Code</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Discount</th>
                    <th className="p-3">Min Cart Value</th>
                    <th className="p-3">Times Used</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/50">
                  {coupons.map((c) => (
                    <tr key={c._id} className="hover:bg-surface-subtle/40 transition-colors">
                      <td className="p-3 font-bold text-brand-crimson text-sm">{c.code}</td>
                      <td className="p-3 text-zinc-300">{c.description}</td>
                      <td className="p-3 font-bold text-white">
                        {c.discountType === 'percentage' ? (c.discountValue + '% OFF') : formatINR(c.discountValue)}
                      </td>
                      <td className="p-3 text-zinc-400">{formatINR(c.minCartValue)}</td>
                      <td className="p-3 text-zinc-300 font-bold">{c.usedCount || 0}</td>
                      <td className="p-3">
                        <span className="text-[9px] uppercase px-2 py-0.5 border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 font-bold">
                          {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteCoupon(c._id, c.code)}
                          className="text-zinc-500 hover:text-brand-crimson inline-block"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. STORE SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-surface border border-surface-border p-6 space-y-6 max-w-2xl">
          <div className="border-b border-surface-border pb-3">
            <h2 className="text-sm font-black uppercase text-white font-display">STORE POLICIES & ANNOUNCEMENTS</h2>
            <p className="text-[11px] text-zinc-400">Configure global shipping rules, cash on delivery surcharges, and announcement bar copy.</p>
          </div>

          <div className="space-y-4">
            <Input
              label="FREE SHIPPING THRESHOLD (₹)"
              type="number"
              value={settingsForm.freeShippingThreshold}
              onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
              required
            />

            <Input
              label="STANDARD SHIPPING FEE (₹)"
              type="number"
              value={settingsForm.standardShippingFee}
              onChange={(e) => setSettingsForm({ ...settingsForm, standardShippingFee: Number(e.target.value) })}
              required
            />

            <Input
              label="CASH ON DELIVERY FEE (₹)"
              type="number"
              value={settingsForm.codFee}
              onChange={(e) => setSettingsForm({ ...settingsForm, codFee: Number(e.target.value) })}
              required
            />

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-zinc-400 block font-bold">TOP ANNOUNCEMENT BANNER TEXT</label>
              <textarea
                value={settingsForm.bannerText}
                onChange={(e) => setSettingsForm({ ...settingsForm, bannerText: e.target.value })}
                rows={2}
                className="w-full bg-surface-subtle border border-surface-border p-3 text-xs font-mono text-white focus:outline-none focus:border-brand-crimson"
              />
            </div>
          </div>

          <Button type="submit" variant="glow" size="md">
            SAVE STORE SETTINGS
          </Button>
        </form>
      )}

      {/* MODAL: ADD PRODUCT */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <form onSubmit={handleCreateProduct} className="bg-surface border border-surface-border p-6 max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-sm font-black uppercase text-white font-display">
                NEW ANIME STREETWEAR GARMENT
              </h3>
              <button type="button" onClick={() => setIsNewProductModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <Input
              label="GARMENT TITLE"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="E.G. TITAN ERADICATOR // HEAVY HOODIE"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="BASE SELLING PRICE (₹)"
                type="number"
                value={newProduct.basePrice}
                onChange={(e) => setNewProduct({ ...newProduct, basePrice: Number(e.target.value) })}
                required
              />
              <Input
                label="COMPARE AT PRICE (₹)"
                type="number"
                value={newProduct.compareAtPrice}
                onChange={(e) => setNewProduct({ ...newProduct, compareAtPrice: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase font-bold block">CATEGORY</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full bg-surface-subtle border border-surface-border px-3 py-2 text-xs text-white"
              >
                <option value="oversized-t-shirts">Oversized T-Shirts</option>
                <option value="hoodies">Heavy Hoodies</option>
                <option value="jackets">Bomber Jackets</option>
                <option value="bottoms">Barrel Cargo Trackpants</option>
                <option value="accessories">Syndicate Accessories</option>
              </select>
            </div>

            <Input
              label="PRIMARY IMAGE URL"
              value={newProduct.images}
              onChange={(e) => setNewProduct({ ...newProduct, images: e.target.value })}
              required
            />

            <div className="space-y-2 pt-2 border-t border-surface-border">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">INITIAL SIZE STOCK:</span>
              <div className="grid grid-cols-5 gap-2 text-center">
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase block">S</label>
                  <input
                    type="number"
                    value={newProduct.stockS}
                    onChange={(e) => setNewProduct({ ...newProduct, stockS: Number(e.target.value) })}
                    className="w-full bg-surface-subtle border border-surface-border p-1.5 text-center text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase block">M</label>
                  <input
                    type="number"
                    value={newProduct.stockM}
                    onChange={(e) => setNewProduct({ ...newProduct, stockM: Number(e.target.value) })}
                    className="w-full bg-surface-subtle border border-surface-border p-1.5 text-center text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase block">L</label>
                  <input
                    type="number"
                    value={newProduct.stockL}
                    onChange={(e) => setNewProduct({ ...newProduct, stockL: Number(e.target.value) })}
                    className="w-full bg-surface-subtle border border-surface-border p-1.5 text-center text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase block">XL</label>
                  <input
                    type="number"
                    value={newProduct.stockXL}
                    onChange={(e) => setNewProduct({ ...newProduct, stockXL: Number(e.target.value) })}
                    className="w-full bg-surface-subtle border border-surface-border p-1.5 text-center text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase block">XXL</label>
                  <input
                    type="number"
                    value={newProduct.stockXXL}
                    onChange={(e) => setNewProduct({ ...newProduct, stockXXL: Number(e.target.value) })}
                    className="w-full bg-surface-subtle border border-surface-border p-1.5 text-center text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsNewProductModalOpen(false)}>
                CANCEL
              </Button>
              <Button type="submit" variant="glow" size="sm">
                PUBLISH GARMENT
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: UPDATE ORDER STATUS */}
      {isUpdateOrderStatusOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <form onSubmit={handleUpdateOrderStatus} className="bg-surface border border-surface-border p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-sm font-black uppercase text-white font-display">
                DISPATCH ORDER {selectedOrder.orderNumber}
              </h3>
              <button type="button" onClick={() => setIsUpdateOrderStatusOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase font-bold block">FULFILLMENT STATUS</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-surface-subtle border border-surface-border px-3 py-2 text-xs text-white"
              >
                <option value="order_placed">order_placed (Order Logged)</option>
                <option value="payment_confirmed">payment_confirmed (Payment Verified)</option>
                <option value="packed">packed (Quality Checked & Tagged)</option>
                <option value="shipped">shipped (Handed over to courier)</option>
                <option value="out_for_delivery">out_for_delivery (Rider Assigned)</option>
                <option value="delivered">delivered (Successfully Delivered)</option>
                <option value="cancelled">cancelled (Order Cancelled)</option>
              </select>
            </div>

            <Input
              label="COURIER PARTNER"
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
              placeholder="Delhivery Express, Bluedart, etc."
              required
            />

            <Input
              label="TRACKING AWB NUMBER"
              value={trackingAwb}
              onChange={(e) => setTrackingAwb(e.target.value)}
              placeholder="E.G. DEL-20265729-EXP"
              required
            />

            <Input
              label="DISPATCH LOG NOTE"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsUpdateOrderStatusOpen(false)}>
                CLOSE
              </Button>
              <Button type="submit" variant="glow" size="sm">
                SAVE & SYNC DISPATCH
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: CREATE COUPON */}
      {isNewCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <form onSubmit={handleCreateCoupon} className="bg-surface border border-surface-border p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-sm font-black uppercase text-white font-display">
                CREATE PROMOTIONAL CODE
              </h3>
              <button type="button" onClick={() => setIsNewCouponModalOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <Input
              label="PROMO CODE (UPPERCASE)"
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
              required
            />

            <Input
              label="DESCRIPTION"
              value={newCoupon.description}
              onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold block">DISCOUNT TYPE</label>
                <select
                  value={newCoupon.discountType}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                  className="w-full bg-surface-subtle border border-surface-border px-3 py-2 text-xs text-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Cash (₹)</option>
                </select>
              </div>

              <Input
                label="DISCOUNT VALUE"
                type="number"
                value={newCoupon.discountValue}
                onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="MIN CART VALUE (₹)"
                type="number"
                value={newCoupon.minCartValue}
                onChange={(e) => setNewCoupon({ ...newCoupon, minCartValue: Number(e.target.value) })}
              />

              <Input
                label="MAX DISCOUNT CAP (₹)"
                type="number"
                value={newCoupon.maxDiscountAmount}
                onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscountAmount: Number(e.target.value) })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsNewCouponModalOpen(false)}>
                CANCEL
              </Button>
              <Button type="submit" variant="glow" size="sm">
                ACTIVATE COUPON
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
