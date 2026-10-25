'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserAddress } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  User,
  MapPin,
  Package,
  Shield,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Heart,
  Truck,
  Search,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

export default function AccountDashboardPage() {
  const { user, isAuthenticated, isLoading, logout, updateProfile, addAddress, deleteAddress } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'security'>('profile');
  const [realOrders, setRealOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      if (!isAuthenticated) return;
      setIsLoadingOrders(true);
      try {
        const token = localStorage.getItem('amice_token');
        const res = await fetch('http://localhost:5000/api/orders/my-orders', {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const data = await res.json();
        if (data.success && data.data?.orders) {
          setRealOrders(data.data.orders);
        }
      } catch (e) {
        console.error('Failed to load real orders:', e);
      } finally {
        setIsLoadingOrders(false);
      }
    }
    loadOrders();
  }, [isAuthenticated]);

  // Edit Profile State
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileMessage, setProfileMessage] = useState('');

  // Add Address Modal/Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<UserAddress, '_id'>>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/account/login');
    }
    if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone || '');
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-mono text-xs text-zinc-500 animate-pulse">
        LOADING ACCOUNT DATA...
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile(profileName, profilePhone);
    if (success) {
      setProfileMessage('Profile details updated successfully.');
      setTimeout(() => setProfileMessage(''), 4000);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addAddress(newAddr);
    if (success) {
      setShowAddressForm(false);
      setNewAddr({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false,
      });
    }
  };

  // Demo mock orders for Phase 3 visual demonstration (connected to real backend Order in Phase 4/5)
  const mockOrders = [
    {
      orderNumber: 'AA-2026-9041',
      date: '24 Oct 2026',
      total: 2598,
      status: 'Delivered',
      statusColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
      items: [
        { name: 'VOID DOMAIN // OVERSIZED GRAPHIC TEE', size: 'L', qty: 2, price: 1299 },
      ],
    },
    {
      orderNumber: 'AA-2026-8812',
      date: '12 Oct 2026',
      total: 2499,
      status: 'Delivered',
      statusColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
      items: [
        { name: 'SHADOW MONARCH // ZIP HOODIE', size: 'XL', qty: 1, price: 2499 },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Welcome Banner */}
      <div className="border border-surface-border bg-surface p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-brand-crimson/15 border border-brand-crimson/40 text-brand-crimson text-[10px] font-mono font-bold uppercase tracking-widest">
            SYNDICATE MEMBER
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-display">
            WELCOME, {user.name}
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            {user.email} • {user.role.toUpperCase()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/account/wishlist">
            <Button variant="secondary" size="sm" className="text-xs">
              <Heart className="w-3.5 h-3.5 mr-1 text-brand-crimson" /> WISHLIST ({user.wishlist?.length || 0})
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={logout} className="text-xs">
            <LogOut className="w-3.5 h-3.5 mr-1" /> LOGOUT
          </Button>
        </div>
      </div>

      {/* Main Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 bg-surface border border-surface-border p-3 space-y-1 text-xs font-mono">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 uppercase tracking-wider font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'profile' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-surface-subtle'
            }`}
          >
            <User className="w-4 h-4" /> PROFILE DETAILS
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-3 uppercase tracking-wider font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'addresses' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-surface-subtle'
            }`}
          >
            <MapPin className="w-4 h-4" /> SAVED ADDRESSES ({user.addresses?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 uppercase tracking-wider font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'orders' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-surface-subtle'
            }`}
          >
            <Package className="w-4 h-4" /> ORDER HISTORY ({realOrders.length > 0 ? realOrders.length : mockOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3 uppercase tracking-wider font-bold flex items-center gap-2.5 transition-colors ${
              activeTab === 'security' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-surface-subtle'
            }`}
          >
            <Shield className="w-4 h-4" /> SECURITY
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="lg:col-span-9 bg-surface border border-surface-border p-6 sm:p-8">
          {/* 1. PROFILE DETAILS */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="border-b border-surface-border pb-4">
                <h2 className="text-lg font-black uppercase text-white font-display">PERSONAL DETAILS</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Manage your display name and contact phone number.</p>
              </div>

              {profileMessage && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{profileMessage}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                <Input
                  label="FULL NAME"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
                <Input
                  label="EMAIL ADDRESS"
                  value={user.email}
                  disabled
                  className="opacity-50 cursor-not-allowed"
                />
                <Input
                  label="PHONE NUMBER"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />

                <div className="pt-2">
                  <Button type="submit" variant="glow" size="md">
                    SAVE CHANGES
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* 2. SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="border-b border-surface-border pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black uppercase text-white font-display">SAVED ADDRESSES</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Manage delivery locations for rapid checkout.</p>
                </div>
                {!showAddressForm && (
                  <Button variant="primary" size="sm" onClick={() => setShowAddressForm(true)}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> ADD ADDRESS
                  </Button>
                )}
              </div>

              {/* Add Address Form */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="p-6 bg-surface-subtle border border-surface-border space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                    <h3 className="text-xs font-mono uppercase font-bold text-white">NEW DELIVERY ADDRESS</h3>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="text-xs font-mono text-zinc-500 hover:text-white"
                    >
                      CANCEL
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="RECIPIENT NAME"
                      required
                      value={newAddr.fullName}
                      onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    />
                    <Input
                      label="PHONE NUMBER"
                      required
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    />
                    <div className="sm:col-span-2">
                      <Input
                        label="STREET ADDRESS / FLAT / BUILDING"
                        required
                        value={newAddr.addressLine1}
                        onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        label="LANDMARK / AREA (OPTIONAL)"
                        value={newAddr.addressLine2}
                        onChange={(e) => setNewAddr({ ...newAddr, addressLine2: e.target.value })}
                      />
                    </div>
                    <Input
                      label="CITY"
                      required
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    />
                    <Input
                      label="STATE"
                      required
                      value={newAddr.state}
                      onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    />
                    <Input
                      label="PINCODE"
                      required
                      maxLength={6}
                      value={newAddr.postalCode}
                      onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                    />
                    <Input
                      label="COUNTRY"
                      value={newAddr.country}
                      disabled
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAddr.isDefault}
                        onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                        className="accent-brand-crimson"
                      />
                      <span>SET AS DEFAULT ADDRESS</span>
                    </label>

                    <Button type="submit" variant="glow" size="md">
                      SAVE ADDRESS
                    </Button>
                  </div>
                </form>
              )}

              {/* Address Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses && user.addresses.length > 0 ? (
                  user.addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className="p-5 bg-surface-subtle border border-surface-border space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-white font-mono">
                          {addr.fullName}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[9px] font-mono font-bold uppercase bg-brand-crimson text-white px-2 py-0.5">
                            DEFAULT
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-zinc-400 font-mono space-y-0.5">
                        <p>{addr.addressLine1}</p>
                        {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                        <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                        <p>Phone: {addr.phone}</p>
                      </div>

                      <div className="pt-2 border-t border-surface-border/50 flex justify-end">
                        <button
                          onClick={() => addr._id && deleteAddress(addr._id)}
                          className="text-[10px] font-mono text-zinc-500 hover:text-brand-crimson flex items-center gap-1 transition-colors uppercase"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> DELETE
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="sm:col-span-2 text-center py-10 border border-dashed border-surface-border text-xs font-mono text-zinc-500">
                    NO SAVED ADDRESSES FOUND. CLICK &quot;ADD ADDRESS&quot; ABOVE.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="border-b border-surface-border pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-black uppercase text-white font-display">ORDER ARCHIVES</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Review current fulfillment tracking and past shipments.</p>
                </div>
                <Link href="/tracking">
                  <Button variant="outline" size="sm" className="gap-2 text-[11px]">
                    <Search className="w-3.5 h-3.5" /> LIVE TRACKING RADAR
                  </Button>
                </Link>
              </div>

              {isLoadingOrders ? (
                <div className="p-8 text-center text-xs font-mono text-zinc-500 animate-pulse">
                  FETCHING YOUR ORDERS FROM SYNDICATE ARCHIVE...
                </div>
              ) : realOrders.length > 0 ? (
                <div className="space-y-4">
                  {realOrders.map((ord) => (
                    <div
                      key={ord.orderNumber}
                      className="p-5 bg-surface-subtle border border-surface-border space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border/60 pb-3">
                        <div>
                          <span className="text-xs font-mono font-bold text-white uppercase block">
                            ORDER #{ord.orderNumber}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 border ${
                              ord.fulfillmentStatus === 'cancelled'
                                ? 'text-red-400 bg-red-950/40 border-red-500/30'
                                : ord.fulfillmentStatus === 'delivered'
                                ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
                                : 'text-brand-crimson bg-brand-crimson/10 border-brand-crimson/30'
                            }`}
                          >
                            {ord.fulfillmentStatus.replace(/_/g, ' ')}
                          </span>
                          <span className="text-sm font-mono font-bold text-white">
                            {formatINR(ord.totalAmount)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {ord.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-xs font-mono">
                            <span className="text-zinc-300">
                              {item.quantity}x {item.productName} ({item.variantTitle})
                            </span>
                            <span className="text-white font-bold">{formatINR(item.totalPrice)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-surface-border/40 flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-500 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-brand-crimson" /> {ord.courierName || 'Delhivery Express'} (AWB: {ord.trackingNumber || 'DEL-20265729-EXP'})
                        </span>
                        <Link
                          href={`/tracking?order=${ord.orderNumber}`}
                          className="text-brand-crimson hover:underline font-bold uppercase"
                        >
                          TRACK PACKAGE →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {mockOrders.map((ord) => (
                    <div
                      key={ord.orderNumber}
                      className="p-5 bg-surface-subtle border border-surface-border space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border/60 pb-3">
                        <div>
                          <span className="text-xs font-mono font-bold text-white uppercase block">
                            ORDER #{ord.orderNumber}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">Placed on {ord.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 border ${ord.statusColor}`}>
                            {ord.status}
                          </span>
                          <span className="text-sm font-mono font-bold text-white">
                            {formatINR(ord.total)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs font-mono">
                            <span className="text-zinc-300">
                              {item.qty}x {item.name} (Size: {item.size})
                            </span>
                            <span className="text-white font-bold">{formatINR(item.price * item.qty)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-surface-border/40 flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-500 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-brand-crimson" /> Bluedart Express (Tracking: BD89421098IN)
                        </span>
                        <Link
                          href={`/tracking?order=${ord.orderNumber}`}
                          className="text-brand-crimson hover:underline font-bold uppercase"
                        >
                          TRACK PACKAGE →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="border-b border-surface-border pb-4">
                <h2 className="text-lg font-black uppercase text-white font-display">ACCOUNT SECURITY</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Manage your credentials and password security.</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); alert('Password updated successfully.'); }} className="space-y-4 max-w-md">
                <Input
                  label="CURRENT PASSWORD"
                  type="password"
                  required
                  placeholder="••••••••••••"
                />
                <Input
                  label="NEW PASSWORD (MIN 8 CHARACTERS)"
                  type="password"
                  required
                  placeholder="••••••••••••"
                />
                <Input
                  label="CONFIRM NEW PASSWORD"
                  type="password"
                  required
                  placeholder="••••••••••••"
                />

                <div className="pt-2">
                  <Button type="submit" variant="glow" size="md">
                    UPDATE PASSWORD
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
