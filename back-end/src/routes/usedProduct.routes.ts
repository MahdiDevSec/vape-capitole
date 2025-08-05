import { Router } from 'express';
import multer from 'multer';
import path from 'path';
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

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'used-product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const router = Router();

// Public routes
router.get('/', getUsedProducts);
router.get('/:id', getUsedProduct);

// Admin routes
router.post('/', authenticateToken, requireAdmin, upload.single('image'), validateUsedProduct, createUsedProduct);
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), validateUsedProduct, updateUsedProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteUsedProduct);
router.get('/admin/stats', authenticateToken, requireAdmin, getUsedProductsStats);
router.patch('/:id/status', authenticateToken, requireAdmin, updateProductStatus);

// Image upload endpoint
router.post('/upload-image', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl, message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

export default router;
