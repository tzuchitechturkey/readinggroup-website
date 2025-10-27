# متطلبات الباك إند للنظام

## ✅ المتطلبات الضرورية

### 1. Endpoints للتعليقات

```
GET /comments/ - قائمة التعليقات (مع pagination)
POST /comments/ - إضافة تعليق جديد
GET /comments/{id}/ - تفاصيل تعليق محدد
PATCH /comments/{id}/ - تحديث التعليق
DELETE /comments/{id}/ - حذف التعليق

GET /comments/{id}/like/ - الإعجاب بالتعليق
DELETE /comments/{id}/like/ - إلغاء الإعجاب
```

### 2. Endpoints للردود

```
GET /replies/ - قائمة الردود (مع pagination)
POST /replies/ - إضافة رد جديد
GET /replies/{id}/ - تفاصيل رد محدد
PATCH /replies/{id}/ - تحديث الرد
DELETE /replies/{id}/ - حذف الرد

GET /replies/{id}/like/ - الإعجاب برد
DELETE /replies/{id}/like/ - إلغاء الإعجاب برد
```

---

## 📋 معاملات الطلب

### إضافة تعليق:
```json
POST /comments/
{
  "object_id": 123,
  "content_type": "video" OR "post",
  "text": "محتوى التعليق"
}
```

### تحديث تعليق:
```json
PATCH /comments/{id}/
{
  "text": "محتوى محدث"
}
```

### إضافة رد:
```json
POST /replies/
{
  "comment": 123,
  "text": "محتوى الرد"
}
```

---

## 📤 معاملات الاستجابة

### قائمة التعليقات:
```json
{
  "count": 10,
  "next": "http://...",
  "previous": null,
  "results": [
    {
      "id": 1,
      "user": "username",
      "text": "محتوى التعليق",
      "created_at": "2025-10-27T10:30:00Z",
      "likes_count": 5,
      "is_liked": false,
      "replies": [...]
    }
  ]
}
```

### التعليق الواحد:
```json
{
  "id": 1,
  "user": "username",
  "text": "محتوى التعليق",
  "created_at": "2025-10-27T10:30:00Z",
  "likes_count": 5,
  "is_liked": false,
  "replies": [
    {
      "id": 1,
      "user": "reply_username",
      "text": "محتوى الرد",
      "created_at": "2025-10-27T10:35:00Z",
      "likes_count": 2,
      "is_liked": false
    }
  ]
}
```

---

## 🔒 صلاحيات وتحقق (Authentication)

- ✅ المستخدم يجب أن يكون مسجل الدخول لإضافة تعليق
- ✅ المستخدم يمكنه حذف تعليقاته فقط (أو الـ admins)
- ✅ المستخدم يمكنه الإعجاب/إلغاء الإعجاب بتعليق واحد فقط
- ✅ الحقول الحساسة يجب أن تكون read-only من جانب الـ API

---

## 🔍 Filtering و Pagination

### Parameters:
```
GET /comments/?limit=5&offset=0&object_id=123&content_type=video

- limit: عدد النتائج لكل صفحة (افتراضي: 10)
- offset: رقم البداية (للـ pagination)
- object_id: معرف الفيديو أو المقالة
- content_type: "video" أو "post"
```

### Pagination:
```python
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
```

---

## ✨ الميزات المستحسنة

### 1. التصفية المتقدمة
```
GET /comments/?order_by=-created_at
GET /comments/?order_by=-likes_count
GET /comments/?search=keyword
```

### 2. الإحصائيات
```json
{
  "total_comments": 100,
  "total_likes": 500,
  "most_liked_comment": 5,
  "replies_count": 150
}
```

### 3. التحقق من الملكية
```python
# في models.py
class Comments(Model):
    def can_delete(self, user):
        return self.user == user or user.is_staff
        
    def can_edit(self, user):
        return self.user == user or user.is_staff
```

---

## 🧪 اختبار الـ API

### باستخدام cURL:

```bash
# إضافة تعليق
curl -X POST http://localhost:8000/comments/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "object_id": 123,
    "content_type": "video",
    "text": "رائع جداً!"
  }'

# تحميل التعليقات
curl -X GET "http://localhost:8000/comments/?object_id=123&content_type=video&limit=5" \
  -H "Authorization: Bearer {token}"

# الإعجاب بتعليق
curl -X POST http://localhost:8000/comments/1/like/ \
  -H "Authorization: Bearer {token}"
```

### باستخدام Postman:
1. استورد الـ API collection
2. عيّن الـ base URL: `http://localhost:8000`
3. أضف الـ Bearer token للـ authorization
4. جرب الـ endpoints

---

## ⚙️ التكوين المقترح

### في settings.py:
```python
# Pagination
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}

# Permissions
INSTALLED_APPS = [
    ...
    'django_filters',
    'rest_framework',
    ...
]
```

---

## 🚨 الأخطاء المحتملة

| الخطأ | السبب | الحل |
|------|------|-----|
| 401 Unauthorized | المستخدم غير مسجل | تسجيل الدخول أولاً |
| 403 Forbidden | لا توجد صلاحيات | التحقق من الصلاحيات |
| 404 Not Found | التعليق غير موجود | التحقق من الـ ID |
| 400 Bad Request | معاملات غير صحيحة | التحقق من البيانات |
| 429 Too Many Requests | الطلبات كثيرة جداً | تطبيق Rate Limiting |

---

## 📚 المراجع

- Django REST Framework Docs: https://www.django-rest-framework.org/
- Django Filtering: https://django-filter.readthedocs.io/
- Pagination: https://www.django-rest-framework.org/api-guide/pagination/

