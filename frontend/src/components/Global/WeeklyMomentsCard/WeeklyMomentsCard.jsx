import React from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function WeeklyMomentsCard({ item }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/cards-photos/card/${item?.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-[#fff] p-3 rounded-2xl group cursor-pointer max-w-[400px] transform hover:scale-105 transition-all duration-300 shadow-[0_0_5px_rgba(0,0,0,0.3)]"
    >
      {/* Start Image */}
      <div className="relative  overflow-hidden rounded-lg">
        <img
          src={item?.image || item?.image_url}
          alt={item?.title}
          className="w-full h-[220px] shadow-2xl"
          style={{
            filter:
              "drop-shadow(0 10px 25px rgba(255, 255, 255, 0.1)) drop-shadow(0 4px 15px rgba(255, 255, 255, 0.08))",
          }}
          loading="lazy"
          title={item?.title || "weekly moment image"}
        />
      </div>
      {/* End Image */}

      {/* Start white Shadow overlay */}
      <div className="relative -mt-2">
        <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-t from-white/5 to-transparent blur-sm" />
      </div>
      {/* End white Shadow overlay */}

      <div className="mb-4 mt-5">
        {/* Start Country and Date */}
        <div className="flex items-center mb-6 gap-2">
          <span className="text-gray-600 font-medium text-[14px]">
            {item?.country} :
          </span>
          <span className="text-[#1e40af] font-semibold text-[15px]">
            {item?.updated_at}
          </span>
        </div>
        {/* End Country and Date */}

        {/* Start Title */}
        <h3 className="font-bold text-[24px] mb-8 leading-tight text-[#1e40af]">
          {item?.title}
        </h3>
        {/* End Title */}

        {/* Start Info Row */}
        <div className="flex justify-start gap-16 text-sm">
          <div className="text-left">
            <div className="text-black font-bold mb-3 text-[18px]">
              {t("Type")}
            </div>
            <div className="text-[#1e40af] font-semibold text-[16px]">
              {t(item?.post_type || "News")}
            </div>
          </div>

          <div className="text-left">
            <div className="text-black font-bold mb-3 text-[18px]">
              {t("Category")}
            </div>
            <div className="text-[#1e40af] font-semibold text-[16px]">
              {t(item?.category?.name)}
            </div>
          </div>

          <div className="text-left">
            <div className="text-black font-bold mb-3 text-[18px]">
              {t("language")}
            </div>
            <div className="text-[#1e40af] font-semibold text-[16px]">
              {t(item?.language || "AR / EN")}
            </div>
          </div>
        </div>
        {/* End Info Row */}
      </div>
    </div>
  );
}

export default WeeklyMomentsCard;
