import { Request, Response } from 'express';
import { Liquid } from '../models/liquid.model';
import { LiquidAnalysisService } from '../services/liquidAnalysis.service';

// جلب جميع السوائل مع التحليل الذكي
export const getLiquids = async (req: Request, res: Response) => {
  try {
    const { category, search, sort } = req.query;
    
    // افتراضيًا اعرض جميع السوائل بما فيها التي نفد مخزونها،
    // ويمكن تمرير ?inStockOnly=true لتصفية السوائل المتوفرة فقط.
    let query: any = {};
    const { inStockOnly } = req.query;
    if (inStockOnly === 'true') {
      query.inStock = { $gt: 0 };
    }
    
    // فلترة حسب الفئة
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // البحث في الاسم والوصف
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
        { brand: { $regex: search as string, $options: 'i' } }
      ];
    }
    
    // ترتيب النتائج
    let sortOption: any = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'name-asc') sortOption = { name: 1 };
    if (sort === 'name-desc') sortOption = { name: -1 };
    
    const liquids = await Liquid.find(query).sort(sortOption).populate('stores');
    
    // تحليل كل سائل تلقائياً
    const analyzedLiquids = liquids.map(liquid => {
      const analysis = LiquidAnalysisService.analyzeLiquid(liquid);
      return {
        ...liquid.toObject(),
        analysis
      };
    });
    
    res.json({
      success: true,
      count: analyzedLiquids.length,
      liquids: analyzedLiquids
    });
  } catch (error: any) {
    console.error('Error fetching liquids:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch liquids',
      error: error?.message || 'Unknown error'
    });
  }
};

// جلب سائل واحد مع التحليل التفصيلي
export const getLiquidById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const liquid = await Liquid.findById(id).populate('stores');
    
    if (!liquid) {
      return res.status(404).json({
        success: false,
        message: 'Liquid not found'
      });
    }
    
    // تحليل السائل تلقائياً
    const analysis = LiquidAnalysisService.analyzeLiquid(liquid);
    
    res.json({
      success: true,
      liquid: {
        ...liquid.toObject(),
        analysis
      }
    });
  } catch (error: any) {
    console.error('Error fetching liquid:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch liquid',
      error: error?.message || 'Unknown error'
    });
  }
};

// البحث في السوائل
export const searchLiquids = async (req: Request, res: Response) => {
  try {
    const { q, category, priceMin, priceMax } = req.query;
    
    let query: any = { inStock: { $gt: 0 } };
    
    // البحث النصي
    if (q) {
      query.$or = [
        { name: { $regex: q as string, $options: 'i' } },
        { description: { $regex: q as string, $options: 'i' } },
        { brand: { $regex: q as string, $options: 'i' } },
        { tags: { $in: [new RegExp(q as string, 'i')] } }
      ];
    }
    
    // فلترة حسب الفئة
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // فلترة حسب السعر
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }
    
    const liquids = await Liquid.find(query).populate('stores');
    
    // تحليل النتائج تلقائياً
    const analyzedLiquids = liquids.map(liquid => {
      const analysis = LiquidAnalysisService.analyzeLiquid(liquid);
      return {
        ...liquid.toObject(),
        analysis
      };
    });
    
    res.json({
      success: true,
      count: analyzedLiquids.length,
      liquids: analyzedLiquids
    });
  } catch (error: any) {
    console.error('Error searching liquids:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search liquids',
      error: error?.message || 'Unknown error'
    });
  }
};

// جلب السوائل المتوافقة مع سائل معين
export const getCompatibleLiquids = async (req: Request, res: Response) => {
  try {
    const { liquidId } = req.params;
    
    const targetLiquid = await Liquid.findById(liquidId);
    
    if (!targetLiquid) {
      return res.status(404).json({
        success: false,
        message: 'Target liquid not found'
      });
    }
    
    // تحليل السائل المستهدف
    const targetAnalysis = LiquidAnalysisService.analyzeLiquid(targetLiquid);
    const compatibleCategories = targetAnalysis.compatibility.compatibleWith;
    
    // البحث عن السوائل المتوافقة
    const compatibleLiquids = await Liquid.find({
      _id: { $ne: liquidId },
      inStock: { $gt: 0 },
      category: { $in: compatibleCategories }
    }).populate('stores');
    
    // تحليل السوائل المتوافقة
    const analyzedCompatibleLiquids = compatibleLiquids.map(liquid => {
      const analysis = LiquidAnalysisService.analyzeLiquid(liquid);
      return {
        ...liquid.toObject(),
        analysis,
        compatibilityScore: calculateCompatibilityScore(targetAnalysis, analysis)
      };
    });
    
    // ترتيب حسب درجة التوافق
    analyzedCompatibleLiquids.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    
    res.json({
      success: true,
      targetLiquid: {
        ...targetLiquid.toObject(),
        analysis: targetAnalysis
      },
      compatibleLiquids: analyzedCompatibleLiquids.slice(0, 10) // أعلى 10 متوافقين
    });
  } catch (error: any) {
    console.error('Error fetching compatible liquids:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compatible liquids',
      error: error?.message || 'Unknown error'
    });
  }
};

// تحليل خلطة من السوائل
export const analyzeLiquidMix = async (req: Request, res: Response) => {
  try {
    const { liquidIds } = req.body;
    
    if (!liquidIds || !Array.isArray(liquidIds) || liquidIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 2 liquid IDs'
      });
    }
    
    // جلب السوائل المحددة
    const liquids = await Liquid.find({
      _id: { $in: liquidIds },
      inStock: { $gt: 0 }
    }).populate('stores');
    
    if (liquids.length !== liquidIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some liquids not found or out of stock'
      });
    }
    
    // تحليل التوافق
    const compatibilityAnalysis = LiquidAnalysisService.analyzeMixCompatibility(liquids);
    
    // تحليل كل سائل
    const analyzedLiquids = liquids.map(liquid => {
      const analysis = LiquidAnalysisService.analyzeLiquid(liquid);
      return {
        ...liquid.toObject(),
        analysis
      };
    });
    
    // حساب الملف الشخصي المتوقع للخلطة
    const estimatedProfile = calculateEstimatedMixProfile(analyzedLiquids);
    
    res.json({
      success: true,
      liquids: analyzedLiquids,
      compatibility: compatibilityAnalysis,
      estimatedProfile,
      recommendations: generateMixRecommendations(analyzedLiquids, compatibilityAnalysis)
    });
  } catch (error: any) {
    console.error('Error analyzing liquid mix:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze liquid mix',
      error: error?.message || 'Unknown error'
    });
  }
};

// إضافة سائل جديد مع صورة
export const createLiquid = async (req: Request, res: Response) => {
  try {
    console.log('Received data:', req.body);
    console.log('Received file:', req.file);
    
    const data = req.body;
    
    // خريطة المتجر القديم قبل التحقق
    if (!data.stores && data.store) {
      data.stores = (typeof data.store === 'string') ? data.store.split(',').map((s:string)=>s.trim()) : [data.store];
    }

    // الحقول الإلزامية فعلياً (استبعدنا stores)
    if (!data.name || !data.brand || !data.description || !data.price || !data.nicotineLevel || !data.volume || !data.category || !data.type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: ['name', 'brand', 'description', 'price', 'nicotineLevel', 'volume', 'category', 'type']
      });
    }
    // ensure stores is array if sent as JSON string
    if (typeof data.stores==='string') {
      try{ data.stores = JSON.parse(data.stores); } catch{ data.stores=[data.stores]; }
    }
    
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    } else {
      data.image = '/uploads/default-liquid.jpg'; // صورة افتراضية
    }
    
    // تحويل بعض الحقول من JSON إذا لزم
    if (typeof data.baseRatio === 'string') {
      try {
        data.baseRatio = JSON.parse(data.baseRatio);
      } catch (e) {
        console.error('Error parsing baseRatio:', e);
        data.baseRatio = { vg: 70, pg: 30 };
      }
    }
    
    if (typeof data.fruitTypes === 'string') {
      try {
        data.fruitTypes = JSON.parse(data.fruitTypes);
      } catch (e) {
        console.error('Error parsing fruitTypes:', e);
        data.fruitTypes = [];
      }
    }
    
    if (typeof data.flavorProfile === 'string') {
      try {
        data.flavorProfile = JSON.parse(data.flavorProfile);
      } catch (e) {
        console.error('Error parsing flavorProfile:', e);
        data.flavorProfile = {
          primary: 'mixed',
          secondary: [],
          mentholLevel: 0,
          sweetness: 5,
          intensity: 5,
          complexity: 5
        };
      }
    }

    // تأكد من أن قيم الحقول الرقمية داخل flavorProfile أرقام وليست نصوصًا
    if (data.flavorProfile) {
      ['mentholLevel', 'sweetness', 'intensity', 'complexity'].forEach((k) => {
        const key = k as keyof typeof data.flavorProfile;
        if (typeof data.flavorProfile[key] === 'string') {
          data.flavorProfile[key] = Number(data.flavorProfile[key]);
        }
      });
    }
    
    if (typeof data.mixingInfo === 'string') {
      try {
        data.mixingInfo = JSON.parse(data.mixingInfo);
      } catch (e) {
        console.error('Error parsing mixingInfo:', e);
        data.mixingInfo = {
          isMixable: true,
          recommendedPercentage: 50,
          compatibility: [],
          notes: ''
        };
      }
    }
    
    if (typeof data.tags === 'string') {
      try {
        data.tags = JSON.parse(data.tags);
      } catch (e) {
        console.error('Error parsing tags:', e);
        data.tags = [];
      }
    }
    
    // تأكد من أن VG + PG = 100
    if (data.baseRatio && (data.baseRatio.vg + data.baseRatio.pg !== 100)) {
      data.baseRatio = { vg: 70, pg: 30 };
    }
    
    // تحويل الحقول الرقمية من نص إلى رقم
    ['price','nicotineLevel','volume','mentholLevel','inStock'].forEach((field)=>{
      if (data[field]!==undefined) data[field] = Number(data[field]);
    });
    
    console.log('Processed data:', data);
    
    // أنشئ السائل
    const liquid = new Liquid(data);
    await liquid.save();
    res.status(201).json({ success: true, liquid });
  } catch (error: any) {
    console.error('Error creating liquid:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    // رسائل خطأ أكثر تفصيلاً
    let errorMessage = 'Error creating liquid';
    if (error.code === 11000) {
      errorMessage = 'Liquid with this name already exists';
    } else if (error.name === 'ValidationError') {
      errorMessage = 'Validation error: ' + Object.values(error.errors).map((err: any) => err.message).join(', ');
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage, 
      error: error?.message || 'Unknown error',
      details: error?.errors || error?.code || 'No additional details'
    });
  }
};

// تحديث سائل موجود
export const updateLiquid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    
    // تحويل بعض الحقول من JSON إذا لزم
    if (typeof data.baseRatio === 'string') data.baseRatio = JSON.parse(data.baseRatio);
    if (typeof data.fruitTypes === 'string') data.fruitTypes = JSON.parse(data.fruitTypes);
    
    if (typeof data.flavorProfile === 'string') {
      try {
        data.flavorProfile = JSON.parse(data.flavorProfile);
      } catch (e) {
        console.error('Error parsing flavorProfile:', e);
      }
    }

    if (data.flavorProfile) {
      ['mentholLevel', 'sweetness', 'intensity', 'complexity'].forEach((k) => {
        const key = k as keyof typeof data.flavorProfile;
        if (typeof data.flavorProfile[key] === 'string') {
          data.flavorProfile[key] = Number(data.flavorProfile[key]);
        }
      });
    }
    if (typeof data.mixingInfo === 'string') {
      try {
        data.mixingInfo = JSON.parse(data.mixingInfo);
      } catch (e) {
        console.error('Error parsing mixingInfo:', e);
      }
    }
    if (typeof data.tags === 'string') {
      try {
        data.tags = JSON.parse(data.tags);
      } catch (e) {
        console.error('Error parsing tags:', e);
      }
    }
    
    // تحويل الحقول الرقمية من نص إلى رقم
    ['price','nicotineLevel','volume','mentholLevel','inStock'].forEach((field)=>{
      if (data[field]!==undefined) data[field] = Number(data[field]);
    });
    
    const liquid = await Liquid.findByIdAndUpdate(id, data, { new: true });
    
    if (!liquid) {
      return res.status(404).json({ success: false, message: 'Liquid not found' });
    }
    
    res.json({ success: true, liquid });
  } catch (error: any) {
    console.error('Error updating liquid:', error);
    res.status(500).json({ success: false, message: 'Error updating liquid', error: error?.message || 'Unknown error' });
  }
};

// حذف سائل
export const deleteLiquid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const liquid = await Liquid.findByIdAndDelete(id);
    
    if (!liquid) {
      return res.status(404).json({ success: false, message: 'Liquid not found' });
    }
    
    res.json({ success: true, message: 'Liquid deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting liquid:', error);
    res.status(500).json({ success: false, message: 'Error deleting liquid', error: error?.message || 'Unknown error' });
  }
};

// دالة مساعدة لحساب درجة التوافق بين سائلين
function calculateCompatibilityScore(targetAnalysis: any, liquidAnalysis: any): number {
  let score = 0;
  
  // تحليل التوافق في النكهات
  if (targetAnalysis.flavorProfile.primary === liquidAnalysis.flavorProfile.primary) {
    score += 30;
  }
  
  // تحليل التوافق في الحلاوة
  const sweetnessDiff = Math.abs(targetAnalysis.flavorProfile.sweetness - liquidAnalysis.flavorProfile.sweetness);
  if (sweetnessDiff <= 2) score += 20;
  else if (sweetnessDiff <= 4) score += 10;
  
  // تحليل التوافق في القوة
  const intensityDiff = Math.abs(targetAnalysis.flavorProfile.intensity - liquidAnalysis.flavorProfile.intensity);
  if (intensityDiff <= 2) score += 20;
  else if (intensityDiff <= 4) score += 10;
  
  // تحليل التوافق في المنثول
  const mentholDiff = Math.abs(targetAnalysis.flavorProfile.mentholLevel - liquidAnalysis.flavorProfile.mentholLevel);
  if (mentholDiff <= 1) score += 15;
  else if (mentholDiff <= 3) score += 8;
  
  // تحليل التوافق في الملف الكيميائي
  const vgDiff = Math.abs(targetAnalysis.chemicalProfile.vgRatio - liquidAnalysis.chemicalProfile.vgRatio);
  if (vgDiff <= 10) score += 10;
  else if (vgDiff <= 20) score += 5;
  
  // تحليل التوافق في مستوى النيكوتين
  const nicotineDiff = Math.abs(targetAnalysis.chemicalProfile.nicotineLevel - liquidAnalysis.chemicalProfile.nicotineLevel);
  if (nicotineDiff <= 3) score += 5;
  else if (nicotineDiff <= 6) score += 2;
  
  return Math.min(score, 100);
}

// دالة مساعدة لحساب الملف الشخصي المتوقع للخلطة
function calculateEstimatedMixProfile(analyzedLiquids: any[]) {
  const totalWeight = analyzedLiquids.length;
  
  let totalMenthol = 0;
  let totalSweetness = 0;
  let totalIntensity = 0;
  let totalComplexity = 0;
  let totalCreaminess = 0;
  let totalFruitiness = 0;
  let totalSpiciness = 0;
  let totalBitterness = 0;
  let totalAcidity = 0;
  
  analyzedLiquids.forEach(liquid => {
    const profile = liquid.analysis.flavorProfile;
    totalMenthol += profile.mentholLevel;
    totalSweetness += profile.sweetness;
    totalIntensity += profile.intensity;
    totalComplexity += profile.complexity;
    totalCreaminess += profile.creaminess || 0;
    totalFruitiness += profile.fruitiness || 0;
    totalSpiciness += profile.spiciness || 0;
    totalBitterness += profile.bitterness || 0;
    totalAcidity += profile.acidity || 0;
  });
  
  return {
    mentholLevel: Math.round((totalMenthol / totalWeight) * 10) / 10,
    sweetness: Math.round((totalSweetness / totalWeight) * 10) / 10,
    intensity: Math.round((totalIntensity / totalWeight) * 10) / 10,
    complexity: Math.round((totalComplexity / totalWeight) * 10) / 10,
    creaminess: Math.round((totalCreaminess / totalWeight) * 10) / 10,
    fruitiness: Math.round((totalFruitiness / totalWeight) * 10) / 10,
    spiciness: Math.round((totalSpiciness / totalWeight) * 10) / 10,
    bitterness: Math.round((totalBitterness / totalWeight) * 10) / 10,
    acidity: Math.round((totalAcidity / totalWeight) * 10) / 10
  };
}

// دالة مساعدة لتوليد توصيات الخلط
function generateMixRecommendations(analyzedLiquids: any[], compatibilityAnalysis: any) {
  const recommendations = [];
  
  if (compatibilityAnalysis.compatibility === 'excellent') {
    recommendations.push('خلطة ممتازة ومتوافقة تماماً');
  } else if (compatibilityAnalysis.compatibility === 'good') {
    recommendations.push('خلطة جيدة ومتوافقة');
  } else if (compatibilityAnalysis.compatibility === 'fair') {
    recommendations.push('خلطة متوسطة التوافق، قد تحتاج إلى تعديل');
  } else {
    recommendations.push('خلطة ضعيفة التوافق، يفضل إعادة النظر في المكونات');
  }
  
  // تحليل الخصائص
  const hasIntense = analyzedLiquids.some(l => l.analysis.flavorProfile.primary === 'intense');
  const hasFresh = analyzedLiquids.some(l => l.analysis.flavorProfile.primary === 'fresh');
  const hasCreamy = analyzedLiquids.some(l => l.analysis.flavorProfile.primary === 'creamy');
  
  if (hasIntense && hasFresh) {
    recommendations.push('مزيج من النكهات القوية والمنعشة - متوازن');
  }
  
  if (hasCreamy && hasFresh) {
    recommendations.push('مزيج من النكهات الكريمية والمنعشة - متناغم');
  }
  
  return recommendations;
} 