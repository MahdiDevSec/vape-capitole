import { Request, Response } from 'express';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';

// تعريف نوع خاص ليدعم req.user
interface AuthRequest extends Request {
  user?: any;
}

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { products, totalAmount, shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    // التحقق من وجود المنتجات وتحديث المخزون
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      if (product.inStock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
    }

    // إنشاء الطلب
    const order = new Order({
      user: userId,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod
    });

    await order.save();

    // تحديث المخزون
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { inStock: -item.quantity }
      });
    }

    res.status(201).json(order);
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error?.message || 'Unknown error' });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate('products.product', 'name price image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error: any) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error?.message || 'Unknown error' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate('products.product', 'name price image description');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error: any) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error: error?.message || 'Unknown error' });
  }
}; 