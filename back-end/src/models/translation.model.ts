import { Schema, model, Document } from 'mongoose';

export interface ITranslation extends Document {
  key: string;
  translations: {
    ar: string;
    en: string;
    fr: string;
  };
  context?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const translationSchema = new Schema<ITranslation>({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  translations: {
    ar: {
      type: String,
      required: true,
      trim: true
    },
    en: {
      type: String,
      required: true,
      trim: true
    },
    fr: {
      type: String,
      required: true,
      trim: true
    }
  },
  context: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// إنشاء index للبحث السريع
translationSchema.index({ key: 1 });
translationSchema.index({ context: 1 });
translationSchema.index({ category: 1 });

export const Translation = model<ITranslation>('Translation', translationSchema); 