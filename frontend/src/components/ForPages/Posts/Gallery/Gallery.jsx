import { useEffect, useState, useMemo, useCallback } from "react";

import useEmblaCarousel from "embla-carousel-react";

const ITEM_WIDTH = 110;
const GAP = 10;

export default function Gallery() {
  const baseDate = new Date(); // اليوم الحالي الفعلي

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: false,
    dragFree: false,
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(179); // بدء من اليوم الـ 179 (اليوم الحالي)
  const [isUserClick, setIsUserClick] = useState(false); // لمنع التحديث التلقائي عند النقر

  // إنشاء 180 يوم (179 يوم سابق + اليوم الحالي) - 6 أشهر تقريباً
  const displayedDays = useMemo(() => {
    const daysArray = [];

    // 179 يوم سابق (6 أشهر تقريباً)
    for (let i = 179; i >= 1; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);
      daysArray.push({
        id: `day-prev-${i}`,
        date,
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        images: Array.from(
          { length: 8 },
          (_, idx) =>
            `https://picsum.photos/300/200?random=${date.getTime()}-${idx}`
        ),
        isClickable: true,
      });
    }

    // اليوم الحالي
    daysArray.push({
      id: "day-current",
      date: new Date(baseDate),
      day: baseDate.getDate(),
      month: baseDate.getMonth() + 1,
      year: baseDate.getFullYear(),
      images: Array.from(
        { length: 8 },
        (_, idx) =>
          `https://picsum.photos/300/200?random=${baseDate.getTime()}-${idx}`
      ),
      isClickable: true,
    });

    return daysArray;
  }, []); // لا تعتمد على أي state متغير

  // حساب العنصر الأقرب للجانب الأيمن من الشاشة (الأخير - اليوم الحالي)
  const updateSelectedIndex = useCallback(() => {
    if (!emblaApi || isUserClick) return; // لا نحدث إذا كان المستخدم نقر

    const container = emblaApi.rootNode();
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    // نقطة المرجع: الجانب الأيمن مع إزاحة قليلة (العنصر الأخير - اليوم الحالي)
    const referencePoint = containerRect.right - 100; // إزاحة 100px من اليمين

    const slides = emblaApi.slideNodes();
    let closestIndex = 0;
    let minDistance = Infinity;

    slides.forEach((slide, index) => {
      const slideRect = slide.getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width / 2;
      const distance = Math.abs(referencePoint - slideCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setSelectedIndex(closestIndex);
  }, [emblaApi, isUserClick]);

  // مراقبة التغييرات والسكرول
  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", updateSelectedIndex);
    emblaApi.on("scroll", updateSelectedIndex);

    return () => {
      emblaApi.off("select", updateSelectedIndex);
      emblaApi.off("scroll", updateSelectedIndex);
    };
  }, [emblaApi, updateSelectedIndex]);

  // تهيئة الكاروسيل للوضع الصحيح عند التحميل (اليوم الحالي في الوسط)
  useEffect(() => {
    if (!emblaApi) return;

    // استخدم timeout صغير للتأكد من أن DOM جاهز
    const timer = setTimeout(() => {
      setIsUserClick(true); // منع التحديث التلقائي أثناء التحميل
      emblaApi.scrollTo(179, false); // الانتقال لليوم الحالي (الفهرس 179)
      setSelectedIndex(179); // اليوم الحالي نشط عند التحميل

      // السماح بالتحديث التلقائي بعد التحميل
      setTimeout(() => {
        setIsUserClick(false);
      }, 600);
    }, 100);

    return () => clearTimeout(timer);
  }, [emblaApi]);

  return (
    <div style={{ padding: "20px" }}>
      {/* عنوان القسم */}
      <h2 style={{ marginBottom: "20px" }}>اختر يوماً لعرض البيانات</h2>

      {/* الكاروسيل */}
      <div
        className="embla"
        ref={emblaRef}
        style={{ overflow: "hidden", marginBottom: "40px" }}
      >
        <div
          className="embla__container"
          style={{
            display: "flex",
            gap: `${GAP}px`,
          }}
        >
          {displayedDays.map((day, index) => {
            const isActive = index === selectedIndex;

            return (
              <div
                key={day.id}
                className="embla__slide"
                style={{
                  flex: `0 0 ${ITEM_WIDTH}px`,
                  minWidth: `${ITEM_WIDTH}px`,
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (emblaApi) {
                    setIsUserClick(true); // منع التحديث التلقائي
                    emblaApi.scrollTo(index);
                    setSelectedIndex(index);

                    // السماح بالتحديث التلقائي بعد انتهاء السكرول
                    setTimeout(() => {
                      setIsUserClick(false);
                    }, 600);
                  }
                }}
              >
                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    background: isActive ? "#2563eb" : "#e5e7eb",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    color: isActive ? "#fff" : "#000",
                    userSelect: "none",
                    fontSize: "14px",
                    transform: isActive ? "scale(1.2)" : "scale(0.85)",
                    transition: "all 0.3s ease",
                    opacity: isActive ? 1 : 0.5,
                  }}
                >
                  <div style={{ fontSize: "18px" }}>{day.day}</div>
                  <div style={{ fontSize: "10px", opacity: 0.8 }}>
                    {day.month}/{day.year}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* عرض صور اليوم المختار */}
      <div>
        <h3 style={{ marginBottom: "20px" }}>
          صور يوم {displayedDays[selectedIndex].day}/
          {displayedDays[selectedIndex].month}/
          {displayedDays[selectedIndex].year}
        </h3>

        {/* شبكة الصور: 4 عناصر في الصف مع سطرين (8 صور إجمالي) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          {displayedDays[selectedIndex].images.map((img, i) => (
            <div
              key={i}
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={img}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  display: "block",
                }}
                alt={`صورة رقم ${i + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
