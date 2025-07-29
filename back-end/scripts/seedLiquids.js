const mongoose = require('mongoose');
require('dotenv').config();

// تعريف Store Schema
const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  workingHours: { type: String, required: true },
  image: { type: String }
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);

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
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
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

// بيانات السوائل الحقيقية
const liquidsData = [
  // فواكه
  {
    name: "Strawberry Delight",
    brand: "VapeMaster",
    description: "نكهة فراولة طازجة وحلوة مع قليل من الحموضة الطبيعية",
    price: 24.99,
    nicotineLevel: 6,
    volume: 30,
    image: "/uploads/strawberry-liquid.jpg",
    inStock: 50,
    baseRatio: { vg: 70, pg: 30 },
    flavorProfile: {
      primary: "fruit",
      secondary: ["strawberry"],
      mentholLevel: 0,
      sweetness: 8,
      intensity: 7,
      complexity: 3
    },
    mixingInfo: {
      isMixable: true,
      recommendedPercentage: 60,
      compatibility: ["fruit", "cream", "dessert"],
      notes: "يخلط جيداً مع الكريمة للحصول على نكهة كريمية"
    },
    category: "fruit",
    tags: ["strawberry", "fruit", "sweet", "fresh"]
  },
  {
    name: "Mango Paradise",
    brand: "TropicalVape",
    description: "نكهة مانجو استوائية غنية وحلوة مع قليل من الحموضة",
    price: 26.99,
    nicotineLevel: 3,
    volume: 30,
    image: "/uploads/mango-liquid.jpg",
    inStock: 35,
    baseRatio: { vg: 80, pg: 20 },
    flavorProfile: {
      primary: "fruit",
      secondary: ["mango", "tropical"],
      mentholLevel: 0,
      sweetness: 9,
      intensity: 8,
      complexity: 5
    },
    mixingInfo: {
      isMixable: true,
      recommendedPercentage: 50,
      compatibility: ["fruit", "cream", "beverage"],
      notes: "مثالي للخلط مع الكريمة أو المشروبات الاستوائية"
    },
    category: "fruit",
    tags: ["mango", "tropical", "sweet", "exotic"]
  },
  {
    name: "Blueberry Blast",
    brand: "BerryVape",
    description: "نكهة توت أزرق طبيعية مع قليل من الحموضة والمرارة",
    price: 25.99,
    nicotineLevel: 6,
    volume: 30,
    image: "/uploads/blueberry-liquid.jpg",
    inStock: 40,
    baseRatio: { vg: 75, pg: 25 },
    flavorProfile: {
      primary: "fruit",
      secondary: ["blueberry"],
      mentholLevel: 0,
      sweetness: 5,
      intensity: 5,
      complexity: 4
    },
    mixingInfo: {
      isMixable: true,
      recommendedPercentage: 40,
      compatibility: ["fruit", "cream", "dessert"],
      notes: "يخلط جيداً مع الكريمة للحصول على نكهة كريمية"
    },
    category: "fruit",
    tags: ["blueberry", "fruit", "natural", "tart"]
  },

  // حلويات
  {
    name: "Vanilla Dream",
    brand: "SweetVape",
    description: "نكهة فانيليا كريمية غنية وحلوة مع قليل من الكريمة",
    price: 22.99,
    nicotineLevel: 3,
    volume: 30,
    image: "/uploads/vanilla-liquid.jpg",
    inStock: 60,
    baseRatio: { vg: 70, pg: 30 },
    flavorProfile: {
      primary: "dessert",
      secondary: ["vanilla", "cream"],
      mentholLevel: 0,
      sweetness: 9,
      intensity: 5,
      complexity: 2
    },
    mixingInfo: {
      isMixable: true,
      recommendedPercentage: 40,
      compatibility: ["fruit", "dessert", "cream"],
      notes: "أساس ممتاز للخلط مع الفواكه والحلويات"
    },
    category: "dessert",
    tags: ["vanilla", "dessert", "sweet", "cream"]
  },
  {
    name: "Chocolate Heaven",
    brand: "CocoaVape",
    description: "نكهة شوكولاتة غنية ومرة مع قليل من الحلاوة",
    price: 27.99,
    nicotineLevel: 6,
    volume: 30,
    image: "/uploads/chocolate-liquid.jpg",
    inStock: 30,
    baseRatio: { vg: 80, pg: 20 },
    flavorProfile: {
      primary: "dessert",
      secondary: ["chocolate", "cocoa"],
      mentholLevel: 0,
      sweetness: 8,
      intensity: 7,
      complexity: 6
    },
    mixingInfo: {
      isMixable: true,
      recommendedPercentage: 50,
      compatibility: ["fruit", "dessert", "cream"],
      notes: "يخلط جيداً مع الفواكه والكريمة"
    },
    category: "dessert",
    tags: ["chocolate", "dessert", "rich", "cocoa"]
  },
  {
    name: "Caramel Swirl",
    brand: "SweetVape",
    description: "نكهة كراميل حلوة وغنية مع قليل من الكريمة",
    price: 24.99,
    nicotineLevel: 3,
    volume: 30,
    image: "/uploads/caramel-liquid.jpg",
    inStock: 45,
    baseRatio: { vg: 75, pg: 25 },
    flavorProfile: {
      primary: "dessert",
      secondary: ["caramel", "cream"],
      mentholLevel: 0,
      sweetness: 10,
      intensity: 6,
      complexity: 4
    },
    mixingInfo: {
      isMixable: true,
      recommendedPercentage: 30,
      compatibility: ["fruit", "dessert", "cream"],
      notes: "يخلط جيداً مع الفواكه للحصول على نكهة حلوة"
    },
    category: "dessert",
    tags: ["caramel", "dessert", "sweet", "rich"]
  },

  // منثول
  {
    name: "Mint Fresh",
    brand: "CoolVape",
    description: "نكهة نعناع منعشة وباردة مع قليل من الحلاوة",
    price: 23.99,
    nicotineLevel: 6,
    volume: 30,
    image: "/uploads/mint-liquid.jpg",
    inStock: 55,
    baseRatio: { vg: 70, pg: 30 },
    flavorProfile: {
      primary: "menthol",
      secondary: ["mint", "fresh"],
      mentholLevel: 8,
      sweetness: 4,
      intensity: 7,
      complexity: 3
    },
    mixingInfo: {
      isMixable: true,
      recommendedPercentage: 30,
      compatibility: ["fruit", "beverage"],
      notes: "يخلط جيداً مع الفواكه للحصول على نكهة منعشة"
    },
    category: "menthol",
    tags: ["mint", "menthol", "fresh", "cool"]
  },
  {
    name: "Peppermint Ice",
    brand: "CoolVape",
    description: "نكهة نعناع فلفلي قوية وباردة جداً",
    price: 25.99,
    nicotineLevel: 3,
    volume: 30,
    image: "/uploads/peppermint-liquid.jpg",
    inStock: 40,
    baseRatio: { vg: 80, pg: 20 },
    flavorProfile: {
      primary: "menthol",
      secondary: ["peppermint", "ice"],
      mentholLevel: 9,
      sweetness: 3,
      intensity: 8,
      complexity: 4
    },
    mixingInfo: {
      isMixable: true,
      recommendedPercentage: 25,
      compatibility: ["fruit", "beverage"],
      notes: "قوي جداً، استخدم بنسبة قليلة في الخلط"
    },
    category: "menthol",
    tags: ["peppermint", "menthol", "ice", "strong"]
  },

  // تبغ
  {
    name: "Virginia Gold",
    brand: "TobaccoVape",
    description: "نكهة تبغ فيرجينيا طبيعية مع قليل من الحلاوة",
    price: 28.99,
    nicotineLevel: 12,
    volume: 30,
    image: "/uploads/virginia-liquid.jpg",
    inStock: 25,
    baseRatio: { vg: 60, pg: 40 },
    flavorProfile: {
      primary: "tobacco",
      secondary: ["virginia", "natural"],
      mentholLevel: 0,
      sweetness: 3,
      intensity: 6,
      complexity: 7
    },
    mixingInfo: {
      isMixable: true,
      recommendedPercentage: 60,
      compatibility: ["tobacco", "spice"],
      notes: "يخلط جيداً مع التوابل والتبغ الآخر"
    },
    category: "tobacco",
    tags: ["virginia", "tobacco", "natural", "traditional"]
  },
  {
    name: "Burley Blend",
    brand: "TobaccoVape",
    description: "نكهة تبغ بورلي قوية ومرة مع قليل من التعقيد",
    price: 29.99,
    nicotineLevel: 18,
    volume: 30,
    image: "/uploads/burley-liquid.jpg",
    inStock: 20,
    baseRatio: { vg: 65, pg: 35 },
    flavorProfile: {
      primary: "tobacco",
      secondary: ["burley", "strong"],
      mentholLevel: 0,
      sweetness: 2,
      intensity: 8,
      complexity: 8
    },
    mixingInfo: {
      isMixable: true,
      recommendedPercentage: 70,
      compatibility: ["tobacco", "spice"],
      notes: "قوي جداً، مناسب للمدخنين السابقين"
    },
    category: "tobacco",
    tags: ["burley", "tobacco", "strong", "complex"]
  },

  // مشروبات
  {
    name: "Coffee Supreme",
    brand: "BeverageVape",
    description: "نكهة قهوة غنية ومرة مع قليل من الكريمة",
    price: 26.99,
    nicotineLevel: 6,
    volume: 30,
    image: "/uploads/coffee-liquid.jpg",
    inStock: 35,
    baseRatio: { vg: 75, pg: 25 },
    flavorProfile: {
      primary: "beverage",
      secondary: ["coffee", "bitter"],
      mentholLevel: 0,
      sweetness: 2,
      intensity: 7,
      complexity: 8
    },
    mixingInfo: {
      isMixable: true,
      recommendedPercentage: 50,
      compatibility: ["fruit", "menthol", "beverage"],
      notes: "يخلط جيداً مع الفواكه والمنثول"
    },
    category: "beverage",
    tags: ["coffee", "beverage", "bitter", "rich"]
  },
  {
    name: "Lemonade Fresh",
    brand: "BeverageVape",
    description: "نكهة عصير ليمون طازج وحامض مع قليل من الحلاوة",
    price: 24.99,
    nicotineLevel: 3,
    volume: 30,
    image: "/uploads/lemonade-liquid.jpg",
    inStock: 50,
    baseRatio: { vg: 70, pg: 30 },
    flavorProfile: {
      primary: "beverage",
      secondary: ["lemon", "citrus"],
      mentholLevel: 0,
      sweetness: 6,
      intensity: 7,
      complexity: 3
    },
    mixingInfo: {
      isMixable: true,
      recommendedPercentage: 40,
      compatibility: ["fruit", "menthol", "beverage"],
      notes: "يخلط جيداً مع المنثول والفواكه"
    },
    category: "beverage",
    tags: ["lemonade", "citrus", "fresh", "sour"]
  },

  // كريمة
  {
    name: "Cream Delight",
    brand: "CreamVape",
    description: "نكهة كريمة طازجة وناعمة مع قليل من الحلاوة",
    price: 23.99,
    nicotineLevel: 3,
    volume: 30,
    image: "/uploads/cream-liquid.jpg",
    inStock: 45,
    baseRatio: { vg: 80, pg: 20 },
    flavorProfile: {
      primary: "cream",
      secondary: ["milk", "smooth"],
      mentholLevel: 0,
      sweetness: 4,
      intensity: 3,
      complexity: 2
    },
    mixingInfo: {
      isMixable: true,
      recommendedPercentage: 40,
      compatibility: ["fruit", "dessert", "cream"],
      notes: "أساس ممتاز للخلط مع الفواكه والحلويات"
    },
    category: "cream",
    tags: ["cream", "milk", "smooth", "mild"]
  },
  {
    name: "Custard Vanilla",
    brand: "CreamVape",
    description: "نكهة كاسترد فانيليا كريمية وحلوة",
    price: 25.99,
    nicotineLevel: 6,
    volume: 30,
    image: "/uploads/custard-liquid.jpg",
    inStock: 30,
    baseRatio: { vg: 85, pg: 15 },
    flavorProfile: {
      primary: "cream",
      secondary: ["custard", "vanilla"],
      mentholLevel: 0,
      sweetness: 7,
      intensity: 4,
      complexity: 3
    },
    mixingInfo: {
      isMixable: true,
      recommendedPercentage: 50,
      compatibility: ["fruit", "dessert", "cream"],
      notes: "يخلط جيداً مع الفواكه للحصول على نكهة كريمية"
    },
    category: "cream",
    tags: ["custard", "vanilla", "cream", "sweet"]
  },

  // توابل
  {
    name: "Cinnamon Spice",
    brand: "SpiceVape",
    description: "نكهة قرفة دافئة وحارة مع قليل من الحلاوة",
    price: 26.99,
    nicotineLevel: 6,
    volume: 30,
    image: "/uploads/cinnamon-liquid.jpg",
    inStock: 25,
    baseRatio: { vg: 75, pg: 25 },
    flavorProfile: {
      primary: "spice",
      secondary: ["cinnamon", "warm"],
      mentholLevel: 0,
      sweetness: 5,
      intensity: 6,
      complexity: 6
    },
    mixingInfo: {
      isMixable: true,
      recommendedPercentage: 25,
      compatibility: ["tobacco", "spice"],
      notes: "قوي، استخدم بنسبة قليلة في الخلط"
    },
    category: "spice",
    tags: ["cinnamon", "spice", "warm", "aromatic"]
  },
  {
    name: "Ginger Fire",
    brand: "SpiceVape",
    description: "نكهة زنجبيل قوية وحارة مع قليل من الحلاوة",
    price: 27.99,
    nicotineLevel: 3,
    volume: 30,
    image: "/uploads/ginger-liquid.jpg",
    inStock: 20,
    baseRatio: { vg: 80, pg: 20 },
    flavorProfile: {
      primary: "spice",
      secondary: ["ginger", "hot"],
      mentholLevel: 0,
      sweetness: 2,
      intensity: 8,
      complexity: 7
    },
    mixingInfo: {
      isMixable: true,
      recommendedPercentage: 20,
      compatibility: ["tobacco", "spice"],
      notes: "قوي جداً، استخدم بنسبة قليلة جداً"
    },
    category: "spice",
    tags: ["ginger", "spice", "hot", "strong"]
  }
];

// دالة لإضافة السوائل
async function seedLiquids() {
  try {
    // الاتصال بقاعدة البيانات
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // حذف السوائل الموجودة
    await Liquid.deleteMany({});
    console.log('Deleted existing liquids');

    // الحصول على أول متجر (افتراضي)
    const store = await Store.findOne();
    
    if (!store) {
      console.error('No store found. Please create a store first.');
      process.exit(1);
    }

    // إضافة store ID لكل سائل
    const liquidsWithStore = liquidsData.map(liquid => ({
      ...liquid,
      store: store._id
    }));

    // إضافة السوائل
    const result = await Liquid.insertMany(liquidsWithStore);
    console.log(`Successfully added ${result.length} liquids`);

    // عرض إحصائيات
    const categories = await Liquid.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    console.log('\nLiquids by category:');
    categories.forEach(cat => {
      console.log(`${cat._id}: ${cat.count} liquids`);
    });

    console.log('\nSeeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding liquids:', error);
    process.exit(1);
  }
}

// تشغيل السكريبت
seedLiquids(); 