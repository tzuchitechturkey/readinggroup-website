# نظام التعليقات والردود - التوثيق الشامل

## 📋 نظرة عامة

تم تطوير نظام متكامل للتعليقات والردود يدعم الفيديوهات والمقالات بشكل منفصل مع الحفاظ على تنظيم البيانات.

---

## 🎯 المكونات الرئيسية

### 1. **CommentsSection.jsx** (للفيديوهات)
📍 المسار: `frontend/src/components/ForPages/Videos/VideoPage/CommentsSection/`

**الميزات:**
- تحميل التعليقات بـ Pagination (5 تعليقات لكل صفحة)
- إضافة تعليق جديد
- حذف التعليق
- الإعجاب بالتعليق
- عرض الردود على التعليق
- زر تحميل المزيد من التعليقات

**Props:**
```jsx
<CommentsSection videoId={videoId} />
```

**الحالة:**
- `comments`: التعليقات المحملة
- `currentPage`: الصفحة الحالية
- `totalComments`: إجمالي التعليقات
- `isLoadingComments`: حالة التحميل
- `isSubmittingComment`: حالة الإرسال

---

### 2. **PostCommentsSection.jsx** (للمقالات)
📍 المسار: `frontend/src/components/ForPages/GuidedReading/PostCommentsSection/`

**الميزات:**
- نفس ميزات CommentsSection ولكن للمقالات
- Pagination منفصلة للمقالات
- معالجة مستقلة للبيانات

**Props:**
```jsx
<PostCommentsSection postId={postId} />
```

---

## 🔗 API Endpoints

### للفيديوهات (videos.js):

#### تحميل التعليقات
```javascript
GetVideoComments(videoId, limit = 10, offset = 0)
// GET /comments/?limit={limit}&offset={offset}&object_id={videoId}&content_type=video
```

#### إضافة تعليق
```javascript
CreateVideoComment(videoId, text)
// POST /comments/
// {
//   object_id: videoId,
//   content_type: "video",
//   text: "التعليق"
// }
```

#### حذف التعليق
```javascript
DeleteVideoComment(commentId)
// DELETE /comments/{commentId}/
```

#### تحديث التعليق
```javascript
EditVideoComment(commentId, text)
// PATCH /comments/{commentId}/
```

#### الإعجاب بالتعليق
```javascript
LikeComment(commentId)
// POST /comments/{commentId}/like/

UnlikeComment(commentId)
// DELETE /comments/{commentId}/like/
```

#### الردود
```javascript
GetCommentReplies(commentId)
// GET /replies/?comment={commentId}

CreateCommentReply(commentId, text)
// POST /replies/
// { comment: commentId, text: "الرد" }

DeleteCommentReply(replyId)
// DELETE /replies/{replyId}/

EditCommentReply(replyId, text)
// PATCH /replies/{replyId}/

LikeReply(replyId)
// POST /replies/{replyId}/like/

UnlikeReply(replyId)
// DELETE /replies/{replyId}/like/
```

---

### للمقالات (posts.js):

نفس الدوال ولكن مع تغيير الـ content_type إلى "post":

```javascript
GetPostComments(postId, limit = 10, offset = 0)
CreatePostComment(postId, text)
DeletePostComment(commentId)
EditPostComment(commentId, text)
```

---

## 📊 هيكل البيانات من الباك

### التعليق:
```json
{
  "id": 1,
  "user": "username",
  "avatar": "url_to_avatar",
  "text": "محتوى التعليق",
  "created_at": "2025-10-27T10:30:00Z",
  "likes_count": 5,
  "is_liked": false,
  "replies": [
    {
      "id": 1,
      "user": "username",
      "avatar": "url_to_avatar",
      "text": "محتوى الرد",
      "created_at": "2025-10-27T10:35:00Z",
      "likes_count": 2,
      "is_liked": false
    }
  ]
}
```

---

## 🚀 كيفية الاستخدام

### في صفحة الفيديو:

```jsx
import CommentsSection from "@/components/ForPages/Videos/VideoPage/CommentsSection/CommentsSection";

function VideoPageContent() {
  const videoId = window.location.pathname.split("/").pop();

  return (
    <div>
      {/* محتوى الفيديو */}
      
      {/* التعليقات */}
      <CommentsSection videoId={videoId} />
    </div>
  );
}
```

### في صفحة المقالة:

```jsx
import PostCommentsSection from "@/components/ForPages/GuidedReading/PostCommentsSection/PostCommentsSection";

function PostPageContent() {
  const postId = window.location.pathname.split("/").pop();

  return (
    <div>
      {/* محتوى المقالة */}
      
      {/* التعليقات */}
      <PostCommentsSection postId={postId} />
    </div>
  );
}
```

---

## 🔑 الميزات الرئيسية

### 1. **Pagination**
- تحميل 5 تعليقات في كل مرة
- زر "تحميل المزيد" عند وجود تعليقات إضافية
- العدد الكلي للتعليقات معروض

### 2. **إضافة التعليق**
- حقل إدخال مع دعم Emoji
- التحقق من عدم ترك الحقل فارغاً
- رسائل نجاح/خطأ

### 3. **الإعجاب**
- زر إعجاب مع عداد
- تحديث الـ UI فوراً
- معالجة الأخطاء

### 4. **حذف التعليق**
- زر حذف متاح لكل تعليق
- حذف فوري من القائمة

### 5. **الردود**
- عرض الردود تحت كل تعليق
- دعم الإعجاب برد محدد
- إمكانية إضافة ردود جديدة (قيد التطوير)

---

## ⚠️ ملاحظات مهمة

### 1. **المكونات منفصلة**
- `CommentsSection` للفيديوهات فقط
- `PostCommentsSection` للمقالات فقط
- كل مكون له حالته الخاصة به

### 2. **الـ Content Type**
- الفيديوهات: `content_type = "video"`
- المقالات: `content_type = "post"`

### 3. **معالجة الأخطاء**
- تظهر رسائل Toast عند الأخطاء
- الأخطاء تُسجل في الـ console

### 4. **الأداء**
- Pagination تقلل من حمل البيانات
- التحديثات محلية (Optimistic Updates) حيث يمكن

---

## 🔄 تدفق البيانات

```
المستخدم يكتب تعليق
        ↓
التحقق من الصحة
        ↓
إرسال POST request
        ↓
نجاح: إعادة تحميل التعليقات
خطأ: عرض رسالة خطأ
        ↓
تحديث الـ UI
```

---

## 🛠️ التطوير المستقبلي

- [ ] إضافة ردود جديدة من الواجهة
- [ ] تحديث التعليق (Edit)
- [ ] حذف الردود
- [ ] تصفية التعليقات (الأحدث، الأكثر إعجاباً)
- [ ] الرد على رد (Nested Replies)

---

## 📝 أمثلة

### تحميل التعليقات:
```javascript
const res = await GetVideoComments(123, 5, 0); // 5 تعليقات، الصفحة 0
```

### إضافة تعليق:
```javascript
const res = await CreateVideoComment(123, "رائع جداً!");
```

### الإعجاب:
```javascript
await LikeComment(commentId);
// أو
await UnlikeComment(commentId);
```

---

## 📞 الدعم

للمزيد من المعلومات، يرجى مراجعة:
- `backend/content/models.py`: النماذج
- `backend/content/serializers.py`: المسلسلات
- `backend/content/views.py`: العروض (Views)
- `frontend/src/api/videos.js` و `posts.js`: API دوال
