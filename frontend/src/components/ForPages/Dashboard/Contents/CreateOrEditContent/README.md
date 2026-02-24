# CreateOrEditContent Refactoring Summary

## Overview
تم إعادة تنظيم و تحسين ملف `CreateOrEditContent.jsx` من **1,621 سطر** إلى **~220 سطر** (تقليل **86%**)

## Structure

### المجلد الرئيسي
```
Contents/CreateOrEditContent/
├── CreateOrEditContent.jsx      (220 سطر - العنصر الرئيسي)
├── AttachmentsModal.jsx          (مكون اختيار الملفات)
└── components/
    ├── index.js                  (تصدير جميع المكونات)
    ├── BasicDetailsSection.jsx    (العنوان، العنوان الفرعي، الحالة، وقت القراءة)
    ├── SelectFieldsSection.jsx    (اللغة، الدولة)
    ├── WriterSelectionDropdown.jsx (اختيار الكاتب مع البحث)
    ├── CategorySelectionDropdown.jsx (اختيار الفئة مع البحث)
    ├── TagsSection.jsx            (إدارة الوسوم)
    ├── ImagesUploadSection.jsx    (تحميل الصور المتعددة)
    ├── AttachmentsSection.jsx     (إدارة الملفات المرفقة)
    ├── BodyContentSection.jsx     (محرر CKEditor)
    ├── MetadataSection.jsx        (البيانات الوصفية)
    ├── FormActionsSection.jsx     (أزرار الحفظ والإلغاء)
    └── FilePreviewModal.jsx       (عرض معاينة الملفات)
```

### المشاركة المركزية (_common folder)
```
Dashboard/_common/
├── hooks/
│   ├── usePostForm.js           (إدارة حالة نموذج المنشور - 377 سطر)
│   └── useContentForm.js        (إدارة حالة نموذج المحتوى - 430+ سطر)
└── utils/
    ├── postForm/
    │   ├── constants.js         (ثوابت نموذج المنشور)
    │   └── validation.js        (دوال التحقق من صحة المنشور)
    ├── contentForm/
    │   ├── constants.js         (ثوابت نموذج المحتوى)
    │   └── validation.js        (دوال التحقق من صحة المحتوى)
    └── shared/
        └── ckeditorAdapter.js   (محول Base64 لـ CKEditor)
```

## الميزات الرئيسية

### 1. إدارة حالة مركزية
- **useContentForm Hook** يدير جميع حالات النموذج والمتغيرات
- إزالة 50+ متغير حالة من المكون الرئيسي
- دوال معالجة منظمة وسهلة الصيانة

### 2. دعم الصور المتعددة
```javascript
// تحميل ملفات الصور
imageFiles: []          // ملفات جديدة
imagePreviews: []       // معاينات الصور
formData.images: []     // الصور الموجودة من الـ Backend
formData.images_url: [] // روابط الصور الخارجية
```

### 3. نظام الملفات المرفقة
- دعم تحميل ملفات PDF و Word و PowerPoint
- معاينة الملفات قبل الحفظ
- إدارة الملفات المرفقة المختارة

### 4. التحقق من صحة النموذج
- التحقق من أن يوجد صورة واحدة على الأقل
- التحقق من جميع الحقول المطلوبة
- رسائل خطأ واضحة ومترجمة

### 5. دعم التعديل والإنشاء
- الكشف عن التغييرات في النموذج عند التعديل
- تعطيل زر الحفظ إذا لم تكن هناك تغييرات
- الحفاظ على البيانات الأصلية للمقارنة

## المحسنات

### أداء الأداء
- تقليل حجم الملف بنسبة 86%
- فصل المنطق عن العرض
- إعادة استخدام المكونات الفرعية

### سهولة الصيانة
- كل مكون يتعامل مع جزء محدد من النموذج
- تجميع الوظائف ذات الصلة في ملفات منفصلة
- مشاركة المنطق المشترك في hooks و utils

### تجربة المستخدم
- رسائل تحميل واضحة
- معاينة الملفات قبل الحفظ
- تحديث الأخطاء الفورية عند الكتابة

## الاستخدام

```javascript
// في CreateOrEditContent.jsx
const {
  formData,
  errors,
  handleInputChange,
  handleSubmit,
  // ... جميع الحالات والدوال المتاحة
} = useCreateOrEditContent(content, onSectionChange);
```

## المقارنة قبل وبعد

| المقياس | قبل | بعد | التحسن |
|---------|------|-----|--------|
| حجم الملف الرئيسي | 1,621 سطر | 220 سطر | -86% |
| عدد متغيرات الحالة | 50+ | 0 (في المكون) | محركزة في Hook |
| عدد المكونات الفرعية | 0 | 11 | تحسين التنظيم |
| إعادة الاستخدام | منخفضة | عالية | شامل |
| سهولة الصيانة | صعبة | سهلة | واضح |

## الخطوات التالية

1. ✅ إعادة تنظيم CreateOrEditContent
2. ⏳ إعادة تنظيم CreateOrEditVideo بنفس النمط
3. ⏳ إضافة اختبارات للمكونات الفرعية
4. ⏳ تحسين أداء المعاينات والتحميلات

## ملاحظات التطوير

### Import المشترك
```javascript
// من _common/hooks
import { useCreateOrEditContent } from "../_common/hooks/useContentForm";

// من _common/utils
import { Base64UploadAdapter } from "@/components/ForPages/Dashboard/_common/utils/shared/ckeditorAdapter";
```

### معالجة الأخطاء
- جميع الأخطاء محركزة في `setErrors` state
- يتم مسح الخطأ عند بدء المستخدم الكتابة
- رسائل الخطأ مترجمة باستخدام `useTranslation`

### إدارة الملفات
```javascript
// معالجة الصور المتعددة
handleMultipleImageUpload(files)  // تحميل جديد
handleRemoveImagePreview(index)   // حذف المعاينة
handleRemoveExistingImage(index)  // حذف الموجودة
```

---

**التاريخ**: 2024
**النسخة**: 1.0
**التحديثات**: إعادة تنظيم شاملة للكود ليكون أكثر تنظيماً وقابلية للصيانة
