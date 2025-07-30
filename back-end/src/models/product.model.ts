import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: number;
  stores: string[];
  nicotineLevel?: number;
  volume?: number;
  baseRatio?: { vg: number; pg: number };
  availability?: Array<{
    storeId: string;
    inStock: boolean;
  }>;
  // الحقول الخاصة بالسوائل
  fruitTypes?: string[];
  coolingType?: string;
  type?: 'حلو' | 'كريمي';
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['vapekits', 'vapeboxes', 'atomisers', 'pyrex', 'batteries', 'accessories', 'cotton', 'coils', 'resistors', 'liquids', 'devices']
  },
  image: {
    type: String,
    required: true
  },
  inStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  stores: [{
    type: String,
    required: true
  }],
  nicotineLevel: {
    type: Number,
    required: false,
    min: 0,
    max: 18
  },
  volume: {
    type: Number,
    required: false,
    min: 0
  },
  baseRatio: {
    vg: {
      type: Number,
      required: false,
      min: 0,
      max: 100
    },
    pg: {
      type: Number,
      required: false,
      min: 0,
      max: 100
    }
  },
  availability: [{
    storeId: {
      type: String,
      required: true
    },
    inStock: {
      type: Boolean,
      default: true
    }
  }],
  // الحقول الخاصة بالسوائل
  fruitTypes: {
    type: [String],
    default: []
  },
  coolingType: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['حلو', 'كريمي'],
    required: false
  }
}, {
  timestamps: true
});

export const Product = model<IProduct>('Product', productSchema);
