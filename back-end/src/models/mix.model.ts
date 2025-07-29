import { Schema, model, Document } from 'mongoose';

export interface IMix extends Document {
  name: string;
  description: string;
  creator: Schema.Types.ObjectId; // المستخدم الذي أنشأ الخلطة
  liquids: Array<{
    liquid: Schema.Types.ObjectId;
    percentage: number; // النسبة المئوية
  }>;
  totalPercentage: number; // يجب أن يساوي 100%
  flavorProfile: {
    primary: string; // النكهة الأساسية
    secondary: string[]; // النكهات الثانوية
    mentholLevel: number; // مستوى المنثول (0-10)
    sweetness: number; // مستوى الحلاوة (0-10)
    complexity: number; // مستوى التعقيد (0-10)
  };
  difficulty: 'easy' | 'medium' | 'hard'; // صعوبة الخلط
  estimatedTaste: string; // الوصف المتوقع للطعم
  rating: {
    average: number;
    count: number;
  };
  reviews: Array<{
    user: Schema.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  isPublic: boolean; // هل الخلطة عامة أم خاصة
  tags: string[]; // كلمات مفتاحية للبحث
  createdAt: Date;
  updatedAt: Date;
}

const mixSchema = new Schema<IMix>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  liquids: [{
    liquid: {
      type: Schema.Types.ObjectId,
      ref: 'Liquid',
      required: true
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  }],
  totalPercentage: {
    type: Number,
    required: true,
    default: 0,
    validate: {
      validator: function(value: number) {
        return value === 100;
      },
      message: 'Total percentage must equal 100%'
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
    complexity: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
      default: 5
    }
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  estimatedTaste: {
    type: String,
    required: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Middleware لحساب النسبة الإجمالية
mixSchema.pre('save', function(next) {
  if (this.liquids && this.liquids.length > 0) {
    this.totalPercentage = this.liquids.reduce((sum, liquid) => sum + liquid.percentage, 0);
  }
  next();
});

// Index للبحث
mixSchema.index({ 
  'flavorProfile.primary': 1, 
  'flavorProfile.mentholLevel': 1, 
  'rating.average': -1,
  tags: 1 
});

export const Mix = model<IMix>('Mix', mixSchema); 