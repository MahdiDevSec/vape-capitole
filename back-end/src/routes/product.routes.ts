import { Router } from 'express';
import { getProducts, getProductById, getProductsByCategory, createProduct, updateProduct } from '../controllers/product.controller';

const router = Router();

// Get all products
router.get('/', getProducts);

// Get product by ID
router.get('/:id', getProductById);

// Get products by category
router.get('/category/:category', getProductsByCategory);

// إضافة منتج جديد
router.post('/', createProduct);

// تعديل منتج
router.put('/:id', updateProduct);

export default router; 