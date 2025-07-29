# نظام الترجمة الذكية المتكامل - Vape Capitole

## نظرة عامة

تم تطوير نظام ترجمة ذكي متكامل لموقع Vape Capitole يدعم ثلاث لغات (العربية، الإنجليزية، الفرنسية) مع تحسينات شاملة للأداء.

## الميزات الرئيسية

### 🌐 نظام الترجمة الذكية
- **ترجمة تلقائية** للنصوص الجديدة
- **نظام كاش** للترجمات المتكررة
- **حفظ الترجمات** في قاعدة البيانات
- **دعم متعدد اللغات** (عربي، إنجليزي، فرنسي)
- **ترجمة ذكية** للمنتجات والمتاجر والسوائل

### ⚡ تحسينات الأداء
- **تحسين الكاش** مع انتهاء صلاحية
- **تحميل تدريجي** للبيانات
- **تحسين الصور** مع lazy loading
- **تحسين البحث** مع debounce و throttle
- **تحسين الشبكة** مع إعادة المحاولة
- **تحسين التخزين المحلي** مع تنظيف دوري

### 🎯 واجهة المستخدم
- **تصميم متجاوب** لجميع الأجهزة
- **دعم RTL/LTR** حسب اللغة
- **أيقونات واضحة** لكل قسم
- **تنقل سلس** بين الصفحات

## البنية التقنية

### Frontend (React + TypeScript)

#### ملفات الترجمة
```
front-end/src/contexts/LanguageContext.tsx
├── translations object
│   ├── ar (العربية)
│   ├── en (English)
│   └── fr (Français)
└── Smart translation functions
```

#### خدمة الترجمة الذكية
```
front-end/src/services/translationService.ts
├── SmartTranslationService class
├── translateText()
├── translateProduct()
├── translateStore()
├── translateLiquid()
└── Cache management
```

#### أدوات تحسين الأداء
```
front-end/src/utils/performance.ts
├── PerformanceCache
├── debounce & throttle
├── lazyLoad
├── memoize
├── searchOptimizer
├── storageOptimizer
└── networkOptimizer
```

### Backend (Node.js + Express + MongoDB)

#### نموذج الترجمة
```
back-end/src/models/translation.model.ts
├── Translation schema
├── Indexes for performance
└── Timestamps
```

#### Controller الترجمة
```
back-end/src/controllers/translation.controller.ts
├── CRUD operations
├── Smart translation
├── Search functionality
└── Error handling
```

#### Routes الترجمة
```
back-end/src/routes/translation.routes.ts
├── Admin routes (protected)
├── Public translation routes
└── Validation middleware
```

## الاستخدام

### إضافة ترجمة جديدة

#### في Frontend
```typescript
import { useLanguage } from '../contexts/LanguageContext';

const { t, translateText } = useLanguage();

// استخدام الترجمة الثابتة
const title = t('home.title');

// ترجمة ذكية للنص
const translatedText = await translateText('نص عربي');
```

#### في Backend
```typescript
import { smartTranslationService } from '../services/translationService';

// ترجمة منتج
const translatedProduct = await smartTranslationService.translateProduct(product, 'en');

// ترجمة متجر
const translatedStore = await smartTranslationService.translateStore(store, 'fr');
```

### إدارة الترجمات (للأدمن)

1. **الوصول إلى صفحة الترجمات**: `/admin/translations`
2. **إضافة ترجمة جديدة**:
   - Key: مفتاح الترجمة
   - Arabic: النص العربي
   - English: النص الإنجليزي
   - French: النص الفرنسي
   - Context: سياق الترجمة (اختياري)
   - Category: فئة الترجمة (اختياري)

3. **البحث في الترجمات**:
   - البحث بالكلمات المفتاحية
   - تصفية حسب السياق
   - تصفية حسب الفئة

4. **تعديل وحذف الترجمات**:
   - تعديل الترجمات الموجودة
   - حذف الترجمات غير المستخدمة

## التحسينات المطبقة

### 1. تحسين الأداء
- **كاش ذكي** للترجمات مع TTL
- **تحميل تدريجي** للمنتجات
- **تحسين الصور** مع lazy loading
- **تحسين البحث** مع debounce
- **تنظيف دوري** للتخزين المحلي

### 2. تحسين الشبكة
- **إعادة المحاولة** للطلبات الفاشلة
- **تحميل متوازي** مع حد أقصى
- **ضغط البيانات** للاستجابة السريعة

### 3. تحسين الذاكرة
- **تنظيف الكاش** تلقائياً
- **تحسين التخزين المحلي** مع انتهاء الصلاحية
- **إدارة الذاكرة** الفعالة

## الترجمات المتوفرة

### التنقل
- الرئيسية، المنتجات، المتاجر، المفضلة، النكهات، الخلط الذكي

### الفئات
- جهاز فايب متكامل، جهاز الفايب، الخزان، Pyrex، بطاريات الفايب، إكسسوارات الفايب، القطن، الكويل، المقاومات

### المنتجات
- إضافة إلى السلة، متوفر، غير متوفر، السعر، المخزون، الوصف، الفئة

### المتاجر
- العنوان، رقم الهاتف، ساعات العمل، الموقع، التواصل، الاتجاهات

### الصفحة الرئيسية
- مرحباً بك في Vape Capitole، كل ما تحتاجه للفيب في مكان واحد، فروعنا، اكتشف مجموعتنا الواسعة

### التذييل
- متجر الفيب، روابط سريعة، تواصل معنا، النشرة الإخبارية، جميع الحقوق محفوظة

### السوائل والخلط
- النكهات والسوائل، خلطة مخصصة، امزج بنفسك، أنشئ خلطتك، اختر النكهات

### النظام الذكي
- النظام الذكي لخلط السوائل، الاقتراحات الذكية، الخلط المخصص، أخبرنا ماذا تريد أن تتذوق

### الأدمن
- لوحة التحكم، المنتجات، المتاجر، المستخدمين، الطلبات، الترجمات، الإعدادات

### السلة والمفضلة
- سلة التسوق، سلة التسوق فارغة، الكمية، الإجمالي، إتمام الشراء

### عام
- جاري التحميل، خطأ، نجح، إلغاء، حفظ، تعديل، حذف، إضافة، بحث، تصفية، ترتيب

## API Endpoints

### الترجمات (للأدمن)
```
GET    /api/translations/translations     # جلب جميع الترجمات
GET    /api/translations/translations/:key # جلب ترجمة واحدة
POST   /api/translations/translations     # إنشاء ترجمة جديدة
PUT    /api/translations/translations/:key # تحديث ترجمة
DELETE /api/translations/translations/:key # حذف ترجمة
GET    /api/translations/translations/search # البحث في الترجمات
```

### الترجمة الذكية (للجميع)
```
POST   /api/translations/translate/text   # ترجمة نص
POST   /api/translations/translate/product # ترجمة منتج
POST   /api/translations/translate/store  # ترجمة متجر
POST   /api/translations/translate/liquid # ترجمة سائل
```

## التثبيت والتشغيل

### المتطلبات
- Node.js 16+
- MongoDB 4.4+
- npm أو yarn

### التثبيت
```bash
# تثبيت dependencies
npm install

# تشغيل Backend
cd back-end
npm run dev

# تشغيل Frontend
cd front-end
npm run dev
```

### متغيرات البيئة
```env
# Backend
MONGODB_URI=mongodb://localhost:27017/vape-capitole
PORT=5000
JWT_SECRET=your-jwt-secret

# Frontend
VITE_API_URL=http://localhost:5000/api
```

## الصيانة والتطوير

### إضافة ترجمات جديدة
1. إضافة المفاتيح في `LanguageContext.tsx`
2. إضافة الترجمات للغات الثلاث
3. استخدام `t('key')` في المكونات

### تحسين الأداء
1. مراقبة استخدام الكاش
2. تنظيف الترجمات غير المستخدمة
3. تحسين استعلامات قاعدة البيانات

### الأمان
1. حماية routes الأدمن
2. التحقق من صحة البيانات
3. Rate limiting للـ API

## الدعم والمساعدة

للاستفسارات أو المشاكل التقنية، يرجى التواصل مع فريق التطوير.

---

**تم تطوير هذا النظام بواسطة فريق Vape Capitole** 🚀 