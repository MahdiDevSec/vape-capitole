import { Router } from 'express';
import { adminMiddleware } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';
import {
  getTranslations,
  getTranslation,
  createTranslation,
  updateTranslation,
  deleteTranslation,
  translateText,
  translateProduct,
  translateStore,
  translateLiquid,
  searchTranslations
} from '../controllers/translation.controller';
import { body } from 'express-validator';

const router = Router();

// Routes للترجمة الذكية (تتطلب صلاحيات أدمن)
router.get('/translations', adminMiddleware, getTranslations);
router.get('/translations/search', adminMiddleware, searchTranslations);
router.get('/translations/:key', adminMiddleware, getTranslation);
router.post('/translations', adminMiddleware, [
  body('key').notEmpty().withMessage('Translation key is required'),
  body('translations.ar').notEmpty().withMessage('Arabic translation is required'),
  body('translations.en').notEmpty().withMessage('English translation is required'),
  body('translations.fr').notEmpty().withMessage('French translation is required')
], handleValidationErrors, createTranslation);
router.put('/translations/:key', adminMiddleware, [
  body('translations.ar').optional().notEmpty().withMessage('Arabic translation is required'),
  body('translations.en').optional().notEmpty().withMessage('English translation is required'),
  body('translations.fr').optional().notEmpty().withMessage('French translation is required')
], handleValidationErrors, updateTranslation);
router.delete('/translations/:key', adminMiddleware, deleteTranslation);

// Routes للترجمة الذكية (متاحة للجميع)
router.post('/translate/text', translateText);
router.post('/translate/product', translateProduct);
router.post('/translate/store', translateStore);
router.post('/translate/liquid', translateLiquid);

export default router; 