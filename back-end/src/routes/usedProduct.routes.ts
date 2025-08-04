import { Router } from 'express';
import {
  getUsedProducts,
  getUsedProduct,
  createUsedProduct,
  updateUsedProduct,
  deleteUsedProduct,
  getUsedProductsStats,
  updateProductStatus
} from '../controllers/usedProduct.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import { validateUsedProduct } from '../middleware/validation.middleware';

const router = Router();

// Public routes
router.get('/', getUsedProducts);
router.get('/:id', getUsedProduct);

// Admin routes
router.post('/', authenticateToken, requireAdmin, validateUsedProduct, createUsedProduct);
router.put('/:id', authenticateToken, requireAdmin, validateUsedProduct, updateUsedProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteUsedProduct);
router.get('/admin/stats', authenticateToken, requireAdmin, getUsedProductsStats);
router.patch('/:id/status', authenticateToken, requireAdmin, updateProductStatus);

export default router;
