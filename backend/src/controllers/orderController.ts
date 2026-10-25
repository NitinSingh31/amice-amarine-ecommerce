import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { AppError } from '../utils/AppError.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ORDER_STATUS } from '../config/constants.js';

export async function trackOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderNumber } = req.params;
    const { phone, email } = req.query;

    if (!orderNumber) {
      throw new AppError('Order number is required for tracking.', 400, 'MISSING_ORDER_NUMBER');
    }

    const order = await Order.findOne({
      orderNumber: { $regex: new RegExp(`^${orderNumber.trim()}$`, 'i') },
    });

    if (!order) {
      throw new AppError(`Order '${orderNumber}' not found. Please verify your order ID.`, 404, 'ORDER_NOT_FOUND');
    }

    // If verification phone or email provided, check match
    if (phone && typeof phone === 'string') {
      const cleanPhone = phone.replace(/\D/g, '');
      const orderPhone = order.customerPhone.replace(/\D/g, '');
      if (!orderPhone.includes(cleanPhone) && !cleanPhone.includes(orderPhone)) {
        throw new AppError('Phone number does not match this order record.', 403, 'VERIFICATION_FAILED');
      }
    }

    if (email && typeof email === 'string') {
      if (order.customerEmail.toLowerCase() !== email.trim().toLowerCase()) {
        throw new AppError('Email does not match this order record.', 403, 'VERIFICATION_FAILED');
      }
    }

    // Dynamic courier assignment if not set
    const courierPartner = order.courierName || 'Delhivery Express';
    const trackingAwb = order.trackingNumber || `DEL-${order.orderNumber.replace(/[^0-9]/g, '')}-EXP`;

    // Calculate delivery stages and milestones
    const createdAt = new Date(order.createdAt);
    const estDeliveryDate = new Date(createdAt);
    estDeliveryDate.setDate(estDeliveryDate.getDate() + 4);

    const stages = [
      {
        id: 'order_placed',
        title: 'ORDER PLACED',
        description: 'Order details and items logged in syndicate database.',
        isCompleted: true,
        timestamp: order.createdAt,
      },
      {
        id: 'payment_confirmed',
        title: 'PAYMENT VERIFIED',
        description: order.paymentMethod === 'cod' ? 'Cash on Delivery verified at checkout.' : 'Online transaction verified by payment gateway.',
        isCompleted: ['payment_confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'].includes(order.fulfillmentStatus) || order.paymentStatus === 'paid',
        timestamp: order.paymentStatus === 'paid' ? order.updatedAt : null,
      },
      {
        id: 'packed',
        title: 'PACKED & QUALITY CHECKED',
        description: 'Garments inspected, custom tags attached, and waterproof sealed.',
        isCompleted: ['processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'].includes(order.fulfillmentStatus),
        timestamp: null,
      },
      {
        id: 'shipped',
        title: 'DISPATCHED IN TRANSIT',
        description: `Handed over to ${courierPartner} (AWB: ${trackingAwb}).`,
        isCompleted: ['shipped', 'out_for_delivery', 'delivered'].includes(order.fulfillmentStatus),
        timestamp: null,
      },
      {
        id: 'out_for_delivery',
        title: 'OUT FOR DELIVERY',
        description: 'Rider assigned for same-day delivery attempt.',
        isCompleted: ['out_for_delivery', 'delivered'].includes(order.fulfillmentStatus),
        timestamp: null,
      },
      {
        id: 'delivered',
        title: 'DELIVERED',
        description: 'Package delivered to recipient.',
        isCompleted: order.fulfillmentStatus === 'delivered',
        timestamp: null,
      },
    ];

    sendSuccess(res, {
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      status: order.fulfillmentStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      courierPartner,
      trackingAwb,
      estimatedDelivery: estDeliveryDate,
      shippingAddress: order.shippingAddress,
      items: order.items,
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      shippingFee: order.shippingFee,
      totalAmount: order.totalAmount,
      couponCode: order.couponCode,
      statusHistory: order.statusHistory,
      stages,
      isCancellable: ['order_placed', 'payment_confirmed'].includes(order.fulfillmentStatus),
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    const query: any = {};
    if (userId && userEmail) {
      query.$or = [{ user: userId }, { customerEmail: userEmail }];
    } else if (userId) {
      query.user = userId;
    } else if (userEmail) {
      query.customerEmail = userEmail;
    } else {
      throw new AppError('Authentication required to view order history.', 401, 'UNAUTHORIZED');
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    sendSuccess(res, {
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrderByNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({
      orderNumber: { $regex: new RegExp(`^${orderNumber.trim()}$`, 'i') },
    });

    if (!order) {
      throw new AppError(`Order '${orderNumber}' not found.`, 404, 'ORDER_NOT_FOUND');
    }

    sendSuccess(res, { order });
  } catch (error) {
    next(error);
  }
}

export async function cancelOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderNumber } = req.params;
    const { reason = 'Cancelled by customer' } = req.body;

    const order = await Order.findOne({
      orderNumber: { $regex: new RegExp(`^${orderNumber.trim()}$`, 'i') },
    });

    if (!order) {
      throw new AppError(`Order '${orderNumber}' not found.`, 404, 'ORDER_NOT_FOUND');
    }

    if (!['order_placed', 'payment_confirmed'].includes(order.fulfillmentStatus)) {
      throw new AppError(
        `Order cannot be cancelled in '${order.fulfillmentStatus}' state. Package is already packed or shipped.`,
        400,
        'CANNOT_CANCEL_ORDER'
      );
    }

    // Atomically restore variant stock
    for (const item of order.items) {
      await Product.updateOne(
        {
          _id: item.productId,
          'variants._id': item.variantId,
        },
        {
          $inc: { 'variants.$.stock': item.quantity },
        }
      );
    }

    order.fulfillmentStatus = ORDER_STATUS.CANCELLED;
    order.statusHistory.push({
      status: ORDER_STATUS.CANCELLED,
      timestamp: new Date(),
      note: `Order cancelled. Reason: ${reason}. Inventory restored.`,
      updatedBy: req.user?.email || 'customer',
    });

    await order.save();

    sendSuccess(res, { order }, 'Order cancelled successfully. Items restored to stock.');
  } catch (error) {
    next(error);
  }
}

export async function getOrderInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({
      orderNumber: { $regex: new RegExp(`^${orderNumber.trim()}$`, 'i') },
    });

    if (!order) {
      throw new AppError(`Order '${orderNumber}' not found.`, 404, 'ORDER_NOT_FOUND');
    }

    // GST & Invoice Calculations
    const taxableAmount = Math.round((order.totalAmount / 1.05) * 100) / 100;
    const totalGst = Math.round((order.totalAmount - taxableAmount) * 100) / 100;
    const cgst = Math.round((totalGst / 2) * 100) / 100;
    const sgst = cgst;

    const invoiceData = {
      invoiceNumber: `INV-${order.orderNumber.replace(/[^0-9]/g, '')}`,
      invoiceDate: order.createdAt,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      seller: {
        legalName: 'Amice Amarine Apparel Private Limited',
        brandName: 'AMICE AMARINE // ANIME STREETWEAR',
        gstin: '27AABCA1234F1Z5',
        hsnCode: '61091000', // T-shirts and apparel knitted
        registeredAddress: 'Plot 42, Neon Sector, Shibuya Tech District, Mumbai, MH, 400001, India',
        supportEmail: 'syndicate@amiceamarine.com',
        contactPhone: '+91 91234 56789',
      },
      customer: {
        name: order.shippingAddress.fullName,
        email: order.customerEmail,
        phone: order.customerPhone,
        address: order.shippingAddress,
      },
      items: order.items.map((itm, idx) => ({
        srNo: idx + 1,
        name: itm.productName,
        variant: itm.variantTitle,
        sku: itm.sku,
        hsn: '61091000',
        qty: itm.quantity,
        rate: itm.unitPrice,
        amount: itm.totalPrice,
      })),
      pricing: {
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        shippingFee: order.shippingFee,
        taxableAmount,
        cgstRate: '2.5%',
        cgstAmount: cgst,
        sgstRate: '2.5%',
        sgstAmount: sgst,
        totalGst,
        totalAmount: order.totalAmount,
      },
      payment: {
        method: order.paymentMethod,
        status: order.paymentStatus,
        transactionId: order.paymentDetails?.razorpayPaymentId || 'N/A (COD)',
      },
    };

    sendSuccess(res, { invoice: invoiceData });
  } catch (error) {
    next(error);
  }
}
