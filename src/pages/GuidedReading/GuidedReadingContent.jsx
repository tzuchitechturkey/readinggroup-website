import React, { useState } from "react";

import { useTranslation } from "react-i18next";

import LearnFilter from "@/components/Global/LearnFilter/LearnFilter";
import WeeklyMoments from "@/components/ForPages/Home/WeeklyMomentsSection/WeeklyMoments";
import FilterSections from "@/components/ForPages/Videos/FilterSections/FilterSections";
import GuidedReading from "@/components/ForPages/Home/GuidedReadingSeciotn/GuidedReading";
import VideoSections from "@/components/ForPages/Home/VideoSections/VideoSections";

function GuidedReadingContent() {
  const { t } = useTranslation();
  const [searchDate, setSearchDate] = useState("");
  const [type, setType] = useState("");
  const [theme, setTheme] = useState("");
  return (
    <div>
      {/* Start Header */}
      <div
        className="min-h-[85vh] bg-cover bg-bottom"
        style={{
          backgroundImage: `url(../../../src/assets/guiding-reading.png)`,
        }}
      >
        {/* Start Texts */}
        <div className="text-white flex flex-col items-center pt-32 max-w-3xl mx-auto">
          <p className="text-5xl font-bold">{t("Guided Reading")}</p>
          <p className="text-2xl font-bold mt-8 text-center leading-loose">
            {t(
              "Explore inspirational stories, picture cards, and photo albums that connect hearts across the world"
            )}
          </p>
        </div>
        {/* End Texts */}
      </div>
      {/* End Header */}

      {/* Start FIlter */}
      <LearnFilter
        t={t}
        searchDate={searchDate}
        setSearchDate={setSearchDate}
        type={type}
        setType={setType}
        theme={theme}
        setTheme={setTheme}
      />
      {/* End FIlter */}

      {/* Start Filter Secion */}
      <div className="mt-12">
        <FilterSections />
      </div>
      {/* End Filter Secion */}
      {/* Weekly Moments */}
      <WeeklyMoments />

      {/* Guided Reading */}
      <GuidedReading />

      {/* Video Sections */}
      <VideoSections />
    </div>
  );
}

export default GuidedReadingContent;
