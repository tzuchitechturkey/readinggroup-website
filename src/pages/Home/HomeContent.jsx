import React from "react";

import HeroSlider from "@/components/ForPages/Home/HeroSliderSection/HeroSlider";
import TopFiveSection from "@/components/ForPages/Home/TopFiveSection/TopFiveSection";
import WeeklyMoments from "@/components/ForPages/Home/WeeklyMomentsSection/WeeklyMoments";
import WeekPhotos from "@/components/ForPages/Home/WeekPhotosSection/WeekPhotos";
import GuidedReading from "@/components/ForPages/Home/GuidedReadingSeciotn/GuidedReading";
import VideoSections from "@/components/ForPages/Home/VideoSections/VideoSections";

function HomeContent() {
  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Top 5 Videos Section */}
      <TopFiveSection />

      {/* Weekly Moments */}
      <WeeklyMoments />

      {/* Week's Photos */}
      <WeekPhotos />

      {/* Guided Reading */}
      <GuidedReading />

      {/* Video Sections */}
      <VideoSections />
    </div>
  );
}

export default HomeContent;
