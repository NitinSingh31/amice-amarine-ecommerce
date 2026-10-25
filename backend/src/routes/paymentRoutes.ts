import { Router } from 'express';
import { createRazorpayOrder, verifyPayment, handleWebhook } from '../controllers/paymentController.js';

const router = Router();

router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify', verifyPayment);
router.post('/razorpay/webhook', handleWebhook);

export default router;
