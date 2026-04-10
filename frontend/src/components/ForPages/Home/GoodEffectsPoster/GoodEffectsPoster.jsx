import React from "react";

import { useNavigate } from "react-router-dom";

import SectionHeader from "../shared/SectionHeader";
import PosterCard from "../shared/PosterCard";

const GoodEffectsPoster = ({ poster, t }) => {
  const navigate = useNavigate();
  const handleSeeMoreClick = () => {
    navigate("/learn");
  };
  return (
    <div className="flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px] lg:gap-[24px] items-start px-4 sm:px-6 md:px-8 lg:px-0 w-full lg:w-[1200px] mx-auto">
      {/* Section Header */}
      <SectionHeader
        title={t("GOOD EFFECTS POSTER")}
        actionText={t("See more")}
        onActionClick={handleSeeMoreClick}
      />
      {/* Poster Content */}
      {poster && Object.keys(poster).length > 0 ? (
        <PosterCard poster={poster} t={t} />
      ) : (
        <div className="flex items-center justify-center w-full h-[200px] rounded-xl border border-dashed border-gray-300 bg-gray-50">
          <p className="text-gray-400 text-sm">{t("No posters available")}</p>
        </div>
      )}
    </div>
  );
};

export default GoodEffectsPoster;
