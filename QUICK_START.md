# 🚀 دليل التشغيل السريع - النظام الذكي لخلط السوائل

## 📋 المتطلبات الأساسية
- Node.js (v16 أو أحدث)
- MongoDB
- npm أو yarn

## ⚡ التشغيل السريع

### 1. إعداد قاعدة البيانات
```bash
# تأكد من تشغيل MongoDB
mongod
```

### 2. إعداد Backend
```bash
cd back-end
npm install
cp .env.example .env  # إذا لم يكن موجود
# عدل ملف .env بإعدادات قاعدة البيانات
npm run dev
```

### 3. إضافة بيانات السوائل
```bash
# في terminal جديد
cd back-end
npm run seed:liquids
```

### 4. إعداد Frontend
```bash
cd front-end
npm install
npm run dev
```

### 5. الوصول للنظام
- **الواجهة الرئيسية**: http://localhost:3000
- **صفحة السوائل**: http://localhost:3000/liquids
- **النظام الذكي**: http://localhost:3000/mix
- **لوحة الإدارة**: http://localhost:3000/admin

## 🧪 اختبار النظام

### اختبار الاقتراحات الذكية
1. اذهب إلى http://localhost:3000/mix
2. اختر "Smart Suggestions"
3. أدخل رغباتك (نكهة، منثول، حلاوة، تعقيد)
4. اضغط "Get Suggestions"
5. راجع الاقتراحات المعروضة

### اختبار الخلط المخصص
1. اذهب إلى http://localhost:3000/mix
2. اختر "Custom Mix"
3. أضف سوائل مع نسب مئوية
4. تأكد أن المجموع = 100%
5. اضغط "Analyze Mix"
6. راجع التحليل والتحذيرات

## 🔧 استكشاف الأخطاء

### مشكلة الاتصال بقاعدة البيانات
```bash
# تأكد من تشغيل MongoDB
sudo systemctl status mongod
# أو
brew services list | grep mongodb
```

### مشكلة في Backend
```bash
cd back-end
npm run build
npm start
```

### مشكلة في Frontend
```bash
cd front-end
rm -rf node_modules
npm install
npm run dev
```

## 📞 المساعدة
- راجع `SMART_SYSTEM_README.md` للتفاصيل الكاملة
- تحقق من logs في terminal
- تأكد من إعدادات .env

---
**النظام جاهز للاستخدام! 🎉** 