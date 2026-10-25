import mongoose from 'mongoose';
import { Coupon } from '../models/Coupon.js';
import { env } from '../config/env.js';

async function seedCoupons() {
  await mongoose.connect(env.MONGODB_URI);
  await Coupon.deleteMany({});

  const now = new Date();
  const future = new Date();
  future.setDate(now.getDate() + 180);

  const coupons = [
    {
      code: 'AMICE15',
      description: 'Flat 15% discount on all orders above ₹999',
      discountType: 'percentage',
      discountValue: 15,
      minCartValue: 999,
      maxDiscountAmount: 500,
      startDate: now,
      expiryDate: future,
      isActive: true,
    },
    {
      code: 'DROP100',
      description: 'Flat ₹100 instant cash discount on orders above ₹1299',
      discountType: 'fixed',
      discountValue: 100,
      minCartValue: 1299,
      startDate: now,
      expiryDate: future,
      isActive: true,
    },
    {
      code: 'OVERSIZED20',
      description: '20% off on premium hauls above ₹1999',
      discountType: 'percentage',
      discountValue: 20,
      minCartValue: 1999,
      maxDiscountAmount: 800,
      startDate: now,
      expiryDate: future,
      isActive: true,
    },
  ];

  await Coupon.insertMany(coupons);
  console.log('✅ Active coupons seeded in MongoDB');
  process.exit(0);
}

seedCoupons();
