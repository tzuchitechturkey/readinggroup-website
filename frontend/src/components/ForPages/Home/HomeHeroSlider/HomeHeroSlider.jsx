import React from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import FeaturedVideoPlayer from "@/components/ForPages/Home/HomeHeroSlider/FeaturedVideoPlayer";

export default function HomePageHeroSlider({ fullLiveStream }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="w-full">
      {/* Start Featured Video */}
      <FeaturedVideoPlayer
        item={fullLiveStream || {}}
        t={t}
        navigate={navigate}
      />
      {/* End Featured Video */}
    </div>
  );
}
