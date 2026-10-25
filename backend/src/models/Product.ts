import mongoose, { Document, Schema, Model } from 'mongoose';
import { ProductSize, PRODUCT_SIZES, ProductStatus, PRODUCT_STATUS } from '../config/constants.js';

export interface IProductVariant {
  _id?: mongoose.Types.ObjectId;
  sku: string;
  size: ProductSize;
  color: string;
  colorHex?: string;
  stock: number;
  priceAdjustment?: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  subtitle?: string;
  description: string;
  category: mongoose.Types.ObjectId;
  basePrice: number;
  compareAtPrice: number;
  discountPercentage: number;
  images: string[];
  tags: string[];
  specifications: Record<string, string>;
  careInstructions: string[];
  variants: IProductVariant[];
  totalStock: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>({
  sku: { type: String, required: true, trim: true },
  size: { type: String, enum: PRODUCT_SIZES, required: true },
  color: { type: String, required: true, default: 'Black' },
  colorHex: { type: String, default: '#101012' },
  stock: { type: Number, required: true, min: 0, default: 0 },
  priceAdjustment: { type: Number, default: 0 },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    subtitle: { type: String, trim: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    basePrice: { type: Number, required: true, min: 0, index: true },
    compareAtPrice: { type: Number, required: true, min: 0 },
    discountPercentage: { type: Number, default: 0 },
    images: [{ type: String, required: true }],
    tags: [{ type: String, trim: true, index: true }],
    specifications: { type: Map, of: String, default: {} },
    careInstructions: [{ type: String }],
    variants: [ProductVariantSchema],
    totalStock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false, index: true },
    isBestseller: { type: Boolean, default: false, index: true },
    isNewArrival: { type: Boolean, default: true, index: true },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.PUBLISHED,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-calculate discountPercentage and totalStock before saving
ProductSchema.pre<IProduct>('save', function (next) {
  if (this.compareAtPrice > this.basePrice) {
    this.discountPercentage = Math.round(((this.compareAtPrice - this.basePrice) / this.compareAtPrice) * 100);
  } else {
    this.discountPercentage = 0;
  }

  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
  }

  next();
});

// Full-text search index for anime streetwear searches
ProductSchema.index({ name: 'text', subtitle: 'text', description: 'text', tags: 'text' });

export const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);
