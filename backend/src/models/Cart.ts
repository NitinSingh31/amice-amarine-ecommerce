import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  variantId: mongoose.Types.ObjectId;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface ICart extends Document {
  user?: mongoose.Types.ObjectId;
  guestSessionId?: string;
  items: ICartItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  size: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
});

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    guestSessionId: { type: String, index: true },
    items: [CartItemSchema],
    subtotal: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String },
    total: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Cart: Model<ICart> = mongoose.model<ICart>('Cart', CartSchema);
