const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `API error on ${endpoint}: ${res.statusText}`);
    }

    const json = await res.json();
    return json.data;
  } catch (err: any) {
    console.warn(`[API Warning] Request to ${endpoint} failed: ${err.message}. Using fallback.`);
    throw err;
  }
}

export async function getPublicSettings() {
  try {
    return await fetchFromApi<{ settings: any }>('/settings/public');
  } catch {
    return {
      settings: {
        storeName: 'Amice Amarine',
        announcementBar: {
          text: '⚡ EXCLUSIVE DROP: FLAT 15% OFF ON PREPAID ORDERS | FREE SHIPPING OVER ₹999',
          link: '/collections/all-products',
          isActive: true,
        },
        heroBanner: {
          headline: 'AMICE AMARINE // ANIME X STREETWEAR',
          subheadline: 'Heavyweight 280 GSM Cotton. Raw Tokyo Cyberpunk Aesthetics. Oversized Precision.',
          ctaText: 'SHOP THE DROP',
          ctaLink: '/collections/all-products',
          backgroundImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600',
        },
        shipping: {
          freeShippingThreshold: 999,
          standardShippingFee: 99,
          codEnabled: true,
          codFee: 50,
        },
      },
    };
  }
}

export async function getCategories() {
  try {
    return await fetchFromApi<{ categories: any[] }>('/categories');
  } catch {
    return {
      categories: [
        { _id: '1', name: 'Oversized T-Shirts', slug: 'oversized-t-shirts', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800' },
        { _id: '2', name: 'Hoodies', slug: 'hoodies', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800' },
        { _id: '3', name: 'Jackets', slug: 'jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800' },
        { _id: '4', name: 'Bottoms', slug: 'bottoms', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800' },
        { _id: '5', name: 'Backpacks', slug: 'backpacks', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800' },
        { _id: '6', name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800' },
      ],
    };
  }
}

export async function getProducts(params?: Record<string, string>) {
  try {
    const query = new URLSearchParams(params).toString();
    return await fetchFromApi<{ products: any[] }>(`/products?${query}`);
  } catch {
    return { products: [] };
  }
}

export async function getFeaturedProducts() {
  try {
    return await fetchFromApi<{ products: any[] }>('/products/featured');
  } catch {
    return { products: [] };
  }
}

export async function getNewArrivals() {
  try {
    return await fetchFromApi<{ products: any[] }>('/products/new-arrivals');
  } catch {
    return { products: [] };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await fetchFromApi<{ product: any; relatedProducts: any[] }>(`/products/${slug}`);
  } catch {
    return {
      product: {
        _id: 'default-preview',
        name: 'VOID DOMAIN // OVERSIZED GRAPHIC TEE',
        slug: slug,
        subtitle: '280 GSM Heavy French Terry / Infinite Void Graphic',
        description: 'Constructed from custom-milled 280 GSM heavyweight combed cotton. Features an oversized boxy drop-shoulder cut with custom high-density puff screen printing inspired by metaphysical domain expansions.',
        category: { name: 'Oversized T-Shirts', slug: 'oversized-t-shirts' },
        basePrice: 1299,
        compareAtPrice: 2999,
        discountPercentage: 57,
        images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800'],
        tags: ['oversized', 'graphic-tee', 'heavyweight-cotton'],
        specifications: { GSM: '280 GSM Luxury French Terry', Fit: 'Boxy Drop Shoulder Oversized Fit' },
        variants: [
          { sku: 'AA-VD-TEE-S', size: 'S', color: 'Black', stock: 10 },
          { sku: 'AA-VD-TEE-M', size: 'M', color: 'Black', stock: 15 },
          { sku: 'AA-VD-TEE-L', size: 'L', color: 'Black', stock: 12 },
          { sku: 'AA-VD-TEE-XL', size: 'XL', color: 'Black', stock: 8 },
        ],
      },
      relatedProducts: [],
    };
  }
}

export async function uploadImage(file: File, folder = 'amice-amarine/products'): Promise<{ secure_url: string; public_id: string }> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  const res = await fetch(`${API_BASE}/upload/image`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Failed to upload image to Cloudinary');
  }

  const json = await res.json();
  return json.data;
}
