import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { User } from '../models/User.js';
import { Coupon } from '../models/Coupon.js';
import { StoreSettings } from '../models/StoreSettings.js';
import { AppError } from '../utils/AppError.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ORDER_STATUS } from '../config/constants.js';

export async function getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ paymentStatus: 'paid' });
    const grossRevenue = paidOrders.reduce((sum, ord) => sum + ord.totalAmount, 0);
    const averageOrderValue = paidOrders.length > 0 ? Math.round(grossRevenue / paidOrders.length) : 0;
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Status breakdown
    const placedCount = await Order.countDocuments({ fulfillmentStatus: 'order_placed' });
    const paymentConfirmedCount = await Order.countDocuments({ fulfillmentStatus: 'payment_confirmed' });
    const packedCount = await Order.countDocuments({ fulfillmentStatus: 'packed' });
    const shippedCount = await Order.countDocuments({ fulfillmentStatus: 'shipped' });
    const deliveredCount = await Order.countDocuments({ fulfillmentStatus: 'delivered' });
    const cancelledCount = await Order.countDocuments({ fulfillmentStatus: 'cancelled' });

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select('orderNumber customerEmail totalAmount paymentMethod paymentStatus fulfillmentStatus createdAt items');

    // Low stock variants (stock <= 5)
    const allProducts = await Product.find({ status: 'published' }).select('name slug variants images');
    const lowStockVariants: any[] = [];
    for (const prod of allProducts) {
      for (const variant of prod.variants) {
        if (variant.stock <= 5) {
          lowStockVariants.push({
            productId: prod._id,
            productName: prod.name,
            size: variant.size,
            color: variant.color,
            sku: variant.sku,
            stock: variant.stock,
            image: prod.images[0],
          });
        }
      }
    }

    sendSuccess(res, {
      kpi: {
        grossRevenue,
        totalOrders,
        averageOrderValue,
        totalProducts,
        totalCustomers,
        lowStockCount: lowStockVariants.length,
      },
      statusDistribution: {
        placed: placedCount,
        paymentConfirmed: paymentConfirmedCount,
        packed: packedCount,
        shipped: shippedCount,
        delivered: deliveredCount,
        cancelled: cancelledCount,
      },
      recentOrders,
      lowStockVariants: lowStockVariants.slice(0, 10),
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, status, search } = req.query;
    const query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (search && typeof search === 'string') {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    const formatted = products.map((prod) => {
      const totalStock = prod.variants.reduce((sum, v) => sum + v.stock, 0);
      return {
        _id: prod._id,
        name: prod.name,
        slug: prod.slug,
        basePrice: prod.basePrice,
        compareAtPrice: prod.compareAtPrice,
        category: prod.category,
        tags: prod.tags,
        fit: (prod as any).fit || 'Oversized Boxy Fit',
        images: prod.images,
        status: prod.status,
        variantsCount: prod.variants.length,
        totalStock,
        variants: prod.variants,
        createdAt: prod.createdAt,
      };
    });

    sendSuccess(res, { count: formatted.length, products: formatted });
  } catch (error) {
    next(error);
  }
}

export async function createAdminProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      name,
      slug,
      description,
      basePrice,
      compareAtPrice,
      category = 'oversized-t-shirts',
      tags = [],
      fit = 'Oversized Boxy Fit',
      fabric = '280 GSM 100% Super-Combed French Terry Cotton',
      images,
      variants,
      status = 'published',
    } = req.body;

    if (!name || !basePrice || !images || images.length === 0) {
      throw new AppError('Product name, base price, and at least one image are required.', 400, 'MISSING_FIELDS');
    }

    
    let resolvedCategory = category;
    if (category && typeof category === 'string' && !mongoose.Types.ObjectId.isValid(category)) {
      const catDoc = await Category.findOne({ slug: category.trim().toLowerCase() });
      if (catDoc) {
        resolvedCategory = catDoc._id;
      } else {
        const anyCat = await Category.findOne();
        if (anyCat) resolvedCategory = anyCat._id;
      }
    }

    const autoSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existingSlug = await Product.findOne({ slug: autoSlug });
    if (existingSlug) {
      throw new AppError(`A product with slug '${autoSlug}' already exists.`, 409, 'SLUG_CONFLICT');
    }

    // Default variants if not provided
    const finalVariants = variants && variants.length > 0 ? variants : [
      { size: 'S', color: 'Obsidian Black', sku: `AA-${autoSlug.substring(0, 6).toUpperCase()}-S`, stock: 15 },
      { size: 'M', color: 'Obsidian Black', sku: `AA-${autoSlug.substring(0, 6).toUpperCase()}-M`, stock: 25 },
      { size: 'L', color: 'Obsidian Black', sku: `AA-${autoSlug.substring(0, 6).toUpperCase()}-L`, stock: 30 },
      { size: 'XL', color: 'Obsidian Black', sku: `AA-${autoSlug.substring(0, 6).toUpperCase()}-XL`, stock: 20 },
      { size: 'XXL', color: 'Obsidian Black', sku: `AA-${autoSlug.substring(0, 6).toUpperCase()}-XXL`, stock: 10 },
    ];

    const product = await Product.create({
      name,
      slug: autoSlug,
      description: description || 'Premium heavy knit anime streetwear drop designed for maximum comfort and silhouette.',
      basePrice: Number(basePrice),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      category: resolvedCategory,
      tags: Array.isArray(tags) ? tags : [tags],
      fit,
      fabric,
      images,
      variants: finalVariants,
      status,
      isFeatured: true,
      isNewArrival: true,
    });

    sendSuccess(res, { product }, 'Product created successfully in syndicate catalog.', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateAdminProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!product) {
      throw new AppError(`Product '${id}' not found.`, 404, 'PRODUCT_NOT_FOUND');
    }

    sendSuccess(res, { product }, 'Product updated successfully.');
  } catch (error) {
    next(error);
  }
}

export async function deleteAdminProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new AppError(`Product '${id}' not found.`, 404, 'PRODUCT_NOT_FOUND');
    }

    sendSuccess(res, { id }, 'Product removed from catalog.');
  } catch (error) {
    next(error);
  }
}

export async function getAdminOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, search } = req.query;
    const query: any = {};

    if (status && status !== 'all') {
      query.fulfillmentStatus = status;
    }

    if (search && typeof search === 'string') {
      query.$or = [
        { orderNumber: { $regex: search.trim(), $options: 'i' } },
        { customerEmail: { $regex: search.trim(), $options: 'i' } },
        { customerPhone: { $regex: search.trim(), $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    sendSuccess(res, { count: orders.length, orders });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminOrderStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderNumber } = req.params;
    const { status, courierName, trackingNumber, note } = req.body;

    if (!status) {
      throw new AppError('Status is required for fulfillment update.', 400, 'MISSING_STATUS');
    }

    const order = await Order.findOne({
      orderNumber: { $regex: new RegExp(`^${String(orderNumber).trim()}$`, 'i') },
    });

    if (!order) {
      throw new AppError(`Order '${orderNumber}' not found.`, 404, 'ORDER_NOT_FOUND');
    }

    order.fulfillmentStatus = status;
    if (courierName) order.courierName = courierName;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order status updated to ${status} by administrator.`,
      updatedBy: req.user?.email || 'admin',
    });

    await order.save();

    sendSuccess(res, { order }, `Order ${order.orderNumber} status updated to ${status}.`);
  } catch (error) {
    next(error);
  }
}

export async function getAdminCoupons(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    sendSuccess(res, { count: coupons.length, coupons });
  } catch (error) {
    next(error);
  }
}

export async function createAdminCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      code,
      description,
      discountType = 'percentage',
      discountValue,
      minCartValue = 0,
      maxDiscountAmount,
      usageLimit,
      expiryDate,
    } = req.body;

    if (!code || !discountValue) {
      throw new AppError('Coupon code and discount value are required.', 400, 'MISSING_FIELDS');
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      throw new AppError(`Coupon '${cleanCode}' already exists.`, 409, 'COUPON_EXISTS');
    }

    const expiry = expiryDate ? new Date(expiryDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    const coupon = await Coupon.create({
      code: cleanCode,
      description: description || `Special ${cleanCode} promotion`,
      discountType,
      discountValue: Number(discountValue),
      minCartValue: Number(minCartValue),
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      expiryDate: expiry,
      isActive: true,
    });

    sendSuccess(res, { coupon }, 'Coupon created successfully.', 201);
  } catch (error) {
    next(error);
  }
}

export async function deleteAdminCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      throw new AppError(`Coupon '${id}' not found.`, 404, 'COUPON_NOT_FOUND');
    }
    sendSuccess(res, { id }, 'Coupon removed successfully.');
  } catch (error) {
    next(error);
  }
}

export async function getAdminSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({
        storeName: 'Amice Amarine',
        supportEmail: 'syndicate@amiceamarine.com',
        supportPhone: '+91 91234 56789',
        currency: 'INR',
        shipping: {
          freeShippingThreshold: 999,
          standardShippingFee: 99,
          codFee: 50,
          codEnabled: true,
        },
        banner: {
          text: '🚨 EXCLUSIVE DROP: FLAT 15% OFF ON PREPAID ORDERS | FREE SHIPPING OVER ₹999',
          link: '/collections/all-products',
          isActive: true,
        },
      });
    }
    sendSuccess(res, { settings });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = new StoreSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();

    sendSuccess(res, { settings }, 'Store settings updated successfully.');
  } catch (error) {
    next(error);
  }
}
