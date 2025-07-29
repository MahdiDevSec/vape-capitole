import { Schema, model, Document, Types } from 'mongoose';

export interface ISuggestionRating extends Document {
  mixHash: string;            // مُعرّف فريد للاقتراح (السوائل+النِسَب)
  user?: Types.ObjectId;      // المستخدم (اختياري)
  like: boolean;              // true = 👍، false = 👎
  createdAt: Date;
}

const suggestionRatingSchema = new Schema<ISuggestionRating>({
  mixHash: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  like: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

suggestionRatingSchema.index({ mixHash: 1, user: 1 }, { unique: true });

export const SuggestionRating = model<ISuggestionRating>('SuggestionRating', suggestionRatingSchema); 