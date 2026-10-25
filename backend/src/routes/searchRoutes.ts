import { Router } from 'express';
import { getSearchSuggestions, searchProducts } from '../controllers/searchController.js';

const router = Router();

router.get('/suggestions', getSearchSuggestions);
router.get('/', searchProducts);

export default router;
