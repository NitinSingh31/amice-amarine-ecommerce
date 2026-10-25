'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface UserAddress {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  addresses: UserAddress[];
  wishlist: string[];
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (name: string, phone: string) => Promise<boolean>;
  addAddress: (address: Omit<UserAddress, '_id'>) => Promise<boolean>;
  deleteAddress: (addressId: string) => Promise<boolean>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  isProductWishlisted: (productId: string) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const API_BASE = 'http://localhost:5000/api/auth';

  // Load token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('amice_token');
    const savedUser = localStorage.getItem('amice_user');

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // ignore
        }
      }
      fetchMe(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchMe = async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const json = await res.json();
        setUser(json.data.user);
        localStorage.setItem('amice_user', JSON.stringify(json.data.user));
      } else {
        logout();
      }
    } catch (e) {
      console.warn('Failed to fetch user profile', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.error?.message || 'Login failed' };
      }

      setToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem('amice_token', data.data.token);
      localStorage.setItem('amice_user', JSON.stringify(data.data.user));

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error occurred' };
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.error?.message || 'Registration failed' };
      }

      setToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem('amice_token', data.data.token);
      localStorage.setItem('amice_user', JSON.stringify(data.data.user));

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error occurred' };
    }
  };

  const logout = () => {
    fetch(`${API_BASE}/logout`, { method: 'POST' }).catch(() => {});
    setUser(null);
    setToken(null);
    localStorage.removeItem('amice_token');
    localStorage.removeItem('amice_user');
    router.push('/');
  };

  const updateProfile = async (name: string, phone: string) => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone }),
      });
      if (res.ok) {
        const json = await res.json();
        setUser(json.data.user);
        localStorage.setItem('amice_user', JSON.stringify(json.data.user));
        return true;
      }
    } catch (e) {
      console.warn('Update profile error', e);
    }
    return false;
  };

  const addAddress = async (address: Omit<UserAddress, '_id'>) => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      });
      if (res.ok) {
        const json = await res.json();
        if (user) {
          const updatedUser = { ...user, addresses: json.data.addresses };
          setUser(updatedUser);
          localStorage.setItem('amice_user', JSON.stringify(updatedUser));
        }
        return true;
      }
    } catch (e) {
      console.warn('Add address error', e);
    }
    return false;
  };

  const deleteAddress = async (addressId: string) => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/addresses/${addressId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (user) {
          const updatedUser = { ...user, addresses: json.data.addresses };
          setUser(updatedUser);
          localStorage.setItem('amice_user', JSON.stringify(updatedUser));
        }
        return true;
      }
    } catch (e) {
      console.warn('Delete address error', e);
    }
    return false;
  };

  const toggleWishlist = async (productId: string) => {
    if (!token) {
      router.push('/account/login');
      return false;
    }
    try {
      const res = await fetch(`${API_BASE}/wishlist/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        const json = await res.json();
        if (user) {
          const updatedUser = { ...user, wishlist: json.data.wishlist };
          setUser(updatedUser);
          localStorage.setItem('amice_user', JSON.stringify(updatedUser));
        }
        return json.data.isAdded;
      }
    } catch (e) {
      console.warn('Toggle wishlist error', e);
    }
    return false;
  };

  const isProductWishlisted = (productId: string) => {
    if (!user || !user.wishlist) return false;
    return user.wishlist.some((id: any) => (typeof id === 'string' ? id === productId : id?._id === productId));
  };

  const refreshUser = async () => {
    if (token) await fetchMe(token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        toggleWishlist,
        isProductWishlisted,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
