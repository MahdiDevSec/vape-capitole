const mongoose = require('mongoose');
require('dotenv').config();

// تعريف Schema للسوائل
const liquidSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  nicotineLevel: { type: Number, required: true },
  volume: { type: Number, required: true },
  image: { type: String, required: true },
  inStock: { type: Number, required: true, default: 0 },
  stores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }],
  baseRatio: {
    vg: { type: Number, required: true },
    pg: { type: Number, required: true }
  },
  flavorProfile: {
    primary: { type: String, required: true },
    secondary: [String],
    mentholLevel: { type: Number, default: 0 },
    sweetness: { type: Number, default: 5 },
    intensity: { type: Number, default: 5 },
    complexity: { type: Number, default: 5 }
  },
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
    isMixable: { type: Boolean, default: true },
    recommendedPercentage: { type: Number, default: 50 },
    compatibility: [String],
    notes: { type: String, default: '' }
  },
  category: { type: String, required: true },
  tags: [String]
}, { timestamps: true });

const Liquid = mongoose.model('Liquid', liquidSchema);

async function clearLiquids() {
  try {
    // الاتصال بقاعدة البيانات
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // حذف جميع السوائل
    const result = await Liquid.deleteMany({});
    console.log(`Deleted ${result.deletedCount} liquids from database`);

    console.log('All liquids cleared successfully!');
  } catch (error) {
    console.error('Error clearing liquids:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

clearLiquids(); 