import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';

import { Store } from '../models/store.model';

// تعريف نوع خاص ليدعم req.user
interface AuthRequest extends Request {
  user?: any;
}

// User Management
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password -secretAnswer');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching users', error: error?.message || 'Unknown error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true }
    ).select('-password -secretAnswer');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating user', error: error?.message || 'Unknown error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting user', error: error?.message || 'Unknown error' });
  }
};

// Product Management
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching products', error: error?.message || 'Unknown error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    // Handle image upload
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    
    // Handle stores field - parse JSON string to array
    if (typeof data.stores === 'string') {
      try {
        data.stores = JSON.parse(data.stores);
      } catch (e) {
        console.error('Error parsing stores:', e);
        data.stores = [];
      }
    }
    
    // Ensure inStock is a number
    if (data.inStock) {
      data.inStock = Number(data.inStock);
    }
    
    // Ensure price is a number
    if (data.price) {
      data.price = Number(data.price);
    }
    
    const product = new Product(data);
    await product.save();
    res.status(201).json(product);
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error?.message || 'Unknown error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    // Handle image upload
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    
    // Handle stores field - parse JSON string to array
    if (typeof data.stores === 'string') {
      try {
        data.stores = JSON.parse(data.stores);
      } catch (e) {
        console.error('Error parsing stores:', e);
        data.stores = [];
      }
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error: any) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error?.message || 'Unknown error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting product', error: error?.message || 'Unknown error' });
  }
};



export const changeAdminCredentials = async (req: AuthRequest, res: Response) => {
  try {
    const admin = req.user;
    const { newName, newPassword, secretAnswer } = req.body;
    if (!secretAnswer) {
      return res.status(400).json({ message: 'Secret answer is required' });
    }
    const isSecretValid = await admin.compareSecretAnswer(secretAnswer);
    if (!isSecretValid) {
      return res.status(403).json({ message: 'Secret answer is incorrect' });
    }
    if (newName) admin.name = newName;
    if (newPassword) admin.password = newPassword;
    await admin.save();
    res.json({ message: 'Credentials updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating credentials', error: error?.message || 'Unknown error' });
  }
};

export const addAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { email, name, password, secretAnswer } = req.body;
    if (!email || !name || !password || !secretAnswer) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount >= 4) {
      return res.status(400).json({ message: 'Maximum number of admins reached (4)' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const newAdmin = new User({
      email,
      name,
      password,
      role: 'admin',
      secretAnswer
    });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating admin', error: error?.message || 'Unknown error' });
  }
};

// Store Management
export const getStores = async (req: Request, res: Response) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching stores', error: error?.message || 'Unknown error' });
  }
};

export const createStore = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    const store = new Store(data);
    await store.save();
    res.status(201).json(store);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating store', error: error?.message || 'Unknown error' });
  }
};

export const updateStore = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json(store);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating store', error: error?.message || 'Unknown error' });
  }
};

export const deleteStore = async (req: Request, res: Response) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json({ message: 'Store deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting store', error: error?.message || 'Unknown error' });
  }
};
