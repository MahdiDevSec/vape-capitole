import mongoose from 'mongoose';
import { User } from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vape-shop');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }
    
    // Create admin user
    const admin = new User({
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
      secretAnswer: 'secret'
    });
    
    await admin.save();
    console.log('Admin user created successfully:', admin.email);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
