import { Router } from 'express';
import {
  getAnalytics,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminOrders,
  updateAdminOrderStatus,
  getAdminCoupons,
  createAdminCoupon,
  deleteAdminCoupon,
  getAdminSettings,
  updateAdminSettings,
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Protect all admin routes with authentication & role check
router.use(authenticate, authorize('super_admin', 'manager', 'order_manager'));

// 1. Analytics & Overview
router.get('/analytics', getAnalytics);

// 2. Products Management
router.get('/products', getAdminProducts);
router.post('/products', createAdminProduct);
router.put('/products/:id', updateAdminProduct);
router.delete('/products/:id', deleteAdminProduct);

// 3. Orders & Fulfillment
router.get('/orders', getAdminOrders);
router.put('/orders/:orderNumber/status', updateAdminOrderStatus);

// 4. Coupons Management
router.get('/coupons', getAdminCoupons);
router.post('/coupons', createAdminCoupon);
router.delete('/coupons/:id', deleteAdminCoupon);

// 5. Store Settings
router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);

export default router;
