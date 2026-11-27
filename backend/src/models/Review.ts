import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedBuyer: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    comment: { type: String, required: true, trim: true, maxlength: 1500 },
    isVerifiedBuyer: { type: Boolean, default: true },
    likes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews by the same user on the same product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

export const Review: Model<IReview> = mongoose.model<IReview>('Review', ReviewSchema);
