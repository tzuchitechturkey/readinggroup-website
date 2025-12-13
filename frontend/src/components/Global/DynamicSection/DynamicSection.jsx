import React from "react";

import { useTranslation } from "react-i18next";
import { ChevronRight, ChevronDown } from "lucide-react";
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
  stopslider = false,
  propsToCard = {},
  gridClassName = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-2",
  enableLoadMore = false,
  onLoadMore = null,
  isLoadingMore = false,
}) => {
  const { t, i18n } = useTranslation();
  const Card = cardName;
  // إذا لم يتم تمرير data، عرض رسالة
  if (!data || data.length === 0) {
    return (
      <div className="pt-12 px-4 md:px-6 bg-gray-50">
        <div className="mx-auto text-center py-12">
          <h2 className="text-5xl font-bold text-black mb-2">{title}</h2>
          <p className="text-gray-500">{t("No data available")}</p>
        </div>
      </div>
    );
  }
  return (
    <div
      className="px-4 md:px-6 "
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
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
              <ChevronRight
                className={`${i18n?.language === "ar" ? "rotate-180" : ""} `}
              />
            </Link>
          )}
          {/* End View More Button */}
        </div>
        {/* End Title && View More */}
        {!isSlider ? (
          <div className="space-y-6">
            <div className={gridClassName}>
              {data.map((item, ind) => (
                <div key={item.id}>
                  <Card item={item} index={ind} {...propsToCard} />
                </div>
              ))}
            </div>
            {/* Load More Button for Grid */}
            {enableLoadMore && onLoadMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={onLoadMore}
                  disabled={isLoadingMore}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-blue-400 disabled:to-blue-500"
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isLoadingMore ? "animate-spin" : ""
                    }`}
                  />
                  <span>
                    {isLoadingMore ? t("Loading...") : t("Load More")}
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div
              dir={i18n?.language === "ar" ? "ltr" : "ltr"}
              style={{ touchAction: "pan-x" }}
            >
              <Carousel
                className="w-full overflow-visible"
                opts={{
                  align: "start",
                  watchDrag: true,
                  containScroll: "trimSnaps",
                }}
              >
                <CarouselContent
                  className="-ml-3 md:-ml-6 overflow-visible"
                  style={{ touchAction: "pan-x" }}
                  onPointerDownCapture={(e) => {
                    if (stopslider) {
                      e.stopPropagation();
                    }
                  }}
                  onTouchStartCapture={(e) => {
                    if (stopslider) {
                      e.stopPropagation();
                    }
                  }}
                >
                  {data.map((item, ind) => (
                    <CarouselItem
                      key={item.id}
                      className={`pl-3 md:pl-6 py-2 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 overflow-visible `}
                    >
                      {Card && typeof Card === "function" ? (
                        <Card item={item} index={ind} {...propsToCard} />
                      ) : (
                        // Default Card - تصميم افتراضي إذا لم يتم تمرير cardName صحيح
                        <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                          {t("no cards available")}
                        </div>
                      )}
                    </CarouselItem>
                  ))}
                  {/* Load More Button - يظهر في نهاية السلايدر */}
                  {enableLoadMore && onLoadMore && (
                    <CarouselItem className="pl-3 md:pl-6 py-2 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 overflow-visible flex items-center justify-center">
                      <button
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                        className="flex flex-col items-center justify-center w-full h-full min-h-[200px] bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronDown
                          className={`w-8 h-8 text-blue-600 mb-2 transition-transform duration-300 ${
                            isLoadingMore ? "animate-spin" : ""
                          }`}
                        />
                        <span className="text-sm font-semibold text-blue-600">
                          {isLoadingMore ? t("Loading...") : t("Load More")}
                        </span>
                      </button>
                    </CarouselItem>
                  )}
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
