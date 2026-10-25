import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order.js';
import { razorpayService } from '../services/razorpayService.js';
import { AppError } from '../utils/AppError.js';
import { sendSuccess } from '../utils/responseHandler.js';
import { ORDER_STATUS, PAYMENT_STATUS } from '../config/constants.js';

export async function createRazorpayOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderNumber } = req.body;

    if (!orderNumber) {
      throw new AppError('Order number is required to initiate payment.', 400, 'MISSING_ORDER_NUMBER');
    }

    const order = await Order.findOne({ orderNumber });
    if (!order) {
      throw new AppError(`Order '${orderNumber}' not found.`, 404, 'ORDER_NOT_FOUND');
    }

    if (order.paymentStatus === PAYMENT_STATUS.PAID) {
      throw new AppError('This order has already been paid for.', 400, 'ORDER_ALREADY_PAID');
    }

    // Razorpay amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(order.totalAmount * 100);

    const rzpOrder = await razorpayService.createOrder({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
      },
    });

    // Update order with razorpayOrderId
    order.paymentDetails = {
      ...order.paymentDetails,
      razorpayOrderId: rzpOrder.id,
    };
    await order.save();

    sendSuccess(res, {
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: razorpayService.getKeyId(),
      orderNumber: order.orderNumber,
      isMock: rzpOrder.isMock,
      customer: {
        name: order.shippingAddress.fullName,
        email: order.customerEmail,
        phone: order.customerPhone,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderNumber || !razorpayOrderId || !razorpayPaymentId) {
      throw new AppError('Incomplete payment verification payload.', 400, 'INVALID_PAYMENT_PAYLOAD');
    }

    const order = await Order.findOne({ orderNumber });
    if (!order) {
      throw new AppError(`Order '${orderNumber}' not found.`, 404, 'ORDER_NOT_FOUND');
    }

    const isValid = razorpayService.verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature: razorpaySignature || 'mock_signature',
    });

    if (!isValid) {
      order.paymentStatus = PAYMENT_STATUS.FAILED;
      order.statusHistory.push({
        status: order.fulfillmentStatus,
        timestamp: new Date(),
        note: `Payment verification failed for payment ID ${razorpayPaymentId}.`,
        updatedBy: 'razorpay_gateway',
      });
      await order.save();
      throw new AppError('Payment signature verification failed. Transaction rejected.', 400, 'PAYMENT_VERIFICATION_FAILED');
    }

    // Update order to paid & payment confirmed
    order.paymentStatus = PAYMENT_STATUS.PAID;
    order.fulfillmentStatus = ORDER_STATUS.PAYMENT_CONFIRMED;
    order.paymentDetails = {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    };
    order.statusHistory.push({
      status: ORDER_STATUS.PAYMENT_CONFIRMED,
      timestamp: new Date(),
      note: `Payment verified successfully via Razorpay (Txn ID: ${razorpayPaymentId}).`,
      updatedBy: 'razorpay_gateway',
    });

    await order.save();

    sendSuccess(res, {
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      paymentId: razorpayPaymentId,
    }, 'Payment verified successfully. Welcome to the Amice syndicate.');
  } catch (error) {
    next(error);
  }
}

export async function handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const bodyString = JSON.stringify(req.body);

    if (signature) {
      const isValid = razorpayService.verifyWebhookSignature(bodyString, signature);
      if (!isValid) {
        throw new AppError('Invalid webhook signature.', 400, 'INVALID_WEBHOOK_SIGNATURE');
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured' || event === 'order.paid') {
      const rzpOrderId = payload.payment?.entity?.order_id || payload.order?.entity?.id;
      if (rzpOrderId) {
        const order = await Order.findOne({ 'paymentDetails.razorpayOrderId': rzpOrderId });
        if (order && order.paymentStatus !== PAYMENT_STATUS.PAID) {
          order.paymentStatus = PAYMENT_STATUS.PAID;
          order.fulfillmentStatus = ORDER_STATUS.PAYMENT_CONFIRMED;
          order.statusHistory.push({
            status: ORDER_STATUS.PAYMENT_CONFIRMED,
            timestamp: new Date(),
            note: 'Payment captured asynchronously via Razorpay webhook.',
            updatedBy: 'razorpay_webhook',
          });
          await order.save();
        }
      }
    }

    sendSuccess(res, { received: true });
  } catch (error) {
    next(error);
  }
}
