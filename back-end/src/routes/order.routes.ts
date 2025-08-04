import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  createGuestOrder, 
  getAllOrders, 
  updateOrderStatus 
} from '../controllers/order.controller';
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
  body('customerInfo.fullName').notEmpty().withMessage('Full name is required'),
  body('customerInfo.email').isEmail().withMessage('Valid email is required'),
  body('customerInfo.phone').notEmpty().withMessage('Phone is required'),
  body('customerInfo.address').notEmpty().withMessage('Address is required'),
  body('customerInfo.city').notEmpty().withMessage('City is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required')
], handleValidationErrors, createOrder);

// Get user orders
router.get('/my-orders', authMiddleware, getUserOrders);

// Get specific order
router.get('/:id', authMiddleware, getOrderById);

// Create guest order (without authentication)
router.post('/guest', [
  body('customerInfo.fullName').notEmpty().withMessage('Full name is required'),
  body('customerInfo.email').isEmail().withMessage('Valid email is required'),
  body('customerInfo.phone').notEmpty().withMessage('Phone is required'),
  body('customerInfo.address').notEmpty().withMessage('Address is required'),
  body('customerInfo.city').notEmpty().withMessage('City is required'),
  body('products').isArray().withMessage('Products must be an array'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be positive')
], handleValidationErrors, createGuestOrder);

// Admin routes
router.get('/admin/all', authMiddleware, getAllOrders);
router.put('/admin/:orderId/status', authMiddleware, [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')
], handleValidationErrors, updateOrderStatus);

export default router;
