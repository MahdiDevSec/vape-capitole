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

// تحليل اسم السائل لتحديد خصائصه
function analyzeLiquidName(name) {
  const cleanName = name.toLowerCase().replace(/\.jpg$/, '').replace(/[-_\s]/g, ' ');
  
  let category = 'mixed';
  let brand = 'VapeCapitole';
  let description = '';
  let price = 25.99;
  let nicotineLevel = 6;
  let volume = 30;
  let baseRatio = { vg: 70, pg: 30 };
  let tags = [];
  
  // تحليل الفئة والخصائص
  if (cleanName.includes('sorbeto') || cleanName.includes('luna') || cleanName.includes('yoko') || cleanName.includes('mer') || cleanName.includes('funky')) {
    category = 'fruit';
    description = 'نكهة فواكه طازجة وحلوة';
    price = 24.99;
    tags = ['fruit', 'sweet', 'fresh'];
  } else if (cleanName.includes('ragnarok') || cleanName.includes('hades') || cleanName.includes('oni') || cleanName.includes('phoenix') || cleanName.includes('shiva') || cleanName.includes('uraken')) {
    category = 'intense';
    description = 'نكهة قوية ومكثفة';
    price = 27.99;
    nicotineLevel = 12;
    tags = ['intense', 'strong', 'bold'];
  } else if (cleanName.includes('tikta') || cleanName.includes('tok') || cleanName.includes('minasa') || cleanName.includes('mwash')) {
    category = 'fresh';
    description = 'نكهة منعشة وباردة';
    price = 23.99;
    tags = ['fresh', 'cool', 'menthol'];
  } else if (cleanName.includes('gorila') || cleanName.includes('lycan') || cleanName.includes('boldy')) {
    category = 'creamy';
    description = 'نكهة كريمية وناعمة';
    price = 25.99;
    tags = ['creamy', 'smooth', 'rich'];
  } else if (cleanName.includes('hizagiri') || cleanName.includes('haisen') || cleanName.includes('yamagu')) {
    category = 'traditional';
    description = 'نكهة تقليدية وأصيلة';
    price = 28.99;
    nicotineLevel = 18;
    tags = ['traditional', 'classic'];
  } else {
    category = 'mixed';
    description = 'خلطة متوازنة ومتنوعة';
    price = 26.99;
    tags = ['mixed', 'balanced'];
  }
  
  // تعديل السعر بناءً على الخصائص
  if (cleanName.includes('concentrate')) {
    price = 35.99;
    volume = 10;
    baseRatio = { vg: 80, pg: 20 };
  }
  if (cleanName.includes('litre')) {
    price = 45.99;
    volume = 1000;
  }
  if (cleanName.includes('raw')) {
    price = 29.99;
    nicotineLevel = 18;
  }
  
  return {
    name: name.replace('.jpg', ''),
    brand,
    description,
    price,
    nicotineLevel,
    volume,
    image: `/uploads/images/${name}`,
    inStock: Math.floor(Math.random() * 50) + 20,
    baseRatio,
    category,
    tags
  };
}

// بيانات السوائل الحقيقية
const realLiquids = [
  'RAGNAROK.jpg',
  'RED OIL.jpg',
  'SHIGERY.jpg',
  'SHIVA.jpg',
  'SORBETO.jpg',
  'TIKTAKTOK.jpg',
  'TOSHIMORA.jpg',
  'URAKEN.jpg',
  'YAMAGUMI.jpg',
  'YOKO.jpg',
  'remix funky.jpg',
  'BOLDY SHIGERY.jpg',
  'GORILA-RAW.jpg',
  'GORILA-RUGGED.jpg',
  'HADES.jpg',
  'HAISENBERG.jpg',
  'HIZAGIRI.jpg',
  'LUNA.jpg',
  'LYCAN ORIGNAL.jpg',
  'LYCAN PINK.jpg',
  'MER.jpg',
  'MINASAWA.jpg',
  'MWASHI.jpg',
  'ONI.jpg',
  'PHONIX.jpg',
  'concentrate-rugged-go-rilla-temple-30-ml.jpg',
  'funky-1-litre-remix.jpg',
  'lycan red.jpg'
];

// دالة لإضافة السوائل الحقيقية
async function seedRealLiquids() {
  try {
    // الاتصال بقاعدة البيانات
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // حذف السوائل الموجودة
    await Liquid.deleteMany({});
    console.log('Deleted existing liquids');

    // الحصول على أول متجر
    const store = await Store.findOne();
    
    if (!store) {
      console.error('No store found. Please create a store first.');
      process.exit(1);
    }

    // تحليل وإضافة السوائل الحقيقية
    const liquidsData = realLiquids.map(filename => {
      const liquidData = analyzeLiquidName(filename);
      return {
        ...liquidData,
        store: store._id,
        flavorProfile: {
          primary: liquidData.category,
          secondary: [liquidData.category],
          mentholLevel: liquidData.category === 'fresh' ? 7 : 0,
          sweetness: liquidData.category === 'fruit' ? 8 : 5,
          intensity: liquidData.category === 'intense' ? 9 : 5,
          complexity: liquidData.category === 'traditional' ? 7 : 4
        },
        mixingInfo: {
          isMixable: true,
          recommendedPercentage: liquidData.category === 'intense' ? 30 : 50,
          compatibility: liquidData.category === 'fruit' ? ['fruit', 'cream', 'fresh'] : 
                        liquidData.category === 'intense' ? ['intense', 'traditional'] :
                        liquidData.category === 'fresh' ? ['fruit', 'fresh'] :
                        liquidData.category === 'creamy' ? ['fruit', 'creamy', 'fresh'] :
                        liquidData.category === 'traditional' ? ['traditional', 'intense'] : ['mixed'],
          notes: liquidData.category === 'intense' ? 'سائل قوي، استخدم بنسبة قليلة' :
                 liquidData.category === 'fresh' ? 'يخلط جيداً مع الفواكه' :
                 liquidData.category === 'fruit' ? 'يخلط جيداً مع الكريمة' :
                 liquidData.category === 'creamy' ? 'أساس ممتاز للخلط' :
                 liquidData.category === 'traditional' ? 'يخلط جيداً مع التقليدية' : 'خلطة متوازنة'
        }
      };
    });

    // إضافة السوائل
    const result = await Liquid.insertMany(liquidsData);
    console.log(`Successfully added ${result.length} real liquids`);

    // عرض إحصائيات
    const categories = await Liquid.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    console.log('\nReal Liquids by category:');
    categories.forEach(cat => {
      console.log(`${cat._id}: ${cat.count} liquids`);
    });

    console.log('\nReal liquids seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding real liquids:', error);
    process.exit(1);
  }
}

// تشغيل السكريبت
seedRealLiquids(); 