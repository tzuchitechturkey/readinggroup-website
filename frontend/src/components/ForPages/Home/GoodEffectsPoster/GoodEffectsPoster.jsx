import React from "react";

import SectionHeader from "../shared/SectionHeader";
import PosterCard from "../shared/PosterCard";

const GoodEffectsPoster = ({ poster, t }) => {
  const handleSeeMoreClick = () => {
    navigate("/learn");
  };
  return (
    <div className="flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px] lg:gap-[24px] items-start px-4 sm:px-6 md:px-8 lg:px-0 w-full lg:w-[1200px] mx-auto">
      {/* Section Header */}
      <SectionHeader
        title="GOOD EFFECTS POSTER"
        actionText="See More"
        onActionClick={handleSeeMoreClick}
      />
      {/* Poster Content */}
      <PosterCard poster={poster} t={t} />
    </div>
  );
};

export default GoodEffectsPoster;
