import { Request, Response } from 'express';
import { Translation } from '../models/translation.model';

// خدمة الترجمة الذكية المبسطة للـ backend
class SmartTranslationService {
  private cache = new Map<string, any>();

  async translateText(text: string, targetLanguage: 'en' | 'fr', sourceLanguage: 'ar' = 'ar'): Promise<string> {
    try {
      const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey)[targetLanguage];
      }

      if (!text || text.trim() === '') {
        return '';
      }

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
        this.cache.set(cacheKey, translation);
        return translation[targetLanguage] || text;
      }

      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  async translateProduct(product: any, targetLanguage: 'en' | 'fr'): Promise<any> {
    const translatedProduct = { ...product };
    
    if (product.name) {
      translatedProduct.name = await this.translateText(product.name, targetLanguage);
    }
    
    if (product.description) {
      translatedProduct.description = await this.translateText(product.description, targetLanguage);
    }
    
    if (product.category) {
      translatedProduct.category = await this.translateText(product.category, targetLanguage);
    }
    
    return translatedProduct;
  }

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

  async translateLiquid(liquid: any, targetLanguage: 'en' | 'fr'): Promise<any> {
    const translatedLiquid = { ...liquid };
    
    if (liquid.name) {
      translatedLiquid.name = await this.translateText(liquid.name, targetLanguage);
    }
    
    if (liquid.description) {
      translatedLiquid.description = await this.translateText(liquid.description, targetLanguage);
    }
    
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
}

const smartTranslationService = new SmartTranslationService();

// جلب جميع الترجمات
export const getTranslations = async (req: Request, res: Response) => {
  try {
    const translations = await Translation.find().sort({ createdAt: -1 });
    res.json(translations);
  } catch (error: any) {
    console.error('Error fetching translations:', error);
    res.status(500).json({ message: 'Error fetching translations', error: error?.message || 'Unknown error' });
  }
};

// جلب ترجمة واحدة
export const getTranslation = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const translation = await Translation.findOne({ key });
    
    if (!translation) {
      return res.status(404).json({ message: 'Translation not found' });
    }
    
    res.json(translation);
  } catch (error: any) {
    console.error('Error fetching translation:', error);
    res.status(500).json({ message: 'Error fetching translation', error: error?.message || 'Unknown error' });
  }
};

// إنشاء ترجمة جديدة
export const createTranslation = async (req: Request, res: Response) => {
  try {
    const { key, translations, context, category } = req.body;
    
    // التحقق من وجود ترجمة بنفس المفتاح
    const existingTranslation = await Translation.findOne({ key });
    if (existingTranslation) {
      return res.status(400).json({ message: 'Translation with this key already exists' });
    }
    
    const translation = new Translation({
      key,
      translations,
      context,
      category
    });
    
    await translation.save();
    res.status(201).json(translation);
  } catch (error: any) {
    console.error('Error creating translation:', error);
    res.status(500).json({ message: 'Error creating translation', error: error?.message || 'Unknown error' });
  }
};

// تحديث ترجمة
export const updateTranslation = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { translations, context, category } = req.body;
    
    const translation = await Translation.findOneAndUpdate(
      { key },
      { translations, context, category },
      { new: true, runValidators: true }
    );
    
    if (!translation) {
      return res.status(404).json({ message: 'Translation not found' });
    }
    
    res.json(translation);
  } catch (error: any) {
    console.error('Error updating translation:', error);
    res.status(500).json({ message: 'Error updating translation', error: error?.message || 'Unknown error' });
  }
};

// حذف ترجمة
export const deleteTranslation = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const translation = await Translation.findOneAndDelete({ key });
    
    if (!translation) {
      return res.status(404).json({ message: 'Translation not found' });
    }
    
    res.json({ message: 'Translation deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting translation:', error);
    res.status(500).json({ message: 'Error deleting translation', error: error?.message || 'Unknown error' });
  }
};

// ترجمة ذكية للنص
export const translateText = async (req: Request, res: Response) => {
  try {
    const { text, targetLanguage, sourceLanguage = 'ar' } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ message: 'Text and target language are required' });
    }
    
    const translatedText = await smartTranslationService.translateText(text, targetLanguage, sourceLanguage);
    res.json({ originalText: text, translatedText, targetLanguage });
  } catch (error: any) {
    console.error('Error translating text:', error);
    res.status(500).json({ message: 'Error translating text', error: error?.message || 'Unknown error' });
  }
};

// ترجمة ذكية للمنتج
export const translateProduct = async (req: Request, res: Response) => {
  try {
    const { product, targetLanguage } = req.body;
    
    if (!product || !targetLanguage) {
      return res.status(400).json({ message: 'Product and target language are required' });
    }
    
    const translatedProduct = await smartTranslationService.translateProduct(product, targetLanguage);
    res.json(translatedProduct);
  } catch (error: any) {
    console.error('Error translating product:', error);
    res.status(500).json({ message: 'Error translating product', error: error?.message || 'Unknown error' });
  }
};

// ترجمة ذكية للمتجر
export const translateStore = async (req: Request, res: Response) => {
  try {
    const { store, targetLanguage } = req.body;
    
    if (!store || !targetLanguage) {
      return res.status(400).json({ message: 'Store and target language are required' });
    }
    
    const translatedStore = await smartTranslationService.translateStore(store, targetLanguage);
    res.json(translatedStore);
  } catch (error: any) {
    console.error('Error translating store:', error);
    res.status(500).json({ message: 'Error translating store', error: error?.message || 'Unknown error' });
  }
};

// ترجمة ذكية للسائل
export const translateLiquid = async (req: Request, res: Response) => {
  try {
    const { liquid, targetLanguage } = req.body;
    
    if (!liquid || !targetLanguage) {
      return res.status(400).json({ message: 'Liquid and target language are required' });
    }
    
    const translatedLiquid = await smartTranslationService.translateLiquid(liquid, targetLanguage);
    res.json(translatedLiquid);
  } catch (error: any) {
    console.error('Error translating liquid:', error);
    res.status(500).json({ message: 'Error translating liquid', error: error?.message || 'Unknown error' });
  }
};

// البحث في الترجمات
export const searchTranslations = async (req: Request, res: Response) => {
  try {
    const { query, context, category } = req.query;
    
    let searchFilter: any = {};
    
    if (query) {
      searchFilter.$or = [
        { key: { $regex: query, $options: 'i' } },
        { 'translations.ar': { $regex: query, $options: 'i' } },
        { 'translations.en': { $regex: query, $options: 'i' } },
        { 'translations.fr': { $regex: query, $options: 'i' } }
      ];
    }
    
    if (context) {
      searchFilter.context = context;
    }
    
    if (category) {
      searchFilter.category = category;
    }
    
    const translations = await Translation.find(searchFilter).sort({ createdAt: -1 });
    res.json(translations);
  } catch (error: any) {
    console.error('Error searching translations:', error);
    res.status(500).json({ message: 'Error searching translations', error: error?.message || 'Unknown error' });
  }
}; 