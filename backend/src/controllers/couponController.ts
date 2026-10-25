import { Request, Response, NextFunction } from 'express';
import { Coupon } from '../models/Coupon.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { AppError } from '../utils/AppError.js';

export async function validateCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { code, subtotal } = req.body;

    if (!code || typeof code !== 'string') {
      throw new AppError('Promo code is required', 400, 'VALIDATION_ERROR');
    }

    const cleanCode = code.trim().toUpperCase();
    const cartSubtotal = Number(subtotal) || 0;

    const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });

    if (!coupon) {
      throw new AppError(`Coupon code '${cleanCode}' is invalid or expired.`, 404, 'COUPON_NOT_FOUND');
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.expiryDate) {
      throw new AppError(`Coupon '${cleanCode}' has expired or is not yet active.`, 400, 'COUPON_EXPIRED');
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new AppError(`Coupon '${cleanCode}' usage limit has been reached.`, 400, 'COUPON_LIMIT_REACHED');
    }

    if (cartSubtotal < coupon.minCartValue) {
      throw new AppError(
        `Coupon requires a minimum order value of ₹${coupon.minCartValue}.`,
        400,
        'MIN_CART_VALUE_NOT_MET'
      );
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, cartSubtotal);
    }

    sendSuccess(
      res,
      {
        valid: true,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        minCartValue: coupon.minCartValue,
      },
      `Coupon '${cleanCode}' applied successfully! Saved ₹${discountAmount}.`
    );
  } catch (error) {
    next(error);
  }
}

export async function getActiveCoupons(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      startDate: { $lte: now },
      expiryDate: { $gte: now },
    }).select('code description discountType discountValue minCartValue');

    sendSuccess(res, { coupons });
  } catch (error) {
    next(error);
  }
}
