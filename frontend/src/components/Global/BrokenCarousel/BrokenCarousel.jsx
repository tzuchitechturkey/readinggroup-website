import React from "react";

import { useTranslation } from "react-i18next";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function BrokenCarousel({
  data,
  title,
  showArrows = false,
  showCount = 3,
  cardName = null,
  nextArrowClassname = "",
  prevArrowClassname = "",
}) {
  const { i18n } = useTranslation();
  const Card = cardName;
  const isRTL = i18n?.language === "ar";

  // التحقق من صحة البيانات
  if (cardName && typeof cardName !== "function") {
    console.error(
      "DynamicSection: cardName must be a valid React component function"
    );
  }
  // حساب الـ basis classes حسب عدد العناصر
  const getItemBasisClass = () => {
    const itemCount = data?.length || 0;

    if (itemCount === 1) {
      return "basis-full sm:basis-full md:basis-full lg:basis-full xl:basis-[100%]";
    } else if (itemCount === 2) {
      return "basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/2 xl:basis-1/2";
    } else if (itemCount === 3) {
      return "basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4";
    }
    return `basis-full sm:basis-1/2 md:basis-[28.57%] lg:basis-[28.57%] ${
      showCount === 4 ? "xl:basis-[19.99%]" : "xl:basis-[35.57%]"
    }`;
  };

  return (
    <div>
      {title && (
        <p className="text-2xl lg:text-3xl px-4 text-white font-bold mb-2">
          {title}
        </p>
      )}
      <Carousel
        className="w-full overflow-visible"
        opts={{
          direction: isRTL ? "rtl" : "ltr",
          align: "start",
        }}
      >
        <CarouselContent className="px-1">
          {data?.map((item) => (
            <CarouselItem
              key={item.id}
              className={`py-2 ${getItemBasisClass()} overflow-visible  `}
            >
              <Card item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {showArrows && (
          <>
            <CarouselNext className={nextArrowClassname} />
            <CarouselPrevious className={prevArrowClassname} />
          </>
        )}
      </Carousel>
    </div>
  );
}

export default BrokenCarousel;
