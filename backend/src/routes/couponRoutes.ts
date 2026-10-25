import { Router } from 'express';
import { validateCoupon, getActiveCoupons } from '../controllers/couponController.js';

const router = Router();

router.post('/apply', validateCoupon);
router.get('/active', getActiveCoupons);

export default router;
