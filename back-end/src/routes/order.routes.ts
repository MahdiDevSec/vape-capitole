import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { createOrder, getUserOrders, getOrderById } from '../controllers/order.controller';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = Router();

// Create new order
router.post('/', authMiddleware, [
  body('products').isArray().withMessage('Products must be an array'),
  body('products.*.product').isMongoId().withMessage('Invalid product ID'),
  body('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('products.*.price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be positive'),
  body('shippingAddress.street').notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.country').notEmpty().withMessage('Country is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required')
], handleValidationErrors, createOrder);

// Get user orders
router.get('/my-orders', authMiddleware, getUserOrders);

// Get specific order
router.get('/:id', authMiddleware, getOrderById);

export default router; 