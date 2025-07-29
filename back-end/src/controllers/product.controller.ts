import { Request, Response } from 'express';
import { Product } from '../models/product.model';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ inStock: { $gt: 0 } });
    res.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error?.message || 'Unknown error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error: any) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error?.message || 'Unknown error' });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ 
      category, 
      inStock: { $gt: 0 } 
    });
    res.json(products);
  } catch (error: any) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Error fetching products', error: error?.message || 'Unknown error' });
  }
}; 