import { Router } from 'express';
import { getCheckoutQuote, createOrder } from '../controllers/checkoutController.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = Router();

router.post('/quote', getCheckoutQuote);
router.post('/create-order', optionalAuthenticate, createOrder);

export default router;
