import React from "react";

import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const DynamicSection = ({
  data = [],
  isSlider = false,
  title,
  titleClassName,
  cardName = null,
  viewMore = false,
  viewMoreUrl = "#",
  showArrows = false,
  prevArrowClassname = "",
  nextArrowClassname = "",
}) => {
  const { t } = useTranslation();
  const Card = cardName;

  // التحقق من صحة البيانات
  if (cardName && typeof cardName !== "function") {
    console.error(
      "DynamicSection: cardName must be a valid React component function"
    );
  }

  // إذا لم يتم تمرير data، عرض رسالة
  if (!data || data.length === 0) {
    return (
      <div className="pt-12 px-4 md:px-8 lg:px-10 bg-gray-50">
        <div className="mx-auto text-center py-12">
          <h2 className="text-5xl font-bold text-black mb-2">{title}</h2>
          <p className="text-gray-500">{t("No data available")}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="px-4 md:px-8 lg:px-10 ">
      <div className=" mx-auto">
        {/* Start Title && View More */}
        <div className="flex items-center justify-between mb-1 md:mb-4">
          {/* Start Title */}
          <div className="">
            <h2
              className={`font-bold text-black text-[26px] lg:text-4xl ${titleClassName}`}
            >
              {title}
            </h2>
          </div>
          {/* End Title */}
          {/* Start View More Button */}
          {viewMore && (
            <Link
              to={viewMoreUrl}
              className="flex items-center gap- border-[1px] border-primary text-text text-sm rounded-full px-4 py-[4px] lg:py-[6px] hover:bg-primary hover:text-white transition-all duration-300"
            >
              {t("View More")}
              <ChevronRight />
            </Link>
          )}
          {/* End View More Button */}
        </div>
        {/* End Title && View More */}
        {!isSlider ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-2">
            {data.map((item) => (
              <div key={item.id}>
                <Card item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className=" ">
              <Carousel className="w-full overflow-visible">
                <CarouselContent className="-ml-3 md:-ml-6 overflow-visible">
                  {data.map((item) => (
                    <CarouselItem
                      key={item.id}
                      className="pl-3 md:pl-6 py-2 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 overflow-visible"
                    >
                      {Card && typeof Card === "function" ? (
                        <Card item={item} />
                      ) : (
                        // Default Card - تصميم افتراضي إذا لم يتم تمرير cardName صحيح
                        <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                          no card
                        </div>
                      )}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {showArrows && (
                  <>
                    <CarouselPrevious className={`${prevArrowClassname}`} />
                    <CarouselNext className={`${nextArrowClassname}`} />
                  </>
                )}
              </Carousel>
            </div>
          </div>
        )}

        {/* Start Video List */}
      </div>
    </div>
  );
};

export default DynamicSection;
