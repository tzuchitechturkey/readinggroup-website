# 🎯 نظام التعليقات والردود - الدليل الشامل

## 📋 جدول المحتويات

1. [نظرة عامة](#-نظرة-عامة)
2. [البنية](#-البنية)
3. [الملفات الرئيسية](#-الملفات-الرئيسية)
4. [كيفية الاستخدام](#-كيفية-الاستخدام)
5. [API Reference](#-api-reference)
6. [أمثلة](#-أمثلة)
7. [استكشاف الأخطاء](#-استكشاف-الأخطاء)

---

## 📌 نظرة عامة

### الهدف:
ربط نظام التعليقات والردود للفيديوهات والمقالات مع الـ API الخاص بك بشكل متكامل.

### الميزات:
- ✅ تحميل ديناميكي للتعليقات
- ✅ Pagination ذكي
- ✅ إضافة/حذف/تحديث تعليقات
- ✅ نظام إعجابات
- ✅ عرض الردود
- ✅ معالجة أخطاء شاملة

---

## 🏗️ البنية

```
readinggroup-website/
├── frontend/
│   └── src/
│       ├── api/
│       │   ├── videos.js          ← API دوال الفيديو
│       │   └── posts.js           ← API دوال المقالات
│       ├── components/
│       │   ├── ForPages/
│       │   │   ├── Videos/
│       │   │   │   └── VideoPage/
│       │   │   │       └── CommentsSection/
│       │   │   │           └── CommentsSection.jsx ← مكون التعليقات (فيديو)
│       │   │   └── GuidedReading/
│       │   │       └── PostCommentsSection/
│       │   │           └── PostCommentsSection.jsx ← مكون التعليقات (مقالة)
│       └── pages/
│           └── Videos/
│               └── VideoPage/
│                   └── VideoPageContent.jsx ← صفحة الفيديو
├── COMMENTS_SYSTEM.md           ← شرح النظام
├── BACKEND_REQUIREMENTS.md      ← متطلبات الباك
├── IMPLEMENTATION_SUMMARY.md    ← ملخص التنفيذ
└── QUICK_START.md               ← دليل البدء السريع
```

---

## 📄 الملفات الرئيسية

### 1. CommentsSection.jsx (للفيديوهات)

**الموقع:** `frontend/src/components/ForPages/Videos/VideoPage/CommentsSection/`

**الوظائف:**
```javascript
- loadComments(page)          // تحميل التعليقات
- handleSubmitComment()       // إرسال تعليق
- handleDeleteComment()       // حذف تعليق
- handleLikeComment()         // إعجاب بالتعليق
- loadMoreComments()          // تحميل المزيد
```

**Props:**
```jsx
<CommentsSection videoId={123} />
```

---

### 2. PostCommentsSection.jsx (للمقالات)

**الموقع:** `frontend/src/components/ForPages/GuidedReading/PostCommentsSection/`

**نفس الوظائف والـ Props لكن للمقالات:**
```jsx
<PostCommentsSection postId={123} />
```

---

### 3. API دوال الفيديو (videos.js)

```javascript
// تحميل التعليقات
GetVideoComments(videoId, limit, offset)
// مثال:
const res = await GetVideoComments(123, 5, 0);

// إضافة تعليق
CreateVideoComment(videoId, text)
// مثال:
await CreateVideoComment(123, "رائع جداً!");

// حذف التعليق
DeleteVideoComment(commentId)

// تحديث التعليق
EditVideoComment(commentId, text)

// الإعجاب
LikeComment(commentId)
UnlikeComment(commentId)

// الردود
GetCommentReplies(commentId)
CreateCommentReply(commentId, text)
DeleteCommentReply(replyId)
EditCommentReply(replyId, text)
LikeReply(replyId)
UnlikeReply(replyId)
```

---

## 💻 كيفية الاستخدام

### الخطوة 1: استيراد المكون

```jsx
import CommentsSection from "@/components/ForPages/Videos/VideoPage/CommentsSection/CommentsSection";
```

### الخطوة 2: استخراج الـ ID

```jsx
const videoId = window.location.pathname.split("/").pop();
// أو
const videoId = useParams().id;
```

### الخطوة 3: تمرير الـ ID للمكون

```jsx
<CommentsSection videoId={videoId} />
```

### مثال كامل:

```jsx
import React, { useState, useEffect } from "react";
import CommentsSection from "@/components/ForPages/Videos/VideoPage/CommentsSection/CommentsSection";
import { GetVideoById } from "@/api/videos";

function VideoPageContent() {
  const videoId = window.location.pathname.split("/").pop();
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    GetVideoById(videoId).then(res => setVideoData(res.data));
  }, [videoId]);

  return (
    <div className="bg-white">
      {/* محتوى الفيديو */}
      <video src={videoData?.video_url} controls />
      
      {/* التعليقات */}
      <CommentsSection videoId={videoId} />
    </div>
  );
}

export default VideoPageContent;
```

---

## 📚 API Reference

### GET /comments/

**الوصف:** تحميل التعليقات

**المعاملات:**
```
limit=5              // عدد النتائج
offset=0             // الإزاحة
object_id=123        // معرف الفيديو/المقالة
content_type=video   // نوع المحتوى
```

**الاستجابة:**
```json
{
  "count": 10,
  "next": "...",
  "previous": null,
  "results": [
    {
      "id": 1,
      "user": "ahmed",
      "text": "تعليق رائع",
      "created_at": "2025-10-27T10:30:00Z",
      "likes_count": 5,
      "is_liked": false,
      "replies": []
    }
  ]
}
```

---

### POST /comments/

**الوصف:** إضافة تعليق جديد

**البيانات:**
```json
{
  "object_id": 123,
  "content_type": "video",
  "text": "محتوى التعليق"
}
```

---

### DELETE /comments/{id}/

**الوصف:** حذف تعليق

---

### POST /comments/{id}/like/

**الوصف:** الإعجاب بالتعليق

---

### DELETE /comments/{id}/like/

**الوصف:** إلغاء الإعجاب

---

## 🔍 أمثلة

### مثال 1: تحميل التعليقات

```javascript
import { GetVideoComments } from "@/api/videos";

async function loadVideoComments() {
  try {
    const res = await GetVideoComments(123, 5, 0);
    console.log(res.data.results);
  } catch (error) {
    console.error(error);
  }
}
```

### مثال 2: إضافة تعليق

```javascript
import { CreateVideoComment } from "@/api/videos";

async function addComment() {
  try {
    const res = await CreateVideoComment(123, "رائع جداً!");
    console.log("تم إضافة التعليق:", res.data);
  } catch (error) {
    console.error("خطأ:", error);
  }
}
```

### مثال 3: الإعجاب بالتعليق

```javascript
import { LikeComment, UnlikeComment } from "@/api/videos";

async function toggleLike(commentId, isLiked) {
  try {
    if (isLiked) {
      await UnlikeComment(commentId);
    } else {
      await LikeComment(commentId);
    }
  } catch (error) {
    console.error("خطأ:", error);
  }
}
```

### مثال 4: حذف التعليق

```javascript
import { DeleteVideoComment } from "@/api/videos";

async function removeComment(commentId) {
  try {
    await DeleteVideoComment(commentId);
    console.log("تم حذف التعليق");
  } catch (error) {
    console.error("خطأ:", error);
  }
}
```

---

## 🐛 استكشاف الأخطاء

### المشكلة: لا تظهر التعليقات

**الحلول:**
1. تحقق من الـ videoId/postId صحيح
2. تحقق من الـ API response في Developer Tools
3. تأكد من أن الـ API endpoint موجود

```javascript
// جرب هذا في console:
console.log("Video ID:", videoId);
```

---

### المشكلة: خطأ 401 Unauthorized

**الحل:**
تأكد من تسجيل الدخول أولاً قبل إضافة تعليق.

```javascript
// في API call:
headers: {
  "Authorization": `Bearer ${token}`
}
```

---

### المشكلة: Pagination لا يعمل

**الحل:**
تأكد من أن الـ API يدعم `limit` و `offset`:

```javascript
// جرب هذا:
const res = await GetVideoComments(videoId, 5, 0);
console.log(res.data.count); // يجب أن يظهر رقم
```

---

### المشكلة: الإعجاب لا يعمل

**الحل:**
تأكد من أن الـ endpoint موجود:

```
POST /comments/{id}/like/
DELETE /comments/{id}/like/
```

---

## ✅ قائمة التحقق

- [ ] تم استيراد المكون بشكل صحيح
- [ ] تم تمرير الـ videoId/postId
- [ ] الـ API endpoints موجودة وتعمل
- [ ] Authentication مفعل
- [ ] Pagination يعمل بشكل صحيح
- [ ] معالجة الأخطاء تظهر الرسائل

---

## 🎓 أفضل الممارسات

### ✅ DO:
- استخدم Pagination من البداية
- تحقق من الأخطاء دائماً
- أظهر رسائل تحميل واضحة
- تحقق من صلاحيات الحذف

### ❌ DON'T:
- لا تحمل جميع التعليقات مرة واحدة
- لا تتجاهل الأخطاء
- لا تؤخر الـ UI أثناء التحميل
- لا تسمح للمستخدم بحذف تعليقات الآخرين

---

## 📞 المساعدة

للمزيد من المعلومات:
- 📄 اقرأ `COMMENTS_SYSTEM.md`
- 📄 اقرأ `BACKEND_REQUIREMENTS.md`
- 📄 اقرأ `QUICK_START.md`

---

## 📊 الإحصائيات

- **API Functions:** 24 دالة
- **React Components:** 2 مكون
- **Lines of Code:** ~1500
- **Documentation:** شامل

---

## 🚀 الخلاصة

النظام جاهز للاستخدام الفوري. فقط:
1. ✅ استيراد المكون
2. ✅ تمرير الـ ID
3. ✅ اختبار الـ API
4. ✅ الاستمتاع! 🎉

---

*تم التطوير بواسطة: GitHub Copilot*  
*آخر تحديث: 27 أكتوبر 2025*
