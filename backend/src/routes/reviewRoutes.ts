import { Router } from 'express';
import { getProductReviews, createReview } from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.post('/', authenticate, createReview);

export default router;
