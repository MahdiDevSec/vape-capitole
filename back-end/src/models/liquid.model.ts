import { Schema, model, Document } from 'mongoose';

export interface ILiquid extends Document {
  name: string;
  brand: string;
  description: string;
  price: number;
  nicotineLevel: number;
  volume: number;
  image: string;
  inStock: number;
  stores: Schema.Types.ObjectId[];
  baseRatio: {
    vg: number; // Vegetable Glycerin percentage
    pg: number; // Propylene Glycol percentage
  };
  // معلومات النكهة للخلط
  flavorProfile: {
    primary: string; // النكهة الأساسية
    secondary: string[]; // النكهات الثانوية
    mentholLevel: number; // مستوى المنثول (0-10)
    sweetness: number; // مستوى الحلاوة (0-10)
    intensity: number; // قوة النكهة (0-10)
    complexity: number; // مستوى التعقيد (0-10)
  };
  // الحقول الجديدة
  fruitTypes: string[]; // أنواع الفواكه الموجودة في السائل
  coolingType: string; // نوع البرودة (مثلاً: منتول، مثلج، إلخ)
  type: 'حلو' | 'كريمي'; // تصنيف السائل
  // معلومات الخلط
  mixingInfo: {
    isMixable: boolean; // هل يمكن خلطه
    recommendedPercentage: number; // النسبة الموصى بها في الخلط
    compatibility: string[]; // النكهات المتوافقة معه
    notes: string; // ملاحظات للخلط
  };
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const liquidSchema = new Schema<ILiquid>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
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
  nicotineLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },
  volume: {
    type: Number,
    required: true,
    min: 0
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
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  }],
  baseRatio: {
    vg: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    pg: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  flavorProfile: {
    primary: {
      type: String,
      required: true,
      enum: ['fruit', 'dessert', 'menthol', 'tobacco', 'beverage', 'mixed']
    },
    secondary: [{
      type: String,
      enum: ['fruit', 'dessert', 'menthol', 'tobacco', 'beverage', 'cream', 'spice']
    }],
    mentholLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
      default: 0
    },
    sweetness: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
      default: 5
    },
    intensity: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
      default: 5
    },
    complexity: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
      default: 5
    }
  },
  // الحقول الجديدة
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
    required: true
  },
  mixingInfo: {
    isMixable: {
      type: Boolean,
      default: true
    },
    recommendedPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    compatibility: [{
      type: String,
      enum: ['fruit', 'dessert', 'menthol', 'tobacco', 'beverage', 'cream', 'spice']
    }],
    notes: {
      type: String,
      default: ''
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['fruit', 'dessert', 'menthol', 'tobacco', 'beverage', 'cream', 'spice']
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Validation for base ratio
liquidSchema.pre('save', function(next) {
  if (this.baseRatio.vg + this.baseRatio.pg !== 100) {
    next(new Error('VG + PG must equal 100%'));
  }
  next();
});

// Index for search and filtering
liquidSchema.index({ 
  name: 'text', 
  brand: 'text', 
  category: 1, 
  'flavorProfile.primary': 1,
  'flavorProfile.mentholLevel': 1,
  inStock: 1 
});

export const Liquid = model<ILiquid>('Liquid', liquidSchema); 