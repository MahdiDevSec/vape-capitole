const fs = require('fs');
const path = require('path');

// تحليل أسماء السوائل الحقيقية
const liquidFiles = [
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

// قاعدة بيانات النكهات المحسنة للسوائل الحقيقية
const enhancedFlavorDatabase = {
  // فواكه وحلويات
  fruit: {
    keywords: ['sorbeto', 'luna', 'yoko', 'mer', 'funky', 'remix'],
    characteristics: { sweetness: 8, intensity: 6, complexity: 4 }
  },
  
  // نكهات قوية ومكثفة
  intense: {
    keywords: ['ragnarok', 'hades', 'oni', 'phoenix', 'shiva', 'uraken'],
    characteristics: { intensity: 9, complexity: 8, spiciness: 6 }
  },
  
  // نكهات منعشة
  fresh: {
    keywords: ['tikta', 'tok', 'minasa', 'mwash'],
    characteristics: { mentholLevel: 7, freshness: 8, intensity: 5 }
  },
  
  // نكهات كريمية
  creamy: {
    keywords: ['gorila', 'lycan', 'boldy'],
    characteristics: { creaminess: 8, sweetness: 6, smoothness: 9 }
  },
  
  // نكهات تقليدية
  traditional: {
    keywords: ['hizagiri', 'haisen', 'yamagu'],
    characteristics: { complexity: 7, intensity: 6, traditional: 8 }
  }
};

// تحليل اسم السائل
function analyzeLiquidName(name) {
  const cleanName = name.toLowerCase().replace(/\.jpg$/, '').replace(/[-_\s]/g, ' ');
  
  let detectedCategory = 'mixed';
  let characteristics = {
    mentholLevel: 0,
    sweetness: 5,
    intensity: 5,
    complexity: 5,
    creaminess: 0,
    spiciness: 0,
    freshness: 0,
    traditional: 0
  };

  // تحليل الفئة
  for (const [category, data] of Object.entries(enhancedFlavorDatabase)) {
    if (data.keywords.some(keyword => cleanName.includes(keyword))) {
      detectedCategory = category;
      characteristics = { ...characteristics, ...data.characteristics };
      break;
    }
  }

  // تحليل إضافي بناءً على الكلمات
  if (cleanName.includes('red')) characteristics.intensity += 2;
  if (cleanName.includes('pink')) characteristics.sweetness += 2;
  if (cleanName.includes('raw')) characteristics.intensity += 3;
  if (cleanName.includes('rugged')) characteristics.intensity += 2;
  if (cleanName.includes('original')) characteristics.traditional += 3;
  if (cleanName.includes('concentrate')) characteristics.intensity += 4;
  if (cleanName.includes('litre')) characteristics.intensity += 2;

  // تحديد النكهة الأساسية
  let primaryFlavor = 'mixed';
  if (detectedCategory === 'fruit') primaryFlavor = 'fruit';
  else if (detectedCategory === 'intense') primaryFlavor = 'spice';
  else if (detectedCategory === 'fresh') primaryFlavor = 'menthol';
  else if (detectedCategory === 'creamy') primaryFlavor = 'cream';
  else if (detectedCategory === 'traditional') primaryFlavor = 'tobacco';

  return {
    name: name.replace('.jpg', ''),
    category: detectedCategory,
    primaryFlavor,
    characteristics,
    compatibility: calculateCompatibility(primaryFlavor),
    recommendedPercentage: calculateRecommendedPercentage(primaryFlavor, characteristics)
  };
}

// حساب التوافق
function calculateCompatibility(primaryFlavor) {
  const compatibilityMatrix = {
    fruit: {
      compatible: ['fruit', 'cream', 'fresh'],
      incompatible: ['intense', 'traditional'],
      neutral: ['mixed']
    },
    intense: {
      compatible: ['intense', 'traditional'],
      incompatible: ['fruit', 'creamy'],
      neutral: ['fresh']
    },
    fresh: {
      compatible: ['fruit', 'fresh'],
      incompatible: ['creamy', 'traditional'],
      neutral: ['intense']
    },
    creamy: {
      compatible: ['fruit', 'creamy', 'fresh'],
      incompatible: ['intense'],
      neutral: ['traditional']
    },
    traditional: {
      compatible: ['traditional', 'intense'],
      incompatible: ['fruit', 'fresh'],
      neutral: ['creamy']
    },
    mixed: {
      compatible: ['fruit', 'creamy', 'fresh'],
      incompatible: ['intense'],
      neutral: ['traditional']
    }
  };

  return compatibilityMatrix[primaryFlavor] || compatibilityMatrix.mixed;
}

// حساب النسبة الموصى بها
function calculateRecommendedPercentage(primaryFlavor, characteristics) {
  let percentage = 50;
  
  if (primaryFlavor === 'intense') percentage = 30;
  if (primaryFlavor === 'fresh') percentage = 40;
  if (primaryFlavor === 'creamy') percentage = 60;
  if (primaryFlavor === 'traditional') percentage = 70;
  
  if (characteristics.intensity > 7) percentage -= 10;
  if (characteristics.sweetness > 7) percentage += 5;
  
  return Math.max(20, Math.min(80, percentage));
}

// تحليل جميع السوائل
function analyzeAllLiquids() {
  console.log('🔍 تحليل السوائل الحقيقية...\n');
  
  const analysis = liquidFiles.map(file => {
    const result = analyzeLiquidName(file);
    return {
      filename: file,
      ...result
    };
  });

  // عرض النتائج
  console.log('📊 نتائج التحليل:\n');
  
  const categories = {};
  analysis.forEach(liquid => {
    if (!categories[liquid.category]) categories[liquid.category] = [];
    categories[liquid.category].push(liquid);
  });

  for (const [category, liquids] of Object.entries(categories)) {
    console.log(`\n🎯 فئة: ${category.toUpperCase()} (${liquids.length} سائل)`);
    liquids.forEach(liquid => {
      console.log(`  • ${liquid.name}`);
      console.log(`    - النكهة الأساسية: ${liquid.primaryFlavor}`);
      console.log(`    - القوة: ${liquid.characteristics.intensity}/10`);
      console.log(`    - الحلاوة: ${liquid.characteristics.sweetness}/10`);
      console.log(`    - النسبة الموصى بها: ${liquid.recommendedPercentage}%`);
    });
  }

  return analysis;
}

// تشغيل التحليل
const analysis = analyzeAllLiquids();

// حفظ النتائج في ملف
const resultsPath = path.join(__dirname, 'realLiquidsAnalysis.json');
fs.writeFileSync(resultsPath, JSON.stringify(analysis, null, 2));
console.log(`\n💾 تم حفظ التحليل في: ${resultsPath}`);

module.exports = { analyzeLiquidName, enhancedFlavorDatabase }; 