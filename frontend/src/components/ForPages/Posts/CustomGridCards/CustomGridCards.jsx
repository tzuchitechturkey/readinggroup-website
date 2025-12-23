import React from "react";

import WeekPhotosCard from "@/components/Global/WeekPhotosCard/WeekPhotosCard";
import GlobalCard from "@/components/Global/GlobalCard/GlobalCard";

function CustomGridCards({ topViewedData, i18n, t }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6  lg:gap-8 px-4 my-6 sm:my-8 md:my-10">
      {/* Start Image */}
      <div className="order-2 lg:order-1 mt-0 lg:mt-8 ">
        {topViewedData?.[0] && (
          <WeekPhotosCard
            item={topViewedData[0]}
            imgHeight="h-[280px] lg:h-[580px]"
          />
        )}
      </div>
      {/* End Image */}

      {/* Start Grid Cards */}
      <div className="order-1 lg:order-2 px-0 sm:px-3 md:px-5 lg:px-7">
        {/* Start Title */}
        <h2
          className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center ${
            i18n?.language === "ar" ? "lg:text-right" : "lg:text-left"
          } `}
        >
          {t("This Week's Top Cards")}
        </h2>
        {/* End Title */}

        {/* Start Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-6">
          {topViewedData?.slice(1, 5).map((item, index) => (
            <div
              key={index}
              className="transform hover:scale-105 transition-transform duration-200"
            >
              <GlobalCard item={item} />
            </div>
          ))}
        </div>
        {/* End Cards */}
      </div>
      {/* End Grid Cards */}
    </div>
  );
}

export default CustomGridCards;
