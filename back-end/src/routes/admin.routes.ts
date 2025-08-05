import { Router } from 'express';
import { adminMiddleware } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';
import {
  getUsers,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,

  changeAdminCredentials,
  addAdmin,
  updateUser,
  deleteUser,
  getStores,
  createStore,
  updateStore,
  deleteStore
} from '../controllers/admin.controller';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management and protected routes
 */

/**
 * @swagger
 * /admin/products:
 *   get:
 *     summary: Get all products
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *   post:
 *     summary: Create a new product
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 */

/**
 * @swagger
 * /admin/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated
 *   delete:
 *     summary: Delete a product
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *         - image
 *         - availability
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         image:
 *           type: string
 *         availability:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               storeId:
 *                 type: string
 *               inStock:
 *                 type: boolean
 */

const router = Router();

// All routes here are already protected by authMiddleware in app.ts
// and require admin role due to adminMiddleware

// User Management
router.get('/users', adminMiddleware, getUsers);
router.put('/users/:id', adminMiddleware, updateUser);
router.delete('/users/:id', adminMiddleware, deleteUser);

// Store Management
router.get('/stores', adminMiddleware, getStores);
router.post('/stores', adminMiddleware, upload.single('image'), [
  body('name').notEmpty().withMessage('Store name is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('workingHours').notEmpty().withMessage('Working hours is required')
], handleValidationErrors, createStore);
router.put('/stores/:id', adminMiddleware, upload.single('image'), [
  body('name').optional().notEmpty().withMessage('Store name is required'),
  body('location').optional().notEmpty().withMessage('Location is required'),
  body('phone').optional().notEmpty().withMessage('Phone is required'),
  body('workingHours').optional().notEmpty().withMessage('Working hours is required')
], handleValidationErrors, updateStore);
router.delete('/stores/:id', adminMiddleware, deleteStore);

// Product Management
router.get('/products', adminMiddleware, getProducts);
router.post(
  '/products',
  adminMiddleware,
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').isIn(['vapekits', 'vapeboxes', 'atomisers', 'pyrex', 'batteries', 'accessories', 'cotton', 'coils', 'resistors', 'liquids', 'devices']).withMessage('Invalid category'),
    body('inStock').isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
    body('stores').notEmpty().withMessage('Stores are required')
  ],
  handleValidationErrors,
  createProduct
);
router.put(
  '/products/:id',
  adminMiddleware,
  upload.single('image'),
  [
    body('name').optional().notEmpty().withMessage('Name is required'),
    body('description').optional().notEmpty().withMessage('Description is required'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').optional().isIn(['vapekits', 'vapeboxes', 'atomisers', 'pyrex', 'batteries', 'accessories', 'cotton', 'coils', 'resistors', 'liquids']).withMessage('Invalid category')
  ],
  handleValidationErrors,
  updateProduct
);
router.delete('/products/:id', adminMiddleware, deleteProduct);



// Admin Management
router.post('/add-admin', adminMiddleware, addAdmin);
router.put('/change-credentials', adminMiddleware, changeAdminCredentials);

export default router;
