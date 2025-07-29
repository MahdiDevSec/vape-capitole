import { Request, Response } from 'express';
import { Store } from '../models/store.model';

export const getStores = async (req: Request, res: Response) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error: any) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Error fetching stores', error: error?.message || 'Unknown error' });
  }
};

export const getStoreById = async (req: Request, res: Response) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json(store);
  } catch (error: any) {
    console.error('Error fetching store:', error);
    res.status(500).json({ message: 'Error fetching store', error: error?.message || 'Unknown error' });
  }
}; 