import React from "react";

import SectionHeader from "../shared/SectionHeader";
import PosterCard from "../shared/PosterCard";
import GoodEfect from "../../../assets/goodEfect.png";
// Mock data for good effects poster
const mockPosterData = {
  id: 1,
  title: "Life-changing ways of thinking by Huang Yongcun",
  date: "Jan. 16, 2026",
  image: GoodEfect,
  buttonText: "Learn more",
  description:
    "Discover transformative perspectives and wisdom shared by Master Huang Yongcun.",
  category: "Education",
};

const GoodEffectsPoster = () => {
  const handleSeeMoreClick = () => {
    // Navigate to more posters page
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
      <PosterCard poster={mockPosterData} />
    </div>
  );
};

export default GoodEffectsPoster;
