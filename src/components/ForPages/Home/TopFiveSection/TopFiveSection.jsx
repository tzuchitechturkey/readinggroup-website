import React from "react";

import TopFiveSectionCard from "@/components/Global/TopFiveSectionCard/TopFiveSectionCard";
import { mockVideos } from "@/mock/Viedeos";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";

const TopFiveSection = () => {
  return (
    <div className="mt-12">
      <DynamicSection
        title="VIDEO Top 5 Listesi"
        data={mockVideos}
        isSlider={false}
        cardName={TopFiveSectionCard}
      />
    </div>
  );
};

export default TopFiveSection;
