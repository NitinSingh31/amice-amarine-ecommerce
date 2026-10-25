export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductVariant {
  _id: string;
  sku: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'FREE_SIZE';
  color: string;
  colorHex?: string;
  stock: number;
  priceAdjustment?: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  subtitle?: string;
  description: string;
  category: Category | string;
  basePrice: number;
  compareAtPrice: number;
  discountPercentage: number;
  images: string[];
  tags: string[];
  specifications: Record<string, string>;
  careInstructions: string[];
  variants: ProductVariant[];
  totalStock: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  storeName: string;
  announcementBar: {
    text: string;
    link: string;
    isActive: boolean;
    backgroundColor: string;
    textColor: string;
  };
  heroBanner: {
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage: string;
  };
  shipping: {
    freeShippingThreshold: number;
    standardShippingFee: number;
    codEnabled: boolean;
    codFee: number;
  };
  socialLinks: {
    instagram?: string;
    discord?: string;
    twitter?: string;
  };
}

export interface CartItem {
  productId: string;
  product: Product;
  variantId: string;
  variant: ProductVariant;
  quantity: number;
}
