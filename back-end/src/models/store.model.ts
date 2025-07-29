import { Schema, model, Document } from 'mongoose';

export interface IStore extends Document {
  name: string;
  location: string;
  phone: string;
  workingHours: string;
  image?: string;
}

const storeSchema = new Schema<IStore>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  workingHours: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export const Store = model<IStore>('Store', storeSchema); 