import React from "react";

import TopFiveSectionCard from "@/components/Global/TopFiveSectionCard/TopFiveSectionCard";
import { mockVideos } from "@/mock/Viedeos";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import { useIsMobile } from "@/hooks/use-mobile";

const TopFiveSection = () => {
  const isMobile = useIsMobile(1224);

  return (
    <div className="mt-12">
      <DynamicSection
        title="VIDEO Top 5 Listesi"
        data={mockVideos}
        isSlider={isMobile}
        cardName={TopFiveSectionCard}
      />
    </div>
  );
};

export default TopFiveSection;
