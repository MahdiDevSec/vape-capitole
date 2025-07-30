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

// إنشاء منتج جديد
export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    // معالجة حقل stores إذا أتى كنص
    if (typeof data.stores === 'string') {
      try {
        data.stores = JSON.parse(data.stores);
      } catch {
        data.stores = [data.stores];
      }
    }
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    const product = new Product(data);
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Error creating product', error: error?.message || 'Unknown error' });
  }
};

// تعديل منتج موجود
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    // معالجة حقل stores إذا أتى كنص
    if (typeof data.stores === 'string') {
      try {
        data.stores = JSON.parse(data.stores);
      } catch {
        data.stores = [data.stores];
      }
    }
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error: any) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Error updating product', error: error?.message || 'Unknown error' });
  }
}; 