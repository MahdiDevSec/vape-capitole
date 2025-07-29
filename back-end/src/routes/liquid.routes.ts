import { Router } from 'express';
import { 
  getLiquids, 
  getLiquidById, 
  searchLiquids, 
  getCompatibleLiquids, 
  analyzeLiquidMix,
  createLiquid,
  updateLiquid,
  deleteLiquid
} from '../controllers/liquid.controller';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.middleware';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const router = Router();

// Get all liquids
router.get('/', getLiquids);

// Search liquids
router.get('/search', searchLiquids);

// أضف مسار إضافة سائل جديد مع صورة
router.post('/', upload.single('image'), createLiquid);

// تحديث سائل موجود
router.put('/:id', upload.single('image'), updateLiquid);

// حذف سائل
router.delete('/:id', deleteLiquid);

// Get liquid by ID
router.get('/:id', getLiquidById);

// Get compatible liquids for a specific liquid
router.get('/:liquidId/compatible', getCompatibleLiquids);

// Analyze a mix of liquids
router.post('/analyze-mix', [
  body('liquidIds').isArray({ min: 2, max: 5 }).withMessage('Must provide 2-5 liquid IDs'),
  body('liquidIds.*').isMongoId().withMessage('Invalid liquid ID')
], handleValidationErrors, analyzeLiquidMix);

export default router; 