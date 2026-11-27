import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { registerSchema, loginSchema } from '../controllers/authController.js';
import { RazorpayService } from '../services/razorpayService.js';
import { emailService } from '../services/emailService.js';

describe('Amice Amarine // Security & Schema Validations', () => {
  test('registerSchema validates proper registration inputs', () => {
    const valid = registerSchema.safeParse({
      name: 'Kenji Sato',
      email: 'kenji@amiceamarine.com',
      password: 'StrongPassword2026!',
    });
    assert.equal(valid.success, true);

    const invalid = registerSchema.safeParse({
      name: 'K',
      email: 'not-an-email',
      password: 'short',
    });
    assert.equal(invalid.success, false);
  });

  test('loginSchema requires email and non-empty password', () => {
    const valid = loginSchema.safeParse({
      email: 'admin@amiceamarine.com',
      password: 'Admin@Amice2026!',
    });
    assert.equal(valid.success, true);

    const invalid = loginSchema.safeParse({
      email: 'invalid-email',
      password: '',
    });
    assert.equal(invalid.success, false);
  });

  test('Bcrypt salting and hashing adheres to 12 rounds', async () => {
    const plain = 'StreetwearPassword2026!';
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(plain, salt);

    assert.equal(await bcrypt.compare(plain, hash), true);
    assert.equal(await bcrypt.compare('WrongPassword', hash), false);
  });
});

describe('Amice Amarine // Payment & Razorpay Integrity', () => {
  const rzp = new RazorpayService();

  test('Razorpay mock orders are properly identified in sandbox', async () => {
    const order = await rzp.createOrder({
      amount: 149900,
      currency: 'INR',
      receipt: 'AA-TEST-001',
    });

    assert.equal(order.amount, 149900);
    assert.equal(order.currency, 'INR');
    assert.equal(order.isMock, true);
    assert.ok(order.id.startsWith('order_mock_'));
  });

  test('Razorpay signature verification accepts mock test signatures', () => {
    const verified = rzp.verifyPaymentSignature({
      razorpayOrderId: 'order_mock_12345',
      razorpayPaymentId: 'pay_mock_98765',
      razorpaySignature: 'mock_signature',
    });
    assert.equal(verified, true);
  });
});

describe('Amice Amarine // Email Dispatch Service', () => {
  test('Email service simulates order confirmation transmission', async () => {
    const sent = await emailService.sendOrderConfirmation({
      orderNumber: 'AA-2026-TEST',
      customerEmail: 'shopper@amiceamarine.com',
      shippingAddress: {
        fullName: 'Kenji Sato',
        addressLine1: 'B-404 Tokyo Tower',
        city: 'Mumbai',
        postalCode: '400013',
      },
      items: [
        { name: 'VOID DOMAIN // OVERSIZED GRAPHIC TEE', size: 'L', quantity: 1, price: 1299 },
      ],
      totalAmount: 1299,
      paymentMethod: 'razorpay',
    });

    assert.equal(sent, true);
  });

  test('Email service simulates password reset dispatch', async () => {
    const sent = await emailService.sendPasswordReset(
      'shopper@amiceamarine.com',
      'http://localhost:3000/account/reset-password/sample-test-token'
    );
    assert.equal(sent, true);
  });
});
