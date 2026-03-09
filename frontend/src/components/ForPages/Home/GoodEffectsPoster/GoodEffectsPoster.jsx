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
        actionText={t("SEE MORE")}
        onActionClick={handleSeeMoreClick}
      />
      {/* Poster Content */}
      <PosterCard poster={poster} t={t} />
    </div>
  );
};

export default GoodEffectsPoster;
