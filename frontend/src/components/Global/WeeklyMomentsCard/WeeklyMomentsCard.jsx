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
        />
      </div>
      {/* End Image */}

      {/* Start white Shadow overlay */}
      <div className="relative -mt-2">
        <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-t from-white/5 to-transparent blur-sm" />
      </div>
      {/* End white Shadow overlay */}

      <div className="mb-4 mt-5">
        {/* Start Title */}
        <h3 className="  font-semibold text-[16px] my-5 leading-tight">
          {item?.title}
        </h3>
        {/* End Title */}

        {/* Start Type, Source, Language */}
        <div className="flex justify-between gap-10 text-xs px-4">
          <div className="text-left ">
            <div className="text-primary text-start font-semibold mb-[6px]">
              {t("Type")}
            </div>
            <div className="text-text ">{t(item?.post_type)}</div>
          </div>

          <div className="text-left ">
            <div className="text-primary font-semibold mb-[6px]">
              {t("Language")}
            </div>
            <div className="text-text">{t(item?.language)}</div>
          </div>
        </div>
        {/* End Type, Source, Language */}
      </div>
    </div>
  );
}

export default WeeklyMomentsCard;
