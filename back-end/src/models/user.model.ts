import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
  secretAnswer?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  compareSecretAnswer(candidateAnswer: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  name: {
    type: String,
    required: true,
  },
  secretAnswer: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

// Hash password and secretAnswer before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified('secretAnswer') && this.secretAnswer) {
    const salt = await bcrypt.genSalt(10);
    this.secretAnswer = await bcrypt.hash(this.secretAnswer, salt);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Compare secret answer method
userSchema.methods.compareSecretAnswer = async function(candidateAnswer: string): Promise<boolean> {
  if (!this.secretAnswer) return false;
  return bcrypt.compare(candidateAnswer, this.secretAnswer);
};

export const User = model<IUser>('User', userSchema);
