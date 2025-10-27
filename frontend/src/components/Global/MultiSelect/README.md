# MultiSelect Component - دليل الاستخدام

## نظرة عامة

مكون `MultiSelect` يسمح للمستخدمين باختيار عدة خيارات من قائمة، مع دعم البحث والحذف المباشر.

## الميزات

✅ **اختيار متعدد** - اختر أكثر من خيار واحد  
✅ **بحث** - ابحث عن العناصر في القائمة  
✅ **حذف سريع** - أزل الخيارات المختارة بسهولة  
✅ **Checkbox بصري** - تصميم واضح وحديث  
✅ **Responsive** - يعمل على جميع الأجهزة  
✅ **Accessible** - يدعم لوحة المفاتيح والـ Screen Readers  

## الاستخدام الأساسي

```jsx
import MultiSelect from "@/components/Global/MultiSelect/MultiSelect";

function MyComponent() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const categories = [
    { id: 1, name: "Technology" },
    { id: 2, name: "Science" },
    { id: 3, name: "Sports" },
  ];

  return (
    <MultiSelect
      items={categories}
      selected={selectedCategories}
      onChange={setSelectedCategories}
      placeholder="Select categories..."
      renderLabel={(item) => item.name}
      renderValue={(item) => item.name}
    />
  );
}
```

## Props

| Prop | Type | Default | الوصف |
|------|------|---------|-------|
| `items` | Array | `[]` | قائمة العناصر المتاحة للاختيار |
| `selected` | Array | `[]` | العناصر المختارة حالياً |
| `onChange` | Function | - | دالة callback عند تغيير الاختيار |
| `placeholder` | String | "Select items..." | نص العنصر النائب |
| `renderLabel` | Function | `(item) => item.name \| item` | دالة لعرض اسم العنصر في القائمة |
| `renderValue` | Function | `(item) => item.name \| item` | دالة لعرض قيمة العنصر المختار |
| `searchable` | Boolean | `true` | تفعيل/تعطيل البحث |
| `className` | String | `""` | فئات CSS إضافية |
| `disabled` | Boolean | `false` | تعطيل المكون |

## الاستخدام في LearnFilter

تم استبدال عنصر `select` العادي بـ `MultiSelect` لفلتر الفئات:

```jsx
<MultiSelect
  items={categoriesList}
  selected={Array.isArray(category) ? category : (category ? [{ name: category }] : [])}
  onChange={(selected) => updateFilter("category", selected)}
  placeholder={t("Category")}
  renderLabel={(item) => t(item?.name || item)}
  renderValue={(item) => item?.name || item}
  searchable={true}
/>
```

### كيفية تحديث الفلتر

عند اختيار فئات متعددة:
```javascript
updateFilter("category", [
  { id: 1, name: "Tech" },
  { id: 2, name: "Science" }
])
```

### عرض الفئات المختارة

يتم عرض الفئات المختارة كـ badges زرقاء مع أيقونة X لحذفها:

```
[Tech ✕] [Science ✕] [Sports ✕]
```

## أمثلة متقدمة

### مثال 1: مع كائنات معقدة

```jsx
const items = [
  { id: 1, label: "Python", version: "3.9" },
  { id: 2, label: "JavaScript", version: "ES2021" },
];

<MultiSelect
  items={items}
  selected={selected}
  onChange={setSelected}
  renderLabel={(item) => `${item.label} (v${item.version})`}
  renderValue={(item) => item.label}
/>
```

### مثال 2: مع تعطيل

```jsx
<MultiSelect
  items={categories}
  selected={selected}
  onChange={setSelected}
  disabled={isLoading}
  placeholder={isLoading ? "Loading..." : "Select..."}
/>
```

## الفروقات من select العادي

| الميزة | select العادي | MultiSelect |
|--------|--------------|------------|
| اختيارات متعددة | ❌ | ✅ |
| بحث مباشر | ❌ | ✅ |
| حذف سريع | ❌ | ✅ |
| عرض الاختيارات | dropdown واحد | badges متعددة |
| تصميم حديث | ✅ | ✅ |

## ملاحظات مهمة

1. **تحويل البيانات القديمة**: إذا كانت البيانات في البداية تستخدم string واحد، يتم تحويلها تلقائياً:
   ```javascript
   // قديم
   category: "Tech"
   
   // جديد
   category: [{ id: 1, name: "Tech" }, { id: 2, name: "Science" }]
   ```

2. **دالة removeFilter**: تم تحديثها لتتعامل مع الفئات المتعددة وحذف واحدة في المرة:
   ```javascript
   removeFilter("category", "Tech") // حذف "Tech" فقط
   ```

3. **getActiveFilters**: تعرض كل فئة مختارة كـ chip منفصل مع زر الحذف الخاص بها

## الاختبار

جرّب المكون بـ:
1. اختر عدة فئات
2. ابحث عن فئة معينة
3. احذف فئة باستخدام الـ X
4. شاهد تحديث الفلتر في الوقت الفعلي
