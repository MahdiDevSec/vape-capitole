import { Router } from 'express';
import { body } from 'express-validator';
import { login, register, resetAdminCredentials, verifyToken } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = Router();

router.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], handleValidationErrors, login);

router.post('/register', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required')
], handleValidationErrors, register);

router.post('/reset-admin-credentials', resetAdminCredentials);

// Route للتحقق من صحة التوكن
router.get('/verify', authMiddleware, verifyToken);

export default router;
