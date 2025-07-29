import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { 
  createMix, 
  getMixes, 
  getMixById, 
  addReview, 
  getMixSuggestions, 
  analyzeCustomMix 
} from '../controllers/mix.controller';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = Router();

// Get all public mixes
router.get('/', getMixes);

// Get mix by ID
router.get('/:id', getMixById);

// Get mix suggestions (smart recommendations)
router.post('/suggestions', [
  body('desiredFlavor').isIn(['fruit', 'dessert', 'menthol', 'tobacco', 'beverage', 'cream', 'spice']).withMessage('Invalid desired flavor'),
  body('mentholLevel').isFloat({ min: 0, max: 10 }).withMessage('Menthol level must be between 0 and 10'),
  body('sweetness').isFloat({ min: 0, max: 10 }).withMessage('Sweetness must be between 0 and 10'),
  body('complexity').isFloat({ min: 0, max: 10 }).withMessage('Complexity must be between 0 and 10'),
  body('maxLiquids').isInt({ min: 2, max: 5 }).withMessage('Max liquids must be between 2 and 5')
], handleValidationErrors, getMixSuggestions);

// Analyze custom mix
router.post('/analyze', [
  body('liquids').isArray({ min: 1, max: 5 }).withMessage('Must provide 1-5 liquids'),
  body('liquids.*.liquid').notEmpty().withMessage('Liquid ID is required'),
  body('liquids.*.percentage').isFloat({ min: 0, max: 100 }).withMessage('Percentage must be between 0 and 100')
], handleValidationErrors, analyzeCustomMix);

// Create new mix (requires authentication)
router.post('/', authMiddleware, [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('liquids').isArray({ min: 1, max: 5 }).withMessage('Must provide 1-5 liquids'),
  body('liquids.*.liquid').isMongoId().withMessage('Invalid liquid ID'),
  body('liquids.*.percentage').isFloat({ min: 0, max: 100 }).withMessage('Percentage must be between 0 and 100'),
  body('flavorProfile.primary').isIn(['fruit', 'dessert', 'menthol', 'tobacco', 'beverage', 'mixed']).withMessage('Invalid primary flavor'),
  body('flavorProfile.mentholLevel').isFloat({ min: 0, max: 10 }).withMessage('Menthol level must be between 0 and 10'),
  body('flavorProfile.sweetness').isFloat({ min: 0, max: 10 }).withMessage('Sweetness must be between 0 and 10'),
  body('flavorProfile.complexity').isFloat({ min: 0, max: 10 }).withMessage('Complexity must be between 0 and 10'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty level'),
  body('estimatedTaste').notEmpty().withMessage('Estimated taste description is required')
], handleValidationErrors, createMix);

// Add review to mix (requires authentication)
router.post('/:id/reviews', authMiddleware, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').notEmpty().withMessage('Comment is required').isLength({ max: 500 }).withMessage('Comment too long')
], handleValidationErrors, addReview);

export default router; 