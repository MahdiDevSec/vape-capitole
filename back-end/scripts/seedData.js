const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vape-shop');

// Define schemas inline for seeding
const storeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  workingHours: { type: String, required: true },
  image: { type: String, required: false }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { 
    type: String, 
    required: true, 
    enum: ['vape-kits', 'vape-boxes', 'atomizers', 'pyrex', 'accus', 'accessories', 'liquids', 'devices', 'coils', 'cotton'] 
  },
  image: { type: String, required: true },
  inStock: { type: Number, required: true, min: 0, default: 0 },
  store: { type: String, required: true },
  nicotineLevel: { type: Number, required: false, min: 0, max: 18 },
  volume: { type: Number, required: false, min: 0 },
  baseRatio: {
    vg: { type: Number, required: false, min: 0, max: 100 },
    pg: { type: Number, required: false, min: 0, max: 100 }
  },
  availability: [{
    storeId: { type: String, required: true },
    inStock: { type: Boolean, default: true }
  }]
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);
const Product = mongoose.model('Product', productSchema);

// Sample stores data
const storesData = [
  {
    name: 'Vape Store Downtown',
    location: '123 Main Street, Downtown',
    phone: '+1-555-0123',
    workingHours: '9:00 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=300&fit=crop'
  },
  {
    name: 'Cloud Vape Shop',
    location: '456 Oak Avenue, Midtown',
    phone: '+1-555-0456',
    workingHours: '10:00 AM - 11:00 PM',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
  },
  {
    name: 'Premium Vape Center',
    location: '789 Pine Street, Uptown',
    phone: '+1-555-0789',
    workingHours: '8:00 AM - 9:00 PM',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=300&fit=crop'
  }
];

// Sample products data
const productsData = [
  {
    name: 'Voopoo Drag X Pro',
    description: 'Advanced pod mod with PnP coil system',
    price: 89.99,
    category: 'devices',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=300&fit=crop',
    inStock: 15,
    store: '', // Will be set after stores are created
    availability: []
  },
  {
    name: 'GeekVape Aegis Legend',
    description: 'Waterproof and shockproof dual battery mod',
    price: 129.99,
    category: 'devices',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    inStock: 8,
    store: '',
    availability: []
  },
  {
    name: 'SMOK TFV16 Tank',
    description: 'High-capacity sub-ohm tank with mesh coils',
    price: 45.99,
    category: 'atomizers',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=300&fit=crop',
    inStock: 25,
    store: '',
    availability: []
  },
  {
    name: 'Cotton Bacon Prime',
    description: 'Premium organic cotton for rebuildable atomizers',
    price: 12.99,
    category: 'cotton',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    inStock: 50,
    store: '',
    availability: []
  },
  {
    name: 'Strawberry Cream E-Liquid',
    description: 'Delicious strawberry cream flavor, 30ml',
    price: 19.99,
    category: 'liquids',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=300&fit=crop',
    inStock: 30,
    store: '',
    availability: [],
    nicotineLevel: 6,
    volume: 30,
    baseRatio: { vg: 70, pg: 30 }
  },
  {
    name: 'Mint Ice E-Liquid',
    description: 'Refreshing mint ice flavor, 60ml',
    price: 24.99,
    category: 'liquids',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    inStock: 20,
    store: '',
    availability: [],
    nicotineLevel: 3,
    volume: 60,
    baseRatio: { vg: 80, pg: 20 }
  }
];

async function seedData() {
  try {
    // Clear existing data
    await Store.deleteMany({});
    await Product.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create stores
    const stores = await Store.insertMany(storesData);
    console.log(`Created ${stores.length} stores`);
    
    // Update products with store IDs
    const updatedProducts = productsData.map((product, index) => ({
      ...product,
      store: stores[index % stores.length]._id.toString(),
      availability: [{
        storeId: stores[index % stores.length]._id.toString(),
        inStock: product.inStock > 0
      }]
    }));
    
    // Create products
    const products = await Product.insertMany(updatedProducts);
    console.log(`Created ${products.length} products`);
    
    console.log('Data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData(); 