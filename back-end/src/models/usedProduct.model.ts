import mongoose, { Document, Schema } from 'mongoose';

export interface IUsedProduct extends Document {
  name: string;
  nameAr: string;
  nameFr: string;
  image: string;
  images: string[];
  price: number;
  originalPrice: number;
  category: 'vape-kit' | 'box-vape' | 'atomizer';
  condition: 'excellent' | 'good' | 'fair';
  status: 'available' | 'sold' | 'reserved';
  description: string;
  descriptionAr: string;
  descriptionFr: string;
  seller: string;
  sellerContact: string;
  rating: number;
  views: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const usedProductSchema = new Schema<IUsedProduct>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameAr: {
    type: String,
    required: true,
    trim: true
  },
  nameFr: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['vape-kit', 'box-vape', 'atomizer']
  },
  condition: {
    type: String,
    required: true,
    enum: ['excellent', 'good', 'fair']
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'sold', 'reserved'],
    default: 'available'
  },
  description: {
    type: String,
    required: true
  },
  descriptionAr: {
    type: String,
    required: true
  },
  descriptionFr: {
    type: String,
    required: true
  },
  seller: {
    type: String,
    required: true
  },
  sellerContact: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search functionality
usedProductSchema.index({ name: 'text', nameAr: 'text', nameFr: 'text', description: 'text', descriptionAr: 'text', descriptionFr: 'text' });
usedProductSchema.index({ category: 1 });
usedProductSchema.index({ status: 1 });
usedProductSchema.index({ condition: 1 });
usedProductSchema.index({ price: 1 });
usedProductSchema.index({ createdAt: -1 });

export const UsedProduct = mongoose.model<IUsedProduct>('UsedProduct', usedProductSchema);
