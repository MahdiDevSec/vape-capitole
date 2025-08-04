import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: errors.array()
    });
  }
  next();
};

export const validateUsedProduct = (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    price,
    originalPrice,
    category,
    condition,
    description,
    seller,
    sellerContact,
    image
  } = req.body;

  const errors: string[] = [];

  // Required fields validation
  if (!name || name.trim().length === 0) {
    errors.push('Product name is required');
  }

  if (!price || price <= 0) {
    errors.push('Valid price is required');
  }

  if (!originalPrice || originalPrice <= 0) {
    errors.push('Valid original price is required');
  }

  if (price && originalPrice && price > originalPrice) {
    errors.push('Price cannot be higher than original price');
  }

  if (!category || !['vape-kit', 'box-vape', 'atomizer'].includes(category)) {
    errors.push('Valid category is required (vape-kit, box-vape, atomizer)');
  }

  if (!condition || !['excellent', 'good', 'fair'].includes(condition)) {
    errors.push('Valid condition is required (excellent, good, fair)');
  }

  if (!description || description.trim().length === 0) {
    errors.push('Product description is required');
  }

  if (!seller || seller.trim().length === 0) {
    errors.push('Seller name is required');
  }

  if (!sellerContact || sellerContact.trim().length === 0) {
    errors.push('Seller contact is required');
  }

  if (!image || image.trim().length === 0) {
    errors.push('Product image is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation Error',
      errors
    });
  }

  next();
};
