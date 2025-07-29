import { Request, Response } from 'express';
import { Mix } from '../models/mix.model';
import { Liquid } from '../models/liquid.model';
import { createHash } from 'crypto';

// تعريف نوع خاص ليدعم req.user
interface AuthRequest extends Request {
  user?: any;
}

// إنشاء خلطة جديدة
export const createMix = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, liquids, flavorProfile, difficulty, estimatedTaste, tags } = req.body;
    const userId = req.user._id;

    // التحقق من أن النسب تساوي 100%
    const totalPercentage = liquids.reduce((sum: number, liquid: any) => sum + liquid.percentage, 0);
    if (totalPercentage !== 100) {
      return res.status(400).json({ message: 'Total percentage must equal 100%' });
    }

    // التحقق من وجود السوائل
    for (const liquidItem of liquids) {
      const liquid = await Liquid.findById(liquidItem.liquid);
      if (!liquid) {
        return res.status(404).json({ message: `Liquid ${liquidItem.liquid} not found` });
      }
    }

    const mix = new Mix({
      name,
      description,
      creator: userId,
      liquids,
      flavorProfile,
      difficulty,
      estimatedTaste,
      tags
    });

    await mix.save();
    await mix.populate('liquids.liquid', 'name brand image flavorProfile');

    res.status(201).json(mix);
  } catch (error: any) {
    console.error('Error creating mix:', error);
    res.status(500).json({ message: 'Error creating mix', error: error?.message || 'Unknown error' });
  }
};

// الحصول على جميع الخلطات العامة
export const getMixes = async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      mentholLevel, 
      difficulty, 
      sort = 'rating', 
      page = 1, 
      limit = 10 
    } = req.query;

    const filter: any = { isPublic: true };
    
    if (category) filter['flavorProfile.primary'] = category;
    if (mentholLevel) filter['flavorProfile.mentholLevel'] = { $gte: Number(mentholLevel) };
    if (difficulty) filter.difficulty = difficulty;

    const sortOptions: any = {};
    if (sort === 'rating') sortOptions['rating.average'] = -1;
    if (sort === 'newest') sortOptions.createdAt = -1;
    if (sort === 'popular') sortOptions['rating.count'] = -1;

    const skip = (Number(page) - 1) * Number(limit);

    const mixes = await Mix.find(filter)
      .populate('liquids.liquid', 'name brand image flavorProfile')
      .populate('creator', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Mix.countDocuments(filter);

    res.json({
      mixes,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / Number(limit)),
        hasNext: skip + mixes.length < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error: any) {
    console.error('Error fetching mixes:', error);
    res.status(500).json({ message: 'Error fetching mixes', error: error?.message || 'Unknown error' });
  }
};

// الحصول على خلطة محددة
export const getMixById = async (req: Request, res: Response) => {
  try {
    const mix = await Mix.findById(req.params.id)
      .populate('liquids.liquid', 'name brand image flavorProfile mixingInfo')
      .populate('creator', 'name')
      .populate('reviews.user', 'name');

    if (!mix) {
      return res.status(404).json({ message: 'Mix not found' });
    }

    res.json(mix);
  } catch (error: any) {
    console.error('Error fetching mix:', error);
    res.status(500).json({ message: 'Error fetching mix', error: error?.message || 'Unknown error' });
  }
};

// إضافة تقييم لخلطة
export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user._id;
    const mixId = req.params.id;

    const mix = await Mix.findById(mixId);
    if (!mix) {
      return res.status(404).json({ message: 'Mix not found' });
    }

    // التحقق من أن المستخدم لم يقيم هذه الخلطة من قبل
    const existingReview = mix.reviews.find(review => review.user.toString() === userId.toString());
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this mix' });
    }

    // إضافة التقييم
    mix.reviews.push({
      user: userId,
      rating,
      comment,
      createdAt: new Date()
    });

    // تحديث متوسط التقييم
    const totalRating = mix.reviews.reduce((sum, review) => sum + review.rating, 0);
    mix.rating.average = totalRating / mix.reviews.length;
    mix.rating.count = mix.reviews.length;

    await mix.save();
    await mix.populate('reviews.user', 'name');

    res.json(mix);
  } catch (error: any) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Error adding review', error: error?.message || 'Unknown error' });
  }
};

// خوارزمية الاقتراحات الذكية
export const getMixSuggestions = async (req: Request, res: Response) => {
  try {
    const { 
      desiredFlavor, 
      mentholLevel = 0, 
      sweetness = 5, 
      complexity = 5,
      coolingType,
      desiredFruitTypes = [], // array of fruits the user wants
      liquidType, // 'حلو' | 'كريمي' | undefined
      maxLiquids = 3 
    } = req.body;

    // بناء فلتر ديناميكي باستخدام مصفوفة شروط $and لعدم الكتابة فوق مفاتيح
    const andConditions: any[] = [
      { inStock: { $gt: 0 } },
      { $or: [ { 'mixingInfo.isMixable': true }, { mixingInfo: { $exists: false } } ] }
    ];

    // الفئة الرئيسية أو الثانوية
    if (desiredFlavor && desiredFlavor !== 'mixed' && desiredFlavor !== 'all') {
      andConditions.push({ $or: [
        { 'flavorProfile.primary': desiredFlavor },
        { 'flavorProfile.secondary': desiredFlavor }
      ]});
    }

    // مستوى المنثول المطلوب (±2)
    if (typeof mentholLevel === 'number' && mentholLevel > 0) {
      andConditions.push({ 'flavorProfile.mentholLevel': { $gte: Math.max(0, mentholLevel - 2), $lte: mentholLevel + 2 } });
    }

    // مستوى الحلاوة المطلوب (±2)
    if (typeof sweetness === 'number') {
      andConditions.push({ 'flavorProfile.sweetness': { $gte: Math.max(0, sweetness - 2), $lte: Math.min(10, sweetness + 2) } });
    }

    // مستوى التعقيد المطلوب (±2)
    if (typeof complexity === 'number') {
      andConditions.push({ 'flavorProfile.complexity': { $gte: Math.max(0, complexity - 2), $lte: Math.min(10, complexity + 2) } });
    }

    // نوع البرودة المطلوب
    if (coolingType) {
      andConditions.push({ coolingType });
    }

    // نوع السائل (حلو/كريمي)
    if (liquidType) {
      andConditions.push({ type: liquidType });
    }

    // أنواع الفاكهة المطلوبة (يجب أن يحتوي على واحدة منها على الأقل)
    if (Array.isArray(desiredFruitTypes) && desiredFruitTypes.length > 0) {
      andConditions.push({ fruitTypes: { $in: desiredFruitTypes } });
    }

    const query: any = andConditions.length > 1 ? { $and: andConditions } : andConditions[0];

    let compatibleLiquids = await Liquid.find(query).limit(100);

    // لو لم نجد شيئًا، خفف القيود بالتدريج حسب الأولوية
    const relaxationSteps: (keyof typeof query | string)[] = [
      'flavorProfile.mentholLevel',
      'flavorProfile.sweetness',
      'flavorProfile.complexity',
      'fruitTypes',
      'coolingType',
      'type',
      '$or' // الفئة
    ];

    for (const key of relaxationSteps) {
      if (compatibleLiquids.length > 0) break;
      delete query[key];
      compatibleLiquids = await Liquid.find(query).limit(100);
    }

    // لا تتوقف هنا؛ سنحاول ملاذًا أخيرًا إن لزم

    // كملاذ أخير، لو ظلّ فارغًا نحاول جلب أى سوائل متاحة لإعطاء اقتراحات عامة
    if (compatibleLiquids.length === 0) {
      const broadQuery: any = { $or: [ { 'mixingInfo.isMixable': true }, { mixingInfo: { $exists: false } } ] };
      compatibleLiquids = await Liquid.find(broadQuery).limit(100);
    }

    if (compatibleLiquids.length === 0) {
      return res.status(404).json({ message: 'No liquids in database to generate suggestions' });
    }

    // خوارزمية إنشاء اقتراحات
    const suggestions = generateMixSuggestions(
      compatibleLiquids,
      desiredFlavor,
      mentholLevel,
      sweetness,
      complexity,
      liquidType,
      coolingType,
      maxLiquids
    );

    res.json({ suggestions });
  } catch (error: any) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ message: 'Error generating suggestions', error: error?.message || 'Unknown error' });
  }
};

// تحليل خلطة مخصصة
export const analyzeCustomMix = async (req: Request, res: Response) => {
  try {
    const { liquids } = req.body;

    if (!liquids || !Array.isArray(liquids) || liquids.length === 0) {
      return res.status(400).json({ message: 'No liquids provided or invalid format' });
    }

    // التحقق من النسب
    const totalPercentage = liquids.reduce((sum: number, liquid: any) => sum + (liquid.percentage || 0), 0);
    if (Math.abs(totalPercentage - 100) > 0.1) {
      return res.status(400).json({ message: 'Total percentage must equal 100%' });
    }

    // التحقق من أن جميع السوائل لها ID
    const hasInvalidLiquids = liquids.some((liquid: any) => !liquid.liquid);
    if (hasInvalidLiquids) {
      return res.status(400).json({ message: 'All liquids must have valid IDs' });
    }

    // جلب معلومات السوائل
    const liquidIds = liquids.map((liquid: any) => liquid.liquid);
    const liquidDetails = await Liquid.find({ _id: { $in: liquidIds } });

    if (liquidDetails.length !== liquids.length) {
      return res.status(400).json({ message: 'Some liquids not found in database' });
    }

    // تحليل الخلطة
    const analysis = analyzeMixComposition(liquids, liquidDetails);

    res.json(analysis);
  } catch (error: any) {
    console.error('Error analyzing mix:', error);
    res.status(500).json({ message: 'Error analyzing mix', error: error?.message || 'Unknown error' });
  }
};

// دالة مساعدة لإنشاء اقتراحات
function generateMixSuggestions(
  liquids: any[],
  desiredFlavor: string,
  mentholLevel: number,
  sweetness: number,
  complexity: number,
  liquidType: string | undefined,
  coolingType: string | undefined,
  maxLiquids: number
) {
  const suggestions = [];
  const maxCombinations = 50; // الحد الأقصى لعدد التركيبات

  // إنشاء تركيبات من 2 إلى maxLiquids
  for (let size = 2; size <= Math.min(maxLiquids, liquids.length); size++) {
    const combinations = generateCombinations(liquids, size);
    
    for (const combination of combinations.slice(0, maxCombinations)) {
      const percentages = calculateOptimalPercentages(combination, desiredFlavor, mentholLevel, sweetness, complexity);
      
      if (percentages) {
        const estimatedProfile = calculateEstimatedProfile(combination, percentages);
        const matchScore = calculateMatchScore(estimatedProfile, desiredFlavor, mentholLevel, sweetness, complexity, liquidType, coolingType);
        
        if (matchScore > 70) { // فقط الاقتراحات الجيدة
          const mixHash = createMixHash(combination.map(l=>l._id.toString()).sort(), percentages);
          suggestions.push({
            liquids: combination.map((liquid, index) => ({
              liquid: liquid._id,
              name: liquid.name,
              percentage: percentages[index]
            })),
            estimatedProfile,
            matchScore,
            mixHash,
            compatibility: checkCompatibility(combination)
          });
        }
      }
    }
  }

  // ترتيب الاقتراحات حسب درجة التطابق
  return suggestions.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);
}

// دالة مساعدة لإنشاء التركيبات
function generateCombinations(liquids: any[], size: number): any[][] {
  if (size === 1) return liquids.map(liquid => [liquid]);
  
  const combinations: any[][] = [];
  
  for (let i = 0; i <= liquids.length - size; i++) {
    const subCombinations = generateCombinations(liquids.slice(i + 1), size - 1);
    for (const subCombination of subCombinations) {
      combinations.push([liquids[i], ...subCombination]);
    }
  }
  
  return combinations;
}

// دالة مساعدة لحساب النسب المثلى
function calculateOptimalPercentages(
  liquids: any[], 
  desiredFlavor: string, 
  mentholLevel: number, 
  sweetness: number, 
  complexity: number
): number[] | null {
  // احسب درجة تشابه كل سائل مع المتطلبات (المسافة العكسية)
  const scores = liquids.map(l => {
    const diffMenthol = Math.abs(l.flavorProfile.mentholLevel - mentholLevel);
    const diffSweet = Math.abs(l.flavorProfile.sweetness - sweetness);
    const diffComplex = Math.abs(l.flavorProfile.complexity - complexity);
    const diffTotal = diffMenthol + diffSweet + diffComplex;
    return 1 / (1 + diffTotal); // الفرق الأصغر يعطى وزنًا أعلى
  });

  let sumScores = scores.reduce((a, b) => a + b, 0);
  if (sumScores === 0) {
    // جميع الفروق كبيرة جدًا → وزّع بالتساوي
    return new Array(liquids.length).fill(Math.round(100 / liquids.length));
  }
  
  // احسب النسب المئوية الأولية
  let percentages = scores.map(s => (s / sumScores) * 100);

  // طبّق حد أدنى 10٪ لكل سائل إن أمكن
  const MIN = 10;
  const belowMin = percentages.map(p => p < MIN);
  let deficit = 0;
  percentages = percentages.map((p, idx) => {
    if (belowMin[idx]) {
      deficit += MIN - p;
      return MIN;
    }
    return p;
  });

  // وزّع العجز من النسب الأكبر
  if (deficit > 0) {
    let i = 0;
    while (deficit > 0 && i < percentages.length) {
      if (!belowMin[i] && percentages[i] - MIN > 0) {
        const take = Math.min(deficit, percentages[i] - MIN);
        percentages[i] -= take;
        deficit -= take;
      }
      i++;
    }
  }
  
  // تطبيع وتقريب للأعداد الصحيحة
  const total = percentages.reduce((s, p) => s + p, 0);
  percentages = percentages.map(p => Math.round((p / total) * 100));
  
  // تصحيح مجموع 100٪ بدقة
  const finalTotal = percentages.reduce((s, p) => s + p, 0);
  if (finalTotal !== 100) {
    const idx = percentages.findIndex(p => p === Math.max(...percentages));
    percentages[idx] += 100 - finalTotal;
  }
  
  return percentages;
}

// دالة مساعدة للتحقق من التوافق
function checkCompatibility(liquids: any[]): string {
  let incompatiblePairs = 0;
  let totalPairs = 0;
  
  for (let i = 0; i < liquids.length - 1; i++) {
    for (let j = i + 1; j < liquids.length; j++) {
      totalPairs++;
      if (!isCompatible(liquids[i], liquids[j])) {
        incompatiblePairs++;
      }
    }
  }
  
  const compatibilityRatio = (totalPairs - incompatiblePairs) / totalPairs;
  
  if (compatibilityRatio >= 0.8) return 'excellent';
  if (compatibilityRatio >= 0.6) return 'good';
  if (compatibilityRatio >= 0.4) return 'fair';
  return 'poor';
}

// تعديل دالة التوافق بين سائلين لتأخذ بعين الاعتبار الحقول الجديدة
function isCompatible(liquid1: any, liquid2: any): boolean {
  // التوافق المعرَّف صراحةً فى mixingInfo
  const compatibility1: string[] = liquid1.mixingInfo?.compatibility || [];
  const compatibility2: string[] = liquid2.mixingInfo?.compatibility || [];
  if (
    compatibility1.includes(liquid2.flavorProfile.primary) ||
    compatibility2.includes(liquid1.flavorProfile.primary)
  ) {
    return true;
  }

  // تطابق النكهة الأساسية
  if (liquid1.flavorProfile.primary === liquid2.flavorProfile.primary) {
    return true;
  }

  // تطابق فى أنواع الفاكهة (إن وُجدت)
  if (liquid1.fruitTypes?.length && liquid2.fruitTypes?.length) {
    const sharedFruits = liquid1.fruitTypes.filter((f: string) => liquid2.fruitTypes.includes(f));
    if (sharedFruits.length > 0) return true;
  }

  // تطابق فى نوع السائل (حلو/كريمي)
  if (liquid1.type && liquid2.type && liquid1.type === liquid2.type) {
    return true;
  }

  // برودة متقاربة (إذا كان الفرق أقل من أو يساوى 1)
  if (liquid1.coolingType && liquid2.coolingType && liquid1.coolingType === liquid2.coolingType) {
    return true;
  }

  // إذا لم يتحقق أى شرط أعلاه اعتبر غير متوافق
  return false;
}

// دالة مساعدة لحساب الملف الشخصي المتوقع
function calculateEstimatedProfile(liquids: any[], percentages: number[]) {
  let totalMenthol = 0;
  let totalSweetness = 0;
  let totalComplexity = 0;

  for (let i = 0; i < liquids.length; i++) {
    const liquid = liquids[i];
    const percentage = percentages[i] / 100;

    totalMenthol += liquid.flavorProfile.mentholLevel * percentage;
    totalSweetness += liquid.flavorProfile.sweetness * percentage;
    totalComplexity += liquid.flavorProfile.complexity * percentage;
  }

  return {
    mentholLevel: Math.round(totalMenthol * 10) / 10,
    sweetness: Math.round(totalSweetness * 10) / 10,
    complexity: Math.round(totalComplexity * 10) / 10
  };
}

// دالة مساعدة لحساب درجة التطابق
function calculateMatchScore(profile: any, desiredFlavor: string, mentholLevel: number, sweetness: number, complexity: number, liquidType?: string, coolingType?: string) {
  const mentholDiff = Math.abs(profile.mentholLevel - mentholLevel);
  const sweetnessDiff = Math.abs(profile.sweetness - sweetness);
  const complexityDiff = Math.abs(profile.complexity - complexity);

  let score = 100 - (mentholDiff + sweetnessDiff + complexityDiff) * 5;

  // مكافأة لتطابق النوع (حلو/كريمي)
  if (liquidType && profile.type && profile.type === liquidType) {
    score += 5;
  }

  // مكافأة لتطابق نوع البرودة
  if (coolingType && profile.coolingType && profile.coolingType === coolingType) {
    score += 5;
  }

  return Math.min(100, Math.max(0, score));
}

// دالة مساعدة لتحليل الخلطة المخصصة
function analyzeMixComposition(liquids: any[], liquidDetails: any[]) {
  const analysis: {
    totalPercentage: number;
    estimatedProfile: {
      mentholLevel: number;
      sweetness: number;
      complexity: number;
      intensity: number;
    };
    compatibility: string;
    warnings: string[];
    recommendations: string[];
    score: number;
    incompatiblePairs: string[];
  } = {
    totalPercentage: 0,
    estimatedProfile: {
      mentholLevel: 0,
      sweetness: 0,
      complexity: 0,
      intensity: 0
    },
    compatibility: 'good',
    warnings: [],
    recommendations: [],
    score: 0,
    incompatiblePairs: []
  };

  // حساب الملف الشخصي المتوقع
  for (const liquidItem of liquids) {
    const liquid = liquidDetails.find(l => l._id.toString() === liquidItem.liquid);
    if (liquid) {
      const percentage = liquidItem.percentage / 100;
      
      analysis.estimatedProfile.mentholLevel += liquid.flavorProfile.mentholLevel * percentage;
      analysis.estimatedProfile.sweetness += liquid.flavorProfile.sweetness * percentage;
      analysis.estimatedProfile.complexity += liquid.flavorProfile.complexity * percentage;
      analysis.estimatedProfile.intensity += liquid.flavorProfile.intensity * percentage;
    }
  }

  // التحقق من التوافق
  const incompatiblePairs: string[] = [];
  for (let i = 0; i < liquids.length - 1; i++) {
    for (let j = i + 1; j < liquids.length; j++) {
      const liquid1 = liquidDetails.find(l => l._id.toString() === liquids[i].liquid);
      const liquid2 = liquidDetails.find(l => l._id.toString() === liquids[j].liquid);
      
      if (liquid1 && liquid2 && !isCompatible(liquid1, liquid2)) {
        incompatiblePairs.push(`${liquid1.name} + ${liquid2.name}`);
      }
    }
  }

  if (incompatiblePairs.length > 0) {
    analysis.compatibility = 'poor';
    analysis.warnings.push(`Incompatible combinations: ${incompatiblePairs.join(', ')}`);
  }

  // حساب درجة توافق مئوية بسيطة
  const totalPairs = liquids.length * (liquids.length -1) /2;
  analysis.score = totalPairs===0?100: Math.round(((totalPairs - incompatiblePairs.length)/ totalPairs)*100);
  analysis.incompatiblePairs = incompatiblePairs;

  // التوصيات
  if (analysis.estimatedProfile.mentholLevel > 8) {
    analysis.recommendations.push('High menthol level - may be too strong for some users');
  }

  if (analysis.estimatedProfile.sweetness > 8) {
    analysis.recommendations.push('High sweetness - consider adding a less sweet liquid');
  }

  if (analysis.estimatedProfile.complexity < 3) {
    analysis.recommendations.push('Low complexity - consider adding more diverse flavors');
  }

  return analysis;
} 

function createMixHash(ids: string[], percentages: number[]): string {
  return createHash('md5')
    .update(ids.join('-') + ':' + percentages.join('-'))
    .digest('hex');
} 