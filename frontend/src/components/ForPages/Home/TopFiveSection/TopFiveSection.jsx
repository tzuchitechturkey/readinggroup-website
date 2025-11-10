import React from "react";

import { useTranslation } from "react-i18next";

import TopFiveSectionCard from "@/components/Global/TopFiveSectionCard/TopFiveSectionCard";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import { useIsMobile } from "@/hooks/use-mobile";

const TopFiveSection = ({ data }) => {
  const isMobile = useIsMobile(1224);
  const { t } = useTranslation();
  return (
    <div className="mt-12">
      <DynamicSection
        title={
          <p className="text-white text-xl md:text-2xl font-semibold">
            {t("This Week’s Top 5")}
          </p>
        }
        data={data}
        isSlider={isMobile}
        cardName={TopFiveSectionCard}
        showArrows={isMobile}
        prevArrowClassname="-left-5"
        nextArrowClassname="-right-5"
        stopslider={true}
      />
    </div>
  );
};

export default TopFiveSection;
