import React from "react";

import { useTranslation } from "react-i18next";

import TopFiveSectionCard from "@/components/Global/TopFiveSectionCard/TopFiveSectionCard";
import { mockVideos } from "@/mock/Viedeos";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import { useIsMobile } from "@/hooks/use-mobile";

const TopFiveSection = () => {
  const isMobile = useIsMobile(1224);
  const { t } = useTranslation();

  return (
    <div className="mt-12">
      <DynamicSection
        title={
          <h3 className="text-white text-xl md:text-2xl font-semibold">
            {t("This Week’s Top 5")}
          </h3>
        }
        data={mockVideos}
        isSlider={isMobile}
        cardName={TopFiveSectionCard}
        showArrows={isMobile}
        prevArrowClassname="-left-8"
        nextArrowClassname="-right-8"
      />
    </div>
  );
};

export default TopFiveSection;
