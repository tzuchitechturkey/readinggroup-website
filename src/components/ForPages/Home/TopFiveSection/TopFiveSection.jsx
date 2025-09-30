import React from "react";

import TopFiveSectionCard from "@/components/Global/TopFiveSectionCard/TopFiveSectionCard";
import { mockVideos } from "@/mock/Viedeos";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";

import { useTranslation } from "react-i18next";

const TopFiveSection = () => {
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
        isSlider={false}
        cardName={TopFiveSectionCard}
      />
    </div>
  );
};

export default TopFiveSection;
