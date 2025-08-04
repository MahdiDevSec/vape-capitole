import { Request, Response } from 'express';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';

// تعريف نوع خاص ليدعم req.user
interface AuthRequest extends Request {
  user?: any;
}

// إنشاء طلب جديد بدون تسجيل دخول (للزبائن الضيوف)
export const createGuestOrder = async (req: Request, res: Response) => {
  try {
    const { customerInfo, products, totalAmount, paymentInfo } = req.body;

    // التحقق من البيانات المطلوبة
    if (!customerInfo || !products || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // التحقق من وجود المنتجات وتحديث المخزون
    const orderProducts = [];
    for (const item of products) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product.name} not found` });
      }
      if (product.inStock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: item.product.price,
        name: item.product.name,
        image: item.product.image
      });
    }

    // معالجة معلومات الدفع (إخفاء رقم البطاقة)
    let processedPaymentInfo = undefined;
    if (paymentInfo && paymentInfo.cardNumber) {
      const cardNumber = paymentInfo.cardNumber.replace(/\s/g, '');
      processedPaymentInfo = {
        cardholderName: paymentInfo.cardholderName,
        cardLastFour: cardNumber.slice(-4),
        expiryDate: paymentInfo.expiryDate
      };
    }

    // إنشاء الطلب
    const order = new Order({
      customerInfo,
      products: orderProducts,
      totalAmount,
      paymentMethod: 'My TPE',
      paymentInfo: processedPaymentInfo,
      paymentStatus: 'pending'
    });

    await order.save();

    // تحديث المخزون
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { inStock: -item.quantity }
      });
    }

    res.status(201).json({
      message: 'Order created successfully',
      orderId: order._id,
      status: order.status
    });
  } catch (error: any) {
    console.error('Error creating guest order:', error);
    res.status(500).json({ message: 'Error creating order', error: error?.message || 'Unknown error' });
  }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { products, totalAmount, customerInfo, paymentMethod } = req.body;
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
      customerInfo,
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

// للأدمن: الحصول على جميع الطلبات
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('products.product', 'name price image')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error: any) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error?.message || 'Unknown error' });
  }
};

// للأدمن: تحديث حالة الطلب
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('products.product', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error: any) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error?.message || 'Unknown error' });
  }
};
