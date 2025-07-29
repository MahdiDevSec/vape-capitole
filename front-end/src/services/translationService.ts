import axios from 'axios';

// أنواع البيانات
export interface TranslationData {
  ar: string;
  en: string;
  fr: string;
}

export interface SmartTranslation {
  key: string;
  translations: TranslationData;
  context?: string;
  category?: string;
}

// خدمة الترجمة الذكية
class SmartTranslationService {
  private cache = new Map<string, TranslationData>();
  private apiKey = 'your-translation-api-key'; // يمكن إضافة مفتاح API للترجمة

  // ترجمة ذكية للنص
  async translateText(text: string, targetLanguage: 'en' | 'fr', sourceLanguage: 'ar' = 'ar'): Promise<string> {
    try {
      // التحقق من الكاش أولاً
      const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey)![targetLanguage];
      }

      // إذا كان النص فارغاً
      if (!text || text.trim() === '') {
        return '';
      }

      // ترجمة بسيطة للكلمات الشائعة
      const commonTranslations = this.getCommonTranslations();
      const commonKey = text.toLowerCase().trim();
      
      if (commonTranslations[commonKey]) {
        const translation = commonTranslations[commonKey][targetLanguage];
        this.cache.set(cacheKey, commonTranslations[commonKey]);
        return translation;
      }

      // استخدام API للترجمة (يمكن إضافة خدمة ترجمة حقيقية)
      const translation = await this.translateWithAPI(text, targetLanguage, sourceLanguage);
      
      // حفظ في الكاش
      const translationData: TranslationData = {
        ar: sourceLanguage === 'ar' ? text : '',
        en: targetLanguage === 'en' ? translation : '',
        fr: targetLanguage === 'fr' ? translation : ''
      };
      
      this.cache.set(cacheKey, translationData);
      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // إرجاع النص الأصلي في حالة الخطأ
    }
  }

  // ترجمة ذكية للمنتجات والسوائل
  async translateProduct(product: any, targetLanguage: 'en' | 'fr'): Promise<any> {
    const translatedProduct = { ...product };
    
    // ترجمة اسم المنتج
    if (product.name) {
      translatedProduct.name = await this.translateText(product.name, targetLanguage);
    }
    
    // ترجمة وصف المنتج
    if (product.description) {
      translatedProduct.description = await this.translateText(product.description, targetLanguage);
    }
    
    // ترجمة الفئة
    if (product.category) {
      translatedProduct.category = await this.translateText(product.category, targetLanguage);
    }
    
    return translatedProduct;
  }

  // ترجمة ذكية للمتجر
  async translateStore(store: any, targetLanguage: 'en' | 'fr'): Promise<any> {
    const translatedStore = { ...store };
    
    if (store.name) {
      translatedStore.name = await this.translateText(store.name, targetLanguage);
    }
    
    if (store.location) {
      translatedStore.location = await this.translateText(store.location, targetLanguage);
    }
    
    if (store.workingHours) {
      translatedStore.workingHours = await this.translateText(store.workingHours, targetLanguage);
    }
    
    return translatedStore;
  }

  // ترجمة ذكية للسوائل
  async translateLiquid(liquid: any, targetLanguage: 'en' | 'fr'): Promise<any> {
    const translatedLiquid = { ...liquid };
    
    if (liquid.name) {
      translatedLiquid.name = await this.translateText(liquid.name, targetLanguage);
    }
    
    if (liquid.description) {
      translatedLiquid.description = await this.translateText(liquid.description, targetLanguage);
    }
    
    // ترجمة النكهات
    if (liquid.flavors && Array.isArray(liquid.flavors)) {
      translatedLiquid.flavors = await Promise.all(
        liquid.flavors.map(async (flavor: any) => ({
          ...flavor,
          name: await this.translateText(flavor.name, targetLanguage),
          category: await this.translateText(flavor.category, targetLanguage)
        }))
      );
    }
    
    return translatedLiquid;
  }

  // الترجمة باستخدام API (محاكاة)
  private async translateWithAPI(text: string, targetLanguage: 'en' | 'fr', sourceLanguage: 'ar'): Promise<string> {
    // هنا يمكن إضافة خدمة ترجمة حقيقية مثل Google Translate API
    // حالياً نستخدم ترجمة بسيطة للكلمات الشائعة
    
    const simpleTranslations: Record<string, Record<string, string>> = {
      'جهاز فايب متكامل': { en: 'Complete Vape Device', fr: 'Appareil Vape Complet' },
      'جهاز الفايب': { en: 'Vape Box', fr: 'Vape Box' },
      'الخزان': { en: 'Atomizer', fr: 'Atomizer' },
      'بطاريات الفايب': { en: 'Vape Batteries', fr: 'Batteries Vape' },
      'إكسسوارات الفايب': { en: 'Vape Accessories', fr: 'Accessoires Vape' },
      'القطن': { en: 'Cotton', fr: 'Coton' },
      'الكويل': { en: 'Coils', fr: 'Bobines' },
      'المقاومات': { en: 'Resistors', fr: 'Résistances' },
      'متوفر': { en: 'Available', fr: 'Disponible' },
      'غير متوفر': { en: 'Not Available', fr: 'Non Disponible' },
      'إضافة إلى السلة': { en: 'Add to Cart', fr: 'Ajouter au Panier' },
      'السعر': { en: 'Price', fr: 'Prix' },
      'العنوان': { en: 'Address', fr: 'Adresse' },
      'رقم الهاتف': { en: 'Phone Number', fr: 'Numéro de Téléphone' },
      'ساعات العمل': { en: 'Working Hours', fr: 'Heures de Travail' }
    };

    const translation = simpleTranslations[text];
    if (translation) {
      return translation[targetLanguage] || text;
    }

    // إذا لم نجد ترجمة، نعيد النص الأصلي
    return text;
  }

  // الترجمة الشائعة
  private getCommonTranslations(): Record<string, TranslationData> {
    return {
      'جهاز فايب متكامل': { ar: 'جهاز فايب متكامل', en: 'Complete Vape Device', fr: 'Appareil Vape Complet' },
      'جهاز الفايب': { ar: 'جهاز الفايب', en: 'Vape Box', fr: 'Vape Box' },
      'الخزان': { ar: 'الخزان', en: 'Atomizer', fr: 'Atomizer' },
      'بطاريات الفايب': { ar: 'بطاريات الفايب', en: 'Vape Batteries', fr: 'Batteries Vape' },
      'إكسسوارات الفايب': { ar: 'إكسسوارات الفايب', en: 'Vape Accessories', fr: 'Accessoires Vape' },
      'القطن': { ar: 'القطن', en: 'Cotton', fr: 'Coton' },
      'الكويل': { ar: 'الكويل', en: 'Coils', fr: 'Bobines' },
      'المقاومات': { ar: 'المقاومات', en: 'Resistors', fr: 'Résistances' },
      'متوفر': { ar: 'متوفر', en: 'Available', fr: 'Disponible' },
      'غير متوفر': { ar: 'غير متوفر', en: 'Not Available', fr: 'Non Disponible' },
      'إضافة إلى السلة': { ar: 'إضافة إلى السلة', en: 'Add to Cart', fr: 'Ajouter au Panier' },
      'السعر': { ar: 'السعر', en: 'Price', fr: 'Prix' },
      'العنوان': { ar: 'العنوان', en: 'Address', fr: 'Adresse' },
      'رقم الهاتف': { ar: 'رقم الهاتف', en: 'Phone Number', fr: 'Numéro de Téléphone' },
      'ساعات العمل': { ar: 'ساعات العمل', en: 'Working Hours', fr: 'Heures de Travail' }
    };
  }

  // حفظ ترجمة جديدة
  async saveTranslation(key: string, translations: TranslationData, context?: string): Promise<void> {
    try {
      // حفظ في قاعدة البيانات
      await axios.post('/api/translations', {
        key,
        translations,
        context,
        createdAt: new Date()
      });
      
      // تحديث الكاش
      this.cache.set(key, translations);
    } catch (error) {
      console.error('Error saving translation:', error);
    }
  }

  // جلب ترجمة من قاعدة البيانات
  async getTranslation(key: string): Promise<TranslationData | null> {
    try {
      const response = await axios.get(`/api/translations/${key}`);
      return response.data;
    } catch (error) {
      console.error('Error getting translation:', error);
      return null;
    }
  }

  // مسح الكاش
  clearCache(): void {
    this.cache.clear();
  }
}

export const smartTranslationService = new SmartTranslationService(); 