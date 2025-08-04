// Smart Translation Service
// This service provides intelligent translation capabilities

interface TranslationCache {
  [key: string]: string;
}

// Simple translation cache to avoid repeated API calls
const translationCache: TranslationCache = {};

// Basic translation mappings for common vape terms
const vapeTermsTranslations: { [key: string]: { ar: string; fr: string; en: string } } = {
  // Product names
  'vape': { ar: 'فايب', fr: 'vapoteuse', en: 'vape' },
  'kit': { ar: 'كيت', fr: 'kit', en: 'kit' },
  'box': { ar: 'بوكس', fr: 'boîte', en: 'box' },
  'mod': { ar: 'مود', fr: 'mod', en: 'mod' },
  'atomizer': { ar: 'أتومايزر', fr: 'atomiseur', en: 'atomizer' },
  'tank': { ar: 'تانك', fr: 'réservoir', en: 'tank' },
  'coil': { ar: 'كويل', fr: 'résistance', en: 'coil' },
  'battery': { ar: 'بطارية', fr: 'batterie', en: 'battery' },
  'liquid': { ar: 'سائل', fr: 'liquide', en: 'liquid' },
  'flavor': { ar: 'نكهة', fr: 'saveur', en: 'flavor' },
  'nicotine': { ar: 'نيكوتين', fr: 'nicotine', en: 'nicotine' },
  
  // Conditions
  'excellent': { ar: 'ممتاز', fr: 'excellent', en: 'excellent' },
  'good': { ar: 'جيد', fr: 'bon', en: 'good' },
  'fair': { ar: 'مقبول', fr: 'correct', en: 'fair' },
  'new': { ar: 'جديد', fr: 'nouveau', en: 'new' },
  'used': { ar: 'مستعمل', fr: 'utilisé', en: 'used' },
  
  // Status
  'available': { ar: 'متوفر', fr: 'disponible', en: 'available' },
  'sold': { ar: 'تم البيع', fr: 'vendu', en: 'sold' },
  'reserved': { ar: 'محجوز', fr: 'réservé', en: 'reserved' },
  
  // Common descriptions
  'complete': { ar: 'كامل', fr: 'complet', en: 'complete' },
  'barely used': { ar: 'مستعمل قليلاً', fr: 'peu utilisé', en: 'barely used' },
  'great condition': { ar: 'حالة ممتازة', fr: 'excellent état', en: 'great condition' },
  'like new': { ar: 'كالجديد', fr: 'comme neuf', en: 'like new' },
  'waterproof': { ar: 'مقاوم للماء', fr: 'étanche', en: 'waterproof' },
  'shockproof': { ar: 'مقاوم للصدمات', fr: 'antichoc', en: 'shockproof' },
  'high quality': { ar: 'عالي الجودة', fr: 'haute qualité', en: 'high quality' },
  'premium': { ar: 'بريميوم', fr: 'premium', en: 'premium' },
  'advanced features': { ar: 'ميزات متقدمة', fr: 'fonctionnalités avancées', en: 'advanced features' },
  'latest generation': { ar: 'الجيل الأحدث', fr: 'dernière génération', en: 'latest generation' },
  'mesh coils': { ar: 'كويلات شبكية', fr: 'résistances mesh', en: 'mesh coils' },
  'top fill': { ar: 'ملء علوي', fr: 'remplissage par le haut', en: 'top fill' },
  'sub ohm': { ar: 'سب أوم', fr: 'sub ohm', en: 'sub ohm' },
  'excellent flavor': { ar: 'نكهة ممتازة', fr: 'saveur excellente', en: 'excellent flavor' },
  
  // Brands (keep original but add context)
  'SMOK': { ar: 'سموك', fr: 'SMOK', en: 'SMOK' },
  'GeekVape': { ar: 'جيك فايب', fr: 'GeekVape', en: 'GeekVape' },
  'Aspire': { ar: 'أسباير', fr: 'Aspire', en: 'Aspire' },
  'Voopoo': { ar: 'فوبو', fr: 'Voopoo', en: 'Voopoo' },
  'Lost Vape': { ar: 'لوست فايب', fr: 'Lost Vape', en: 'Lost Vape' },
  'Uwell': { ar: 'يوويل', fr: 'Uwell', en: 'Uwell' }
};

// Smart translation function
export const translateText = async (text: string, targetLanguage: 'ar' | 'fr' | 'en'): Promise<string> => {
  if (!text || !text.trim()) {
    return text;
  }

  const cacheKey = `${text}_${targetLanguage}`;
  
  // Check cache first
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    // Smart translation using predefined terms
    let translatedText = smartTranslate(text, targetLanguage);
    
    // Cache the result
    translationCache[cacheKey] = translatedText;
    
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};

// Smart translation using predefined mappings and patterns
function smartTranslate(text: string, targetLanguage: 'ar' | 'fr' | 'en'): string {
  let result = text.toLowerCase();
  
  // Replace known terms
  for (const [term, translations] of Object.entries(vapeTermsTranslations)) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    result = result.replace(regex, translations[targetLanguage]);
  }
  
  // Handle numbers and units
  result = result.replace(/(\d+)w/gi, '$1 واط');
  result = result.replace(/(\d+)ml/gi, '$1 مل');
  result = result.replace(/(\d+)mah/gi, '$1 مللي أمبير');
  
  // Handle common patterns
  if (targetLanguage === 'ar') {
    result = handleArabicPatterns(result);
  } else if (targetLanguage === 'fr') {
    result = handleFrenchPatterns(result);
  }
  
  // Capitalize first letter
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function handleArabicPatterns(text: string): string {
  // Handle common English to Arabic patterns
  text = text.replace(/with/gi, 'مع');
  text = text.replace(/and/gi, 'و');
  text = text.replace(/for/gi, 'لـ');
  text = text.replace(/the/gi, '');
  text = text.replace(/a /gi, '');
  text = text.replace(/an /gi, '');
  
  return text.trim();
}

function handleFrenchPatterns(text: string): string {
  // Handle common English to French patterns
  text = text.replace(/with/gi, 'avec');
  text = text.replace(/and/gi, 'et');
  text = text.replace(/for/gi, 'pour');
  text = text.replace(/the/gi, 'le');
  
  return text.trim();
}

// Batch translation for multiple texts
export const translateBatch = async (
  texts: string[], 
  targetLanguage: 'ar' | 'fr' | 'en'
): Promise<string[]> => {
  const promises = texts.map(text => translateText(text, targetLanguage));
  return Promise.all(promises);
};

// Auto-detect missing translations and translate them
export const autoTranslateObject = async (
  obj: any, 
  baseLanguage: 'ar' | 'fr' | 'en' = 'en'
): Promise<any> => {
  const result = { ...obj };
  
  // Define field mappings
  const fieldMappings = {
    name: ['nameAr', 'nameFr'],
    description: ['descriptionAr', 'descriptionFr']
  };
  
  for (const [baseField, translatedFields] of Object.entries(fieldMappings)) {
    if (result[baseField]) {
      // Translate to Arabic if missing
      if (!result[translatedFields[0]]) {
        result[translatedFields[0]] = await translateText(result[baseField], 'ar');
      }
      // Translate to French if missing
      if (!result[translatedFields[1]]) {
        result[translatedFields[1]] = await translateText(result[baseField], 'fr');
      }
    }
  }
  
  return result;
};

// Get translation statistics
export const getTranslationStats = () => {
  return {
    cacheSize: Object.keys(translationCache).length,
    availableTerms: Object.keys(vapeTermsTranslations).length,
    supportedLanguages: ['ar', 'fr', 'en']
  };
};

// Clear translation cache
export const clearTranslationCache = () => {
  Object.keys(translationCache).forEach(key => {
    delete translationCache[key];
  });
};
