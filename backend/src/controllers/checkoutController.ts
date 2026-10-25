import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product.js';
import { Order, IOrderItem } from '../models/Order.js';
import { Coupon } from '../models/Coupon.js';
import { StoreSettings } from '../models/StoreSettings.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { AppError } from '../utils/AppError.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import mongoose from 'mongoose';

interface CheckoutItemInput {
  productId: string;
  variantId: string;
  quantity: number;
}

export async function getCheckoutQuote(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { items, couponCode, paymentMethod = 'razorpay' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AppError('Cart items are required for checkout calculation', 400, 'EMPTY_CART');
    }

    const settings = (await StoreSettings.findOne()) || {
      shipping: { freeShippingThreshold: 999, standardShippingFee: 99, codFee: 50 },
    };

    let subtotal = 0;
    const validatedItems: any[] = [];

    for (const itm of items as CheckoutItemInput[]) {
      if (!mongoose.Types.ObjectId.isValid(itm.productId)) {
        throw new AppError(`Invalid product ID format ${itm.productId}`, 400, 'INVALID_ID');
      }

      const product = await Product.findById(itm.productId);
      if (!product || product.status !== 'published') {
        throw new AppError(`Product '${itm.productId}' is not available`, 404, 'PRODUCT_UNAVAILABLE');
      }

      const variant = product.variants.find((v: any) => v._id.toString() === itm.variantId);
      if (!variant) {
        throw new AppError(`Variant '${itm.variantId}' not found for product ${product.name}`, 404, 'VARIANT_NOT_FOUND');
      }

      const requestedQty = Math.max(1, Number(itm.quantity) || 1);
      const isAvailable = variant.stock >= requestedQty;

      const itemTotal = product.basePrice * requestedQty;
      subtotal += itemTotal;

      validatedItems.push({
        productId: product._id,
        variantId: variant._id,
        name: product.name,
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
        image: product.images[0],
        price: product.basePrice,
        quantity: requestedQty,
        total: itemTotal,
        inStock: isAvailable,
        availableStock: variant.stock,
      });
    }

    // Coupon discount calculation
    let discountAmount = 0;
    let appliedCoupon: any = null;

    if (couponCode && typeof couponCode === 'string') {
      const cleanCode = couponCode.trim().toUpperCase();
      const coupon = await Coupon.findOne({
        code: cleanCode,
        isActive: true,
        startDate: { $lte: new Date() },
        expiryDate: { $gte: new Date() },
      });

      if (coupon && subtotal >= coupon.minCartValue) {
        if (coupon.discountType === 'percentage') {
          discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
            discountAmount = coupon.maxDiscountAmount;
          }
        } else {
          discountAmount = Math.min(coupon.discountValue, subtotal);
        }
        appliedCoupon = { code: coupon.code, discountAmount };
      }
    }

    // Shipping calculation
    const shippingFee = subtotal >= settings.shipping.freeShippingThreshold ? 0 : settings.shipping.standardShippingFee;

    // Prepaid bonus discount (10% on online orders) or COD fee
    let prepaidDiscount = 0;
    let codFee = 0;

    if (paymentMethod === 'cod') {
      codFee = settings.shipping.codFee || 50;
    } else {
      prepaidDiscount = Math.round((subtotal - discountAmount) * 0.1);
    }

    const totalAmount = Math.max(0, subtotal - discountAmount - prepaidDiscount + shippingFee + codFee);

    sendSuccess(res, {
      items: validatedItems,
      subtotal,
      discountAmount,
      prepaidDiscount,
      shippingFee,
      codFee,
      totalAmount,
      appliedCoupon,
      freeShippingThreshold: settings.shipping.freeShippingThreshold,
    });
  } catch (error) {
    next(error);
  }
}

export async function createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      items,
      shippingAddress,
      customerEmail,
      customerPhone,
      couponCode,
      paymentMethod = 'cod',
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AppError('Cannot place an order with empty cart items.', 400, 'EMPTY_CART');
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.postalCode) {
      throw new AppError('Complete shipping address is required.', 400, 'MISSING_ADDRESS');
    }

    const settings = (await StoreSettings.findOne()) || {
      shipping: { freeShippingThreshold: 999, standardShippingFee: 99, codFee: 50 },
    };

    let subtotal = 0;
    const orderItems: IOrderItem[] = [];

    // Atomic Stock Check & Decrement
    for (const itm of items as CheckoutItemInput[]) {
      const product = await Product.findById(itm.productId);
      if (!product || product.status !== 'published') {
        throw new AppError(`Product '${itm.productId}' is unavailable.`, 400, 'PRODUCT_UNAVAILABLE');
      }

      const variant = product.variants.find((v: any) => v._id.toString() === itm.variantId);
      if (!variant) {
        throw new AppError(`Variant '${itm.variantId}' not found.`, 404, 'VARIANT_NOT_FOUND');
      }

      const qty = Math.max(1, Number(itm.quantity) || 1);

      const updateResult = await Product.updateOne(
        {
          _id: product._id,
          'variants._id': variant._id,
          'variants.stock': { $gte: qty },
        },
        {
          $inc: { 'variants.$.stock': -qty },
        }
      );

      if (updateResult.modifiedCount === 0) {
        throw new AppError(
          `Insufficient stock for ${product.name} (Size: ${variant.size}). Only ${variant.stock} left.`,
          409,
          'OUT_OF_STOCK'
        );
      }

      const itemTotal = product.basePrice * qty;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id as any,
        variantId: variant._id as any,
        productName: product.name,
        variantTitle: `Size: ${variant.size} / Color: ${variant.color}`,
        sku: variant.sku,
        image: product.images[0],
        unitPrice: product.basePrice,
        quantity: qty,
        totalPrice: itemTotal,
      });
    }

    let discountAmount = 0;
    if (couponCode && typeof couponCode === 'string') {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true,
        startDate: { $lte: new Date() },
        expiryDate: { $gte: new Date() },
      });

      if (coupon && subtotal >= coupon.minCartValue) {
        if (coupon.discountType === 'percentage') {
          discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
            discountAmount = coupon.maxDiscountAmount;
          }
        } else {
          discountAmount = Math.min(coupon.discountValue, subtotal);
        }
        await Coupon.updateOne({ _id: coupon._id }, { $inc: { usedCount: 1 } });
      }
    }

    const shippingFee = subtotal >= settings.shipping.freeShippingThreshold ? 0 : settings.shipping.standardShippingFee;
    const prepaidDiscount = paymentMethod !== 'cod' ? Math.round((subtotal - discountAmount) * 0.1) : 0;
    const codFee = paymentMethod === 'cod' ? settings.shipping.codFee || 50 : 0;
    const totalAmount = Math.max(0, subtotal - discountAmount - prepaidDiscount + shippingFee + codFee);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AA-2026-${randomSuffix}`;

    const order = await Order.create({
      orderNumber,
      user: req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : undefined,
      customerEmail: customerEmail || req.user?.email || 'customer@amiceamarine.com',
      customerPhone: customerPhone || shippingAddress.phone,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'India',
      },
      items: orderItems,
      subtotal,
      discountAmount: discountAmount + prepaidDiscount,
      couponCode,
      shippingFee,
      taxAmount: 0,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      fulfillmentStatus: 'order_placed',
      statusHistory: [
        {
          status: 'order_placed',
          timestamp: new Date(),
          note: `Order created via ${paymentMethod.toUpperCase()}.`,
        },
      ],
    });

    sendSuccess(
      res,
      {
        order,
        orderNumber: order.orderNumber,
      },
      'Order placed successfully. Welcome to the syndicate!',
      201
    );
  } catch (error) {
    next(error);
  }
}
