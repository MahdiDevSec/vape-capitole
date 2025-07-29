import { Router } from 'express';
import { getStores, getStoreById } from '../controllers/store.controller';

const router = Router();

// Get all stores
router.get('/', getStores);

// Get store by ID
router.get('/:id', getStoreById);

export default router; 