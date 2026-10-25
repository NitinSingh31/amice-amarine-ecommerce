import { Router } from 'express';
import { trackOrder, getMyOrders, getOrderByNumber, cancelOrder, getOrderInvoice } from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/track/:orderNumber', trackOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/:orderNumber/invoice', getOrderInvoice);
router.get('/:orderNumber', getOrderByNumber);
router.post('/:orderNumber/cancel', authenticate, cancelOrder);

export default router;
