import { Router } from 'express';
import { getProducts, getProductById, getProductsByCategory } from '../controllers/product.controller';

const router = Router();

// Get all products
router.get('/', getProducts);

// Get product by ID
router.get('/:id', getProductById);

// Get products by category
router.get('/category/:category', getProductsByCategory);

export default router; 