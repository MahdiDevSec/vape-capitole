import mongoose from 'mongoose';
import { UsedProduct } from './src/models/usedProduct.model';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const deleteAllUsedProducts = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Count existing used products before deletion
    const countBefore = await UsedProduct.countDocuments();
    console.log(`Found ${countBefore} used products in database`);

    if (countBefore === 0) {
      console.log('No used products found to delete');
      return;
    }

    // Delete all used products
    const result = await UsedProduct.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} used products`);

    // Verify deletion
    const countAfter = await UsedProduct.countDocuments();
    console.log(`Remaining used products: ${countAfter}`);

    if (countAfter === 0) {
      console.log('✅ All used products have been successfully deleted from the database');
    } else {
      console.log('⚠️ Some used products may still remain in the database');
    }

  } catch (error) {
    console.error('Error deleting used products:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the script
deleteAllUsedProducts();
