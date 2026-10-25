import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minCartValue: number;
  maxDiscountAmount?: number;
  startDate: Date;
  expiryDate: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    description: { type: String },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true, min: 1 },
    minCartValue: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const Coupon: Model<ICoupon> = mongoose.model<ICoupon>('Coupon', CouponSchema);
