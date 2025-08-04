import { Request, Response } from 'express';
import { UsedProduct } from '../models/usedProduct.model';
import { translateText } from '../services/translation.service';

// Get all used products
export const getUsedProducts = async (req: Request, res: Response) => {
  try {
    const {
      category,
      condition,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    const filter: any = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (condition && condition !== 'all') {
      filter.condition = condition;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$text = { $search: search as string };
    }

    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    const products = await UsedProduct.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await UsedProduct.countDocuments(filter);

    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching used products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single used product
export const getUsedProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = await UsedProduct.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Error fetching used product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new used product (Admin only)
export const createUsedProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      nameAr,
      nameFr,
      image,
      images,
      price,
      originalPrice,
      category,
      condition,
      status,
      description,
      descriptionAr,
      descriptionFr,
      seller,
      sellerContact,
      featured
    } = req.body;

    // Auto-translate missing translations
    let finalNameAr = nameAr;
    let finalNameFr = nameFr;
    let finalDescriptionAr = descriptionAr;
    let finalDescriptionFr = descriptionFr;

    if (!nameAr && name) {
      finalNameAr = await translateText(name, 'ar');
    }
    if (!nameFr && name) {
      finalNameFr = await translateText(name, 'fr');
    }
    if (!descriptionAr && description) {
      finalDescriptionAr = await translateText(description, 'ar');
    }
    if (!descriptionFr && description) {
      finalDescriptionFr = await translateText(description, 'fr');
    }

    const product = new UsedProduct({
      name,
      nameAr: finalNameAr,
      nameFr: finalNameFr,
      image,
      images: images || [],
      price,
      originalPrice,
      category,
      condition,
      status: status || 'available',
      description,
      descriptionAr: finalDescriptionAr,
      descriptionFr: finalDescriptionFr,
      seller,
      sellerContact,
      featured: featured || false
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating used product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update used product (Admin only)
export const updateUsedProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Auto-translate missing translations if main text is provided
    if (updateData.name && !updateData.nameAr) {
      updateData.nameAr = await translateText(updateData.name, 'ar');
    }
    if (updateData.name && !updateData.nameFr) {
      updateData.nameFr = await translateText(updateData.name, 'fr');
    }
    if (updateData.description && !updateData.descriptionAr) {
      updateData.descriptionAr = await translateText(updateData.description, 'ar');
    }
    if (updateData.description && !updateData.descriptionFr) {
      updateData.descriptionFr = await translateText(updateData.description, 'fr');
    }

    const product = await UsedProduct.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating used product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete used product (Admin only)
export const deleteUsedProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await UsedProduct.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting used product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get used products statistics (Admin only)
export const getUsedProductsStats = async (req: Request, res: Response) => {
  try {
    const total = await UsedProduct.countDocuments();
    const available = await UsedProduct.countDocuments({ status: 'available' });
    const sold = await UsedProduct.countDocuments({ status: 'sold' });
    const reserved = await UsedProduct.countDocuments({ status: 'reserved' });

    const categoryStats = await UsedProduct.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const conditionStats = await UsedProduct.aggregate([
      {
        $group: {
          _id: '$condition',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      total,
      available,
      sold,
      reserved,
      categoryStats,
      conditionStats
    });
  } catch (error) {
    console.error('Error fetching used products stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product status (Admin only)
export const updateProductStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['available', 'sold', 'reserved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const product = await UsedProduct.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating product status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
