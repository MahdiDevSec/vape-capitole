import { ILiquid } from '../models/liquid.model';

// نظام تحليل النكهات الذكي - متكيف مع السوائل الحقيقية
export class LiquidAnalysisService {
  
  // قاعدة بيانات النكهات الحقيقية من مواقع موثوقة
  private static realFlavorDatabase = {
    // فواكه طبيعية
    strawberry: {
      keywords: ['strawberry', 'فراولة', 'straw', 'berry'],
      characteristics: { sweetness: 8, intensity: 5, complexity: 3, fruitiness: 9 }
    },
    mango: {
      keywords: ['mango', 'مانجو', 'mang'],
      characteristics: { sweetness: 7, intensity: 6, complexity: 4, fruitiness: 8 }
    },
    blueberry: {
      keywords: ['blueberry', 'توت', 'blue', 'berry'],
      characteristics: { sweetness: 6, intensity: 4, complexity: 5, fruitiness: 7 }
    },
    apple: {
      keywords: ['apple', 'تفاح', 'app'],
      characteristics: { sweetness: 5, intensity: 4, complexity: 3, fruitiness: 6 }
    },
    banana: {
      keywords: ['banana', 'موز', 'ban'],
      characteristics: { sweetness: 8, intensity: 3, complexity: 2, fruitiness: 7 }
    },
    watermelon: {
      keywords: ['watermelon', 'بطيخ', 'water', 'melon'],
      characteristics: { sweetness: 7, intensity: 3, complexity: 2, fruitiness: 6 }
    },
    peach: {
      keywords: ['peach', 'خوخ', 'peach'],
      characteristics: { sweetness: 8, intensity: 4, complexity: 3, fruitiness: 7 }
    },
    pineapple: {
      keywords: ['pineapple', 'أناناس', 'pine', 'apple'],
      characteristics: { sweetness: 6, intensity: 5, complexity: 4, fruitiness: 7 }
    },
    grape: {
      keywords: ['grape', 'عنب', 'grap'],
      characteristics: { sweetness: 7, intensity: 4, complexity: 3, fruitiness: 6 }
    },
    orange: {
      keywords: ['orange', 'برتقال', 'orang'],
      characteristics: { sweetness: 6, intensity: 5, complexity: 4, fruitiness: 7 }
    },
    lemon: {
      keywords: ['lemon', 'ليمون', 'lem'],
      characteristics: { sweetness: 3, intensity: 6, complexity: 4, fruitiness: 5, acidity: 8 }
    },
    lime: {
      keywords: ['lime', 'ليم', 'lim'],
      characteristics: { sweetness: 2, intensity: 7, complexity: 4, fruitiness: 4, acidity: 9 }
    },
    
    // نكهات كريمية
    vanilla: {
      keywords: ['vanilla', 'فانيليا', 'van'],
      characteristics: { sweetness: 6, intensity: 3, complexity: 4, creaminess: 8 }
    },
    cream: {
      keywords: ['cream', 'كريمة', 'creamy'],
      characteristics: { sweetness: 5, intensity: 2, complexity: 3, creaminess: 9 }
    },
    milk: {
      keywords: ['milk', 'حليب', 'milky'],
      characteristics: { sweetness: 4, intensity: 2, complexity: 2, creaminess: 8 }
    },
    custard: {
      keywords: ['custard', 'كاسترد', 'cust'],
      characteristics: { sweetness: 7, intensity: 3, complexity: 5, creaminess: 9 }
    },
    chocolate: {
      keywords: ['chocolate', 'شوكولاتة', 'choc'],
      characteristics: { sweetness: 7, intensity: 5, complexity: 6, creaminess: 7 }
    },
    caramel: {
      keywords: ['caramel', 'كراميل', 'caram'],
      characteristics: { sweetness: 8, intensity: 4, complexity: 5, creaminess: 6 }
    },
    
    // نكهات منعشة
    menthol: {
      keywords: ['menthol', 'منثول', 'menth'],
      characteristics: { mentholLevel: 9, intensity: 6, complexity: 3, freshness: 9 }
    },
    mint: {
      keywords: ['mint', 'نعناع', 'minty'],
      characteristics: { mentholLevel: 7, intensity: 5, complexity: 3, freshness: 8 }
    },
    ice: {
      keywords: ['ice', 'ثلج', 'icy', 'cool'],
      characteristics: { mentholLevel: 6, intensity: 4, complexity: 2, freshness: 7 }
    },
    spearmint: {
      keywords: ['spearmint', 'نعناع', 'spear'],
      characteristics: { mentholLevel: 8, intensity: 5, complexity: 4, freshness: 8 }
    },
    
    // نكهات تقليدية
    tobacco: {
      keywords: ['tobacco', 'تبغ', 'tobac'],
      characteristics: { intensity: 7, complexity: 8, traditional: 9, bitterness: 6 }
    },
    virginia: {
      keywords: ['virginia', 'فرجينيا', 'virg'],
      characteristics: { intensity: 6, complexity: 7, traditional: 8, sweetness: 4 }
    },
    burley: {
      keywords: ['burley', 'بورلي', 'burl'],
      characteristics: { intensity: 8, complexity: 8, traditional: 9, bitterness: 7 }
    },
    
    // نكهات حلويات
    candy: {
      keywords: ['candy', 'حلوى', 'sweet'],
      characteristics: { sweetness: 9, intensity: 4, complexity: 3 }
    },
    bubblegum: {
      keywords: ['bubblegum', 'علكة', 'bubble'],
      characteristics: { sweetness: 8, intensity: 3, complexity: 2 }
    },
    cotton: {
      keywords: ['cotton', 'قطن', 'candy'],
      characteristics: { sweetness: 7, intensity: 2, complexity: 2 }
    },
    
    // نكهات مشروبات
    coffee: {
      keywords: ['coffee', 'قهوة', 'cafe'],
      characteristics: { intensity: 7, complexity: 8, bitterness: 8, richness: 7 }
    },
    tea: {
      keywords: ['tea', 'شاي', 'te'],
      characteristics: { intensity: 4, complexity: 5, bitterness: 3, freshness: 6 }
    },
    cola: {
      keywords: ['cola', 'كولا', 'coke'],
      characteristics: { sweetness: 6, intensity: 5, complexity: 4, carbonation: 7 }
    },
    
    // نكهات حارة
    cinnamon: {
      keywords: ['cinnamon', 'قرفة', 'cinn'],
      characteristics: { intensity: 6, complexity: 5, spiciness: 7, warmth: 8 }
    },
    clove: {
      keywords: ['clove', 'قرنفل', 'clov'],
      characteristics: { intensity: 7, complexity: 6, spiciness: 6, warmth: 7 }
    },
    nutmeg: {
      keywords: ['nutmeg', 'جوزة الطيب', 'nutm'],
      characteristics: { intensity: 5, complexity: 6, spiciness: 4, warmth: 6 }
    }
  };

  // تحليل السائل بناءً على اسمه ووصفه
  static analyzeLiquid(liquid: ILiquid) {
    // احسب ملف النكهة تلقائيًا ثم دمج أي قيم تم إدخالها يدويًا من قاعدة البيانات
    const autoProfile = this.extractRealFlavorProfile(liquid);
    const flavorProfile = {
      ...autoProfile,
      ...liquid.flavorProfile // قيم المخزن لها أولوية
    };

    const analysis = {
      flavorProfile,
      compatibility: this.calculateRealCompatibility(liquid),
      chemicalProfile: this.analyzeChemicalProfile(liquid),
      mixingRecommendations: this.generateRealMixingRecommendations(liquid),
      autoAnalysis: this.performRealAutoAnalysis(liquid),
      // إضافة تحليل إضافي للتوافق الذكي
      smartCompatibility: this.analyzeSmartCompatibility(liquid, autoProfile.detectedFlavors)
    };

    return analysis;
  }

  // تحليل توافق ذكي للنكهات
  private static analyzeSmartCompatibility(liquid: ILiquid, detectedFlavors: string[]) {
    const conflicts: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    // تحقق من النكهات غير المتوافقة
    const flavorConflicts = this.checkFlavorConflicts(detectedFlavors);
    conflicts.push(...flavorConflicts);
    
    // تحقق من توافق نوع السائل (كريمي/فواكه)
    if (liquid.type) {
      const typeWarnings = this.checkLiquidTypeCompatibility(liquid.type, detectedFlavors);
      warnings.push(...typeWarnings);
    }
    
    // إنشاء توصيات ذكية
    if (detectedFlavors.length > 0) {
      const flavorRecs = this.generateSmartRecommendations(detectedFlavors);
      recommendations.push(...flavorRecs);
    }
    
    return {
      conflicts,
      warnings,
      recommendations,
      compatibleFlavors: this.getCompatibleFlavors(detectedFlavors)
    };
  }
  
  // التحقق من تعارضات النكهات
  private static checkFlavorConflicts(flavors: string[]): string[] {
    const conflicts: string[] = [];
    const conflictPairs: {[key: string]: string[]} = {
      // فواكه لا تتناسب مع بعضها
      'strawberry': ['banana', 'coffee'],
      'mango': ['chocolate', 'tobacco'],
      'blueberry': ['coffee', 'tobacco'],
      'apple': ['coffee', 'menthol'],
      'watermelon': ['coffee', 'tobacco'],
      'pineapple': ['milk', 'cream'],
      'lemon': ['milk', 'cream', 'vanilla'],
      'lime': ['milk', 'cream'],
      // كريمة لا تتناسب مع النعناع
      'cream': ['menthol', 'mint'],
      'vanilla': ['menthol', 'mint'],
      'milk': ['menthol', 'mint', 'lemon', 'lime'],
      // تبغ لا يتناسب مع الفواكه الحمضية
      'tobacco': ['lemon', 'lime', 'orange', 'pineapple']
    };
    
    for (let i = 0; i < flavors.length; i++) {
      for (let j = i + 1; j < flavors.length; j++) {
        const flavor1 = flavors[i];
        const flavor2 = flavors[j];
        
        if (conflictPairs[flavor1]?.includes(flavor2) || 
            conflictPairs[flavor2]?.includes(flavor1)) {
          conflicts.push(`${flavor1} لا يتناسب مع ${flavor2}`);
        }
      }
    }
    
    return conflicts;
  }
  
  // التحقق من توافق نوع السائل مع النكهات
  private static checkLiquidTypeCompatibility(type: string, flavors: string[]): string[] {
    const warnings: string[] = [];
    
    if (type === 'كريمي') {
      const incompatibleFruits = ['lemon', 'lime', 'orange', 'pineapple'];
      const hasIncompatibleFruit = flavors.some(flavor => 
        incompatibleFruits.includes(flavor)
      );
      
      if (hasIncompatibleFruit) {
        warnings.push('تحذير: النكهات الحمضية قد لا تتناسب مع السوائل الكريمية');
      }
    }
    
    return warnings;
  }
  
  // توليد توصيات ذكية للخلط
  private static generateSmartRecommendations(flavors: string[]): string[] {
    const recommendations: string[] = [];
    const flavorEnhancers: {[key: string]: string[]} = {
      'strawberry': ['vanilla', 'cream'],
      'mango': ['coconut', 'peach'],
      'blueberry': ['vanilla', 'cheesecake'],
      'apple': ['cinnamon', 'caramel'],
      'banana': ['hazelnut', 'caramel'],
      'watermelon': ['mint', 'lime'],
      'peach': ['vanilla', 'cream'],
      'pineapple': ['coconut', 'mango'],
      'grape': ['blueberry', 'blackberry'],
      'orange': ['chocolate', 'almond'],
      'lemon': ['lime', 'raspberry'],
      'lime': ['mint', 'coconut'],
      'vanilla': ['caramel', 'hazelnut'],
      'chocolate': ['mint', 'orange'],
      'coffee': ['vanilla', 'caramel'],
      'tobacco': ['vanilla', 'caramel']
    };
    
    for (const flavor of flavors) {
      if (flavorEnhancers[flavor]) {
        recommendations.push(
          `جرب إضافة ${flavorEnhancers[flavor].join(' أو ')} مع ${flavor} لنتيجة أفضل`
        );
      }
    }
    
    return recommendations;
  }
  
  // الحصول على النكهات المتوافقة
  private static getCompatibleFlavors(flavors: string[]): string[] {
    const compatibleFlavors = new Set<string>();
    const flavorCompatibility: {[key: string]: string[]} = {
      'strawberry': ['vanilla', 'cream', 'cheesecake', 'kiwi', 'apple'],
      'mango': ['peach', 'passionfruit', 'coconut', 'pineapple'],
      'blueberry': ['vanilla', 'cheesecake', 'apple', 'blackberry'],
      'apple': ['cinnamon', 'caramel', 'pear', 'grape'],
      'banana': ['caramel', 'hazelnut', 'chocolate', 'peanut butter'],
      'watermelon': ['strawberry', 'kiwi', 'lime', 'mint'],
      'peach': ['apricot', 'vanilla', 'cream', 'raspberry'],
      'pineapple': ['coconut', 'mango', 'passionfruit', 'orange'],
      'grape': ['blueberry', 'blackberry', 'apple', 'pear'],
      'orange': ['chocolate', 'almond', 'cranberry', 'pomegranate'],
      'lemon': ['lime', 'raspberry', 'blueberry', 'elderflower'],
      'lime': ['coconut', 'mint', 'passionfruit', 'mango'],
      'vanilla': ['everything!', 'caramel', 'hazelnut', 'coffee'],
      'chocolate': ['mint', 'orange', 'raspberry', 'peanut butter'],
      'coffee': ['vanilla', 'caramel', 'hazelnut', 'chocolate'],
      'tobacco': ['vanilla', 'caramel', 'hazelnut', 'whiskey']
    };
    
    for (const flavor of flavors) {
      if (flavorCompatibility[flavor]) {
        flavorCompatibility[flavor].forEach(f => compatibleFlavors.add(f));
      }
    }
    
    return Array.from(compatibleFlavors);
  }

  // استخراج ملف النكهة الحقيقي
  private static extractRealFlavorProfile(liquid: ILiquid) {
    const name = liquid.name.toLowerCase();
    const description = liquid.description.toLowerCase();
    const tags = liquid.tags?.map(tag => tag.toLowerCase()) || [];
    const text = `${name} ${description} ${tags.join(' ')}`;

    const detectedFlavors = this.detectRealFlavors(text);
    const primaryFlavor = detectedFlavors.length > 0 ? detectedFlavors[0] : 'mixed';
    
    const profile = {
      primary: primaryFlavor,
      secondary: detectedFlavors.slice(1, 4), // أعلى 3 نكهات ثانوية
      mentholLevel: this.calculateRealMentholLevel(text, detectedFlavors),
      sweetness: this.calculateRealSweetness(text, detectedFlavors),
      intensity: this.calculateRealIntensity(text, detectedFlavors),
      complexity: this.calculateRealComplexity(text, detectedFlavors),
      creaminess: this.calculateRealCreaminess(text, detectedFlavors),
      fruitiness: this.calculateRealFruitiness(text, detectedFlavors),
      spiciness: this.calculateRealSpiciness(text, detectedFlavors),
      bitterness: this.calculateRealBitterness(text, detectedFlavors),
      acidity: this.calculateRealAcidity(text, detectedFlavors),
      detectedFlavors: detectedFlavors
    };

    return profile;
  }

  // اكتشاف النكهات الحقيقية من النص
  private static detectRealFlavors(text: string): string[] {
    const detectedFlavors: string[] = [];
    const flavorScores: { [key: string]: number } = {};

    // البحث عن كل نكهة في النص
    for (const [flavor, data] of Object.entries(this.realFlavorDatabase)) {
      for (const keyword of data.keywords) {
        if (text.includes(keyword)) {
          if (!flavorScores[flavor]) flavorScores[flavor] = 0;
          flavorScores[flavor] += 1;
        }
      }
    }

    // ترتيب النكهات حسب النتيجة
    const sortedFlavors = Object.entries(flavorScores)
      .sort(([,a], [,b]) => b - a)
      .map(([flavor]) => flavor);

    return sortedFlavors.slice(0, 5); // أعلى 5 نكهات
  }

  // حساب مستوى المنثول الحقيقي
  private static calculateRealMentholLevel(text: string, detectedFlavors: string[]): number {
    let level = 0;
    
    // تحليل من النكهات المكتشفة
    for (const flavor of detectedFlavors) {
      const flavorData = this.realFlavorDatabase[flavor as keyof typeof this.realFlavorDatabase];
      if (flavorData && 'mentholLevel' in flavorData.characteristics) {
        level += (flavorData.characteristics as any).mentholLevel || 0;
      }
    }
    
    // تحليل من النص
    if (text.includes('menthol')) level += 4;
    if (text.includes('mint')) level += 3;
    if (text.includes('ice')) level += 2;
    if (text.includes('cool')) level += 2;
    
    return Math.min(level, 10);
  }

  // حساب مستوى الحلاوة الحقيقي
  private static calculateRealSweetness(text: string, detectedFlavors: string[]): number {
    let level = 5;
    
    // تحليل من النكهات المكتشفة
    for (const flavor of detectedFlavors) {
      const flavorData = this.realFlavorDatabase[flavor as keyof typeof this.realFlavorDatabase];
      if (flavorData && 'sweetness' in flavorData.characteristics) {
        level += (flavorData.characteristics as any).sweetness || 0;
      }
    }
    
    // تحليل من النص
    if (text.includes('sweet')) level += 2;
    if (text.includes('candy')) level += 3;
    if (text.includes('sugar')) level += 2;
    
    return Math.max(0, Math.min(level, 10));
  }

  // حساب مستوى القوة الحقيقي
  private static calculateRealIntensity(text: string, detectedFlavors: string[]): number {
    let level = 5;
    
    // تحليل من النكهات المكتشفة
    for (const flavor of detectedFlavors) {
      const flavorData = this.realFlavorDatabase[flavor as keyof typeof this.realFlavorDatabase];
      if (flavorData && 'intensity' in flavorData.characteristics) {
        level += (flavorData.characteristics as any).intensity || 0;
      }
    }
    
    // تحليل من النص
    if (text.includes('strong')) level += 2;
    if (text.includes('bold')) level += 2;
    if (text.includes('intense')) level += 3;
    
    return Math.max(0, Math.min(level, 10));
  }

  // حساب مستوى التعقيد الحقيقي
  private static calculateRealComplexity(text: string, detectedFlavors: string[]): number {
    let level = 5;
    
    // تحليل من النكهات المكتشفة
    for (const flavor of detectedFlavors) {
      const flavorData = this.realFlavorDatabase[flavor as keyof typeof this.realFlavorDatabase];
      if (flavorData && 'complexity' in flavorData.characteristics) {
        level += (flavorData.characteristics as any).complexity || 0;
      }
    }
    
    // تحليل من النص
    if (text.includes('complex')) level += 2;
    if (text.includes('rich')) level += 1;
    if (text.includes('layered')) level += 2;
    
    return Math.max(0, Math.min(level, 10));
  }

  // حساب مستوى الكريمية الحقيقي
  private static calculateRealCreaminess(text: string, detectedFlavors: string[]): number {
    let level = 0;
    
    // تحليل من النكهات المكتشفة
    for (const flavor of detectedFlavors) {
      const flavorData = this.realFlavorDatabase[flavor as keyof typeof this.realFlavorDatabase];
      if (flavorData && 'creaminess' in flavorData.characteristics) {
        level += (flavorData.characteristics as any).creaminess || 0;
      }
    }
    
    // تحليل من النص
    if (text.includes('cream')) level += 8;
    if (text.includes('milk')) level += 6;
    if (text.includes('smooth')) level += 3;
    
    return Math.min(level, 10);
  }

  // حساب مستوى الفواكه الحقيقي
  private static calculateRealFruitiness(text: string, detectedFlavors: string[]): number {
    let level = 0;
    
    // تحليل من النكهات المكتشفة
    for (const flavor of detectedFlavors) {
      const flavorData = this.realFlavorDatabase[flavor as keyof typeof this.realFlavorDatabase];
      if (flavorData && 'fruitiness' in flavorData.characteristics) {
        level += (flavorData.characteristics as any).fruitiness || 0;
      }
    }
    
    // تحليل من النص
    if (text.includes('fruit')) level += 8;
    if (text.includes('berry')) level += 6;
    
    return Math.min(level, 10);
  }

  // حساب مستوى التوابل الحقيقي
  private static calculateRealSpiciness(text: string, detectedFlavors: string[]): number {
    let level = 0;
    
    // تحليل من النكهات المكتشفة
    for (const flavor of detectedFlavors) {
      const flavorData = this.realFlavorDatabase[flavor as keyof typeof this.realFlavorDatabase];
      if (flavorData && 'spiciness' in flavorData.characteristics) {
        level += (flavorData.characteristics as any).spiciness || 0;
      }
    }
    
    // تحليل من النص
    if (text.includes('spice')) level += 7;
    if (text.includes('hot')) level += 5;
    if (text.includes('pepper')) level += 6;
    
    return Math.min(level, 10);
  }

  // حساب مستوى المرارة الحقيقي
  private static calculateRealBitterness(text: string, detectedFlavors: string[]): number {
    let level = 0;
    
    // تحليل من النكهات المكتشفة
    for (const flavor of detectedFlavors) {
      const flavorData = this.realFlavorDatabase[flavor as keyof typeof this.realFlavorDatabase];
      if (flavorData && 'bitterness' in flavorData.characteristics) {
        level += (flavorData.characteristics as any).bitterness || 0;
      }
    }
    
    // تحليل من النص
    if (text.includes('bitter')) level += 6;
    if (text.includes('dark')) level += 3;
    
    return Math.min(level, 10);
  }

  // حساب مستوى الحموضة الحقيقي
  private static calculateRealAcidity(text: string, detectedFlavors: string[]): number {
    let level = 0;
    
    // تحليل من النكهات المكتشفة
    for (const flavor of detectedFlavors) {
      const flavorData = this.realFlavorDatabase[flavor as keyof typeof this.realFlavorDatabase];
      if (flavorData && 'acidity' in flavorData.characteristics) {
        level += (flavorData.characteristics as any).acidity || 0;
      }
    }
    
    // تحليل من النص
    if (text.includes('citrus')) level += 6;
    if (text.includes('sour')) level += 5;
    if (text.includes('tart')) level += 4;
    
    return Math.min(level, 10);
  }

  // حساب التوافق الحقيقي
  private static calculateRealCompatibility(liquid: ILiquid) {
    const text = `${liquid.name} ${liquid.description}`.toLowerCase();
    const detectedFlavors = this.detectRealFlavors(text);
    
    const compatibilityMatrix = {
      // فواكه
      strawberry: { compatible: ['vanilla', 'cream', 'mint'], incompatible: ['tobacco', 'coffee'] },
      mango: { compatible: ['coconut', 'cream', 'mint'], incompatible: ['tobacco', 'coffee'] },
      blueberry: { compatible: ['vanilla', 'cream', 'mint'], incompatible: ['tobacco', 'coffee'] },
      
      // كريمية
      vanilla: { compatible: ['strawberry', 'chocolate', 'caramel'], incompatible: ['menthol', 'mint'] },
      cream: { compatible: ['fruit', 'chocolate', 'caramel'], incompatible: ['menthol', 'mint'] },
      chocolate: { compatible: ['vanilla', 'caramel', 'mint'], incompatible: ['menthol'] },
      
      // منعشة
      menthol: { compatible: ['fruit', 'mint'], incompatible: ['cream', 'chocolate'] },
      mint: { compatible: ['fruit', 'chocolate'], incompatible: ['cream'] },
      
      // تقليدية
      tobacco: { compatible: ['vanilla', 'caramel'], incompatible: ['fruit', 'menthol'] },
      coffee: { compatible: ['vanilla', 'caramel'], incompatible: ['fruit', 'menthol'] }
    };
    
    const primaryFlavor = detectedFlavors[0] || 'mixed';
    const compatibility = compatibilityMatrix[primaryFlavor as keyof typeof compatibilityMatrix];
    
    return {
      compatibleWith: compatibility?.compatible || [],
      incompatibleWith: compatibility?.incompatible || [],
      neutral: ['mixed'],
      recommendedPercentage: this.calculateRealRecommendedPercentage(liquid, primaryFlavor)
    };
  }

  // حساب النسبة الموصى بها الحقيقية
  private static calculateRealRecommendedPercentage(liquid: ILiquid, primaryFlavor: string): number {
    let percentage = 50;
    
    // تحديد النسبة بناءً على نوع النكهة
    const flavorTypes = {
      fruit: 55,
      cream: 60,
      menthol: 40,
      tobacco: 70,
      coffee: 65,
      chocolate: 55,
      vanilla: 50
    };
    
    percentage = flavorTypes[primaryFlavor as keyof typeof flavorTypes] || 50;
    
    // تعديل بناءً على الخصائص
    const text = `${liquid.name} ${liquid.description}`.toLowerCase();
    if (text.includes('concentrate')) percentage -= 15;
    if (text.includes('strong')) percentage -= 10;
    if (text.includes('mild')) percentage += 10;
    
    return Math.max(20, Math.min(80, percentage));
  }

  // تحليل الملف الكيميائي
  private static analyzeChemicalProfile(liquid: ILiquid) {
    return {
      vgRatio: liquid.baseRatio.vg,
      pgRatio: liquid.baseRatio.pg,
      nicotineLevel: liquid.nicotineLevel,
      acidity: this.calculateAcidity(liquid),
      viscosity: this.calculateViscosity(liquid)
    };
  }

  // حساب الحموضة
  private static calculateAcidity(liquid: ILiquid): number {
    const text = `${liquid.name} ${liquid.description}`.toLowerCase();
    const acidicKeywords = ['citrus', 'lemon', 'lime', 'orange', 'sour'];
    
    let acidity = 3;
    
    if (acidicKeywords.some(keyword => text.includes(keyword))) {
      acidity += 4;
    }
    
    return Math.min(acidity, 10);
  }

  // حساب اللزوجة
  private static calculateViscosity(liquid: ILiquid): number {
    if (liquid.baseRatio.vg >= 80) return 9;
    if (liquid.baseRatio.vg >= 70) return 7;
    if (liquid.baseRatio.vg >= 50) return 5;
    return 3;
  }

  // توليد توصيات الخلط الحقيقية
  private static generateRealMixingRecommendations(liquid: ILiquid) {
    const recommendations = [];
    const text = `${liquid.name} ${liquid.description}`.toLowerCase();
    const detectedFlavors = this.detectRealFlavors(text);
    
    // توصيات بناءً على النكهات المكتشفة
    for (const flavor of detectedFlavors.slice(0, 3)) {
      const flavorData = this.realFlavorDatabase[flavor as keyof typeof this.realFlavorDatabase];
      if (flavorData) {
        const characteristics = flavorData.characteristics as any;
        
        if (characteristics.sweetness > 7) {
          recommendations.push(`${flavor} حلو جداً، يخلط جيداً مع النكهات الحامضة`);
        }
        
        if (characteristics.intensity > 7) {
          recommendations.push(`${flavor} قوي جداً، استخدم بنسبة قليلة في الخلط`);
        }
        
        if (characteristics.mentholLevel > 5) {
          recommendations.push(`${flavor} يحتوي على منثول، يخلط جيداً مع الفواكه`);
        }
      }
    }
    
    // توصيات عامة
    if (text.includes('concentrate')) {
      recommendations.push('سائل مركز، استخدم بنسبة قليلة جداً');
    }
    
    if (text.includes('strong')) {
      recommendations.push('سائل قوي، يفضل تخفيفه');
    }
    
    return recommendations;
  }

  // تحليل تلقائي حقيقي للسائل الجديد
  private static performRealAutoAnalysis(liquid: ILiquid) {
    const text = `${liquid.name} ${liquid.description}`.toLowerCase();
    const detectedFlavors = this.detectRealFlavors(text);
    
    return {
      autoDetectedFlavors: detectedFlavors,
      strengthLevel: this.calculateRealIntensity(text, detectedFlavors),
      sweetnessLevel: this.calculateRealSweetness(text, detectedFlavors),
      complexityLevel: this.calculateRealComplexity(text, detectedFlavors),
      mixingDifficulty: this.calculateRealMixingDifficulty(liquid, detectedFlavors),
      bestMixingPartners: this.suggestRealBestMixingPartners(liquid, detectedFlavors)
    };
  }

  // حساب صعوبة الخلط الحقيقية
  private static calculateRealMixingDifficulty(liquid: ILiquid, detectedFlavors: string[]): string {
    let complexity = 0;
    
    // حساب التعقيد بناءً على عدد النكهات
    complexity += detectedFlavors.length * 2;
    
    // حساب التعقيد بناءً على قوة النكهات
    for (const flavor of detectedFlavors) {
      const flavorData = this.realFlavorDatabase[flavor as keyof typeof this.realFlavorDatabase];
      if (flavorData) {
        const characteristics = flavorData.characteristics as any;
        complexity += characteristics.intensity || 0;
      }
    }
    
    if (complexity > 15) return 'hard';
    if (complexity > 10) return 'medium';
    return 'easy';
  }

  // اقتراح أفضل شركاء الخلط الحقيقيين
  private static suggestRealBestMixingPartners(liquid: ILiquid, detectedFlavors: string[]): string[] {
    const partners: string[] = [];
    
    for (const flavor of detectedFlavors) {
      const flavorData = this.realFlavorDatabase[flavor as keyof typeof this.realFlavorDatabase];
      if (flavorData) {
        const characteristics = flavorData.characteristics as any;
        
        // إضافة نكهات متوافقة
        if (characteristics.sweetness > 6) {
          partners.push('citrus', 'menthol');
        }
        
        if (characteristics.mentholLevel > 5) {
          partners.push('strawberry', 'mango', 'blueberry');
        }
        
        if (characteristics.creaminess > 6) {
          partners.push('strawberry', 'chocolate', 'caramel');
        }
      }
    }
    
    return [...new Set(partners)].slice(0, 5); // إزالة التكرار وأخذ أعلى 5
  }

  // تحليل توافق خلطة حقيقي
  static analyzeMixCompatibility(liquids: ILiquid[]): {
    compatibility: 'excellent' | 'good' | 'fair' | 'poor';
    score: number;
    warnings: string[];
    recommendations: string[];
  } {
    if (liquids.length < 2) {
      return {
        compatibility: 'excellent',
        score: 100,
        warnings: [],
        recommendations: ['خلطة بسيطة ومتوافقة']
      };
    }

    let score = 100;
    const warnings = [];
    const recommendations = [];

    // تحليل التوافق بين كل زوج
    for (let i = 0; i < liquids.length - 1; i++) {
      for (let j = i + 1; j < liquids.length; j++) {
        const liquid1 = liquids[i];
        const liquid2 = liquids[j];
        
        const text1 = `${liquid1.name} ${liquid1.description}`.toLowerCase();
        const text2 = `${liquid2.name} ${liquid2.description}`.toLowerCase();
        
        const flavors1 = this.detectRealFlavors(text1);
        const flavors2 = this.detectRealFlavors(text2);
        
        // تحليل التوافق
        const compatibility = this.analyzeFlavorCompatibility(flavors1, flavors2);
        
        if (compatibility.score < 50) {
          score -= 30;
          warnings.push(`${liquid1.name} و ${liquid2.name} غير متوافقين`);
        } else if (compatibility.score > 80) {
          score += 10;
          recommendations.push(`${liquid1.name} و ${liquid2.name} متوافقان ممتازان`);
        }
      }
    }

    // تحديد مستوى التوافق
    let compatibility: 'excellent' | 'good' | 'fair' | 'poor';
    if (score >= 90) compatibility = 'excellent';
    else if (score >= 70) compatibility = 'good';
    else if (score >= 50) compatibility = 'fair';
    else compatibility = 'poor';

    return { compatibility, score, warnings, recommendations };
  }

  // تحليل توافق النكهات
  private static analyzeFlavorCompatibility(flavors1: string[], flavors2: string[]): { score: number } {
    let score = 100;
    
    // تحليل التوافق بين النكهات
    for (const flavor1 of flavors1) {
      for (const flavor2 of flavors2) {
        if (flavor1 === flavor2) {
          score += 20; // نفس النكهة
        } else {
          // تحليل التوافق من قاعدة البيانات
          const compatibilityMatrix = {
            strawberry: { compatible: ['vanilla', 'cream'], incompatible: ['tobacco', 'coffee'] },
            vanilla: { compatible: ['strawberry', 'chocolate'], incompatible: ['menthol'] },
            menthol: { compatible: ['fruit'], incompatible: ['cream', 'chocolate'] },
            tobacco: { compatible: ['vanilla'], incompatible: ['fruit', 'menthol'] }
          };
          
          const compat1 = compatibilityMatrix[flavor1 as keyof typeof compatibilityMatrix];
          if (compat1?.incompatible?.includes(flavor2)) {
            score -= 30;
          } else if (compat1?.compatible?.includes(flavor2)) {
            score += 15;
          }
        }
      }
    }
    
    return { score: Math.max(0, Math.min(100, score)) };
  }

  // تحليل تلقائي للسائل الجديد عند إضافته
  static autoAnalyzeNewLiquid(liquid: ILiquid) {
    console.log(`🔍 تحليل تلقائي للسائل الجديد: ${liquid.name}`);
    
    const analysis = this.analyzeLiquid(liquid);
    
    console.log(`📊 النتائج:`);
    console.log(`  - النكهات المكتشفة: ${analysis.flavorProfile.detectedFlavors.join(', ')}`);
    console.log(`  - النكهة الأساسية: ${analysis.flavorProfile.primary}`);
    console.log(`  - القوة: ${analysis.flavorProfile.intensity}/10`);
    console.log(`  - الحلاوة: ${analysis.flavorProfile.sweetness}/10`);
    console.log(`  - النسبة الموصى بها: ${analysis.compatibility.recommendedPercentage}%`);
    console.log(`  - صعوبة الخلط: ${analysis.autoAnalysis.mixingDifficulty}`);
    console.log(`  - أفضل شركاء: ${analysis.autoAnalysis.bestMixingPartners.join(', ')}`);
    
    return analysis;
  }

  // دالة جديدة لتحليل النكهات من وصف السائل
  static analyzeFlavorsFromDescription(description: string): {
    detectedFlavors: string[];
    confidence: number;
    suggestions: string[];
  } {
    const text = description.toLowerCase();
    const detectedFlavors = this.detectRealFlavors(text);
    
    // حساب مستوى الثقة
    let confidence = 0;
    for (const flavor of detectedFlavors) {
      const flavorData = this.realFlavorDatabase[flavor as keyof typeof this.realFlavorDatabase];
      if (flavorData) {
        for (const keyword of flavorData.keywords) {
          if (text.includes(keyword)) {
            confidence += 1;
          }
        }
      }
    }
    
    // توليد اقتراحات
    const suggestions = [];
    if (detectedFlavors.length === 0) {
      suggestions.push('لم يتم اكتشاف نكهات محددة، يرجى إضافة وصف أكثر تفصيلاً');
    } else if (detectedFlavors.length === 1) {
      suggestions.push(`يمكن إضافة نكهات متوافقة مع ${detectedFlavors[0]}`);
    } else {
      suggestions.push('خلطة متعددة النكهات، تأكد من التوافق');
    }
    
    return {
      detectedFlavors,
      confidence: Math.min(confidence / detectedFlavors.length, 10),
      suggestions
    };
  }

  // دالة جديدة لاقتراح نكهات متوافقة
  static suggestCompatibleFlavors(primaryFlavor: string): {
    highlyCompatible: string[];
    moderatelyCompatible: string[];
    avoid: string[];
  } {
    const compatibilityMatrix = {
      strawberry: {
        highlyCompatible: ['vanilla', 'cream', 'mint', 'chocolate'],
        moderatelyCompatible: ['blueberry', 'raspberry', 'caramel'],
        avoid: ['tobacco', 'coffee', 'menthol']
      },
      vanilla: {
        highlyCompatible: ['strawberry', 'chocolate', 'caramel', 'coffee'],
        moderatelyCompatible: ['banana', 'coconut', 'hazelnut'],
        avoid: ['menthol', 'mint', 'citrus']
      },
      menthol: {
        highlyCompatible: ['strawberry', 'blueberry', 'watermelon'],
        moderatelyCompatible: ['apple', 'peach', 'pineapple'],
        avoid: ['cream', 'chocolate', 'caramel']
      },
      tobacco: {
        highlyCompatible: ['vanilla', 'caramel', 'hazelnut'],
        moderatelyCompatible: ['coffee', 'chocolate', 'whiskey'],
        avoid: ['fruit', 'menthol', 'mint']
      },
      chocolate: {
        highlyCompatible: ['vanilla', 'caramel', 'mint', 'coffee'],
        moderatelyCompatible: ['strawberry', 'banana', 'hazelnut'],
        avoid: ['menthol', 'citrus', 'tobacco']
      }
    };
    
    const compatibility = compatibilityMatrix[primaryFlavor as keyof typeof compatibilityMatrix];
    
    return compatibility || {
      highlyCompatible: ['vanilla', 'cream'],
      moderatelyCompatible: ['fruit'],
      avoid: ['menthol']
    };
  }

  // دالة جديدة لتحليل جودة الخلطة
  static analyzeMixQuality(liquids: ILiquid[]): {
    overallScore: number;
    balance: number;
    complexity: number;
    uniqueness: number;
    recommendations: string[];
  } {
    if (liquids.length < 2) {
      return {
        overallScore: 100,
        balance: 10,
        complexity: 5,
        uniqueness: 8,
        recommendations: ['خلطة بسيطة ومتوازنة']
      };
    }
    
    let overallScore = 100;
    let balance = 10;
    let complexity = 5;
    let uniqueness = 8;
    const recommendations = [];
    
    // تحليل التوازن
    const flavors = liquids.map(liquid => {
      const text = `${liquid.name} ${liquid.description}`.toLowerCase();
      return this.detectRealFlavors(text);
    });
    
    const allFlavors = flavors.flat();
    const uniqueFlavors = [...new Set(allFlavors)];
    
    // حساب التوازن
    if (uniqueFlavors.length >= 3) {
      balance = 9;
      recommendations.push('خلطة متوازنة مع نكهات متنوعة');
    } else if (uniqueFlavors.length === 2) {
      balance = 7;
      recommendations.push('خلطة بسيطة ومتوازنة');
    } else {
      balance = 5;
      recommendations.push('خلطة أحادية النكهة، يمكن إضافة تنوع');
    }
    
    // حساب التعقيد
    complexity = Math.min(uniqueFlavors.length * 2, 10);
    
    // حساب التفرد
    uniqueness = Math.min(uniqueFlavors.length * 1.5, 10);
    
    // حساب النتيجة الإجمالية
    overallScore = Math.round((balance + complexity + uniqueness) / 3 * 10);
    
    return {
      overallScore,
      balance,
      complexity,
      uniqueness,
      recommendations
    };
  }

  // دالة جديدة لاقتراح خلطات ذكية بناءً على الحقول الجديدة
  static suggestSmartMixes(liquids: ILiquid[]): ILiquid[][] {
    // اقتراح خلطات موسعة بناءً على توافق الفواكه، البرودة، والنوع
    const mixes: ILiquid[][] = [];
    for (let i = 0; i < liquids.length; i++) {
      for (let j = 0; j < liquids.length; j++) {
        if (i === j) continue;
        const l1 = liquids[i];
        const l2 = liquids[j];
        // توافق الفواكه
        const sharedFruits = l1.fruitTypes?.some(fruit => l2.fruitTypes?.includes(fruit));
        // توافق البرودة
        const coolingCompatible = l1.coolingType === l2.coolingType || l1.coolingType === '' || l2.coolingType === '';
        // توافق النوع (حل/كريمي)
        const typeCompatible = l1.type === l2.type || l1.type === undefined || l2.type === undefined;
        // إذا كان هناك توافق جيد، اقترح الخلطة
        if (sharedFruits && coolingCompatible && typeCompatible) {
          mixes.push([l1, l2]);
        }
      }
    }
    // اقتراح خلطات ثلاثية إذا كان هناك توافق قوي
    for (let i = 0; i < liquids.length; i++) {
      for (let j = 0; j < liquids.length; j++) {
        for (let k = 0; k < liquids.length; k++) {
          if (i === j || i === k || j === k) continue;
          const l1 = liquids[i];
          const l2 = liquids[j];
          const l3 = liquids[k];
          const allFruits = [...(l1.fruitTypes||[]), ...(l2.fruitTypes||[]), ...(l3.fruitTypes||[])];
          const uniqueFruits = new Set(allFruits);
          // تعديل شرط التوافق ليكون أكثر أماناً مع الأنواع
          const typeCompatible = (!l1.type || !l2.type || !l3.type) || (l1.type === l2.type && l2.type === l3.type);
          const coolingCompatible = (l1.coolingType === l2.coolingType && l2.coolingType === l3.coolingType) || [l1.coolingType, l2.coolingType, l3.coolingType].includes('');
          if (uniqueFruits.size >= 2 && coolingCompatible && typeCompatible) {
            mixes.push([l1, l2, l3]);
          }
        }
      }
    }
    // إعادة ترتيب النتائج لإزالة التكرار
    const uniqueMixes = mixes.filter((mix, idx, arr) =>
      arr.findIndex(m => m.map(x => x._id).sort().join(',') === mix.map(x => x._id).sort().join(',')) === idx
    );
    return uniqueMixes;
  }
} 