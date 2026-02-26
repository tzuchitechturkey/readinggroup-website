import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import FeaturedVideoPlayer from "@/components/ForPages/Home/HomeHeroSlider/FeaturedVideoPlayer";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { GetVideosByTypeVideo } from "@/api/videos";

export default function HomePageHeroSlider({ fullLiveStream }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  console.log("fullLiveStream in HomePageHeroSlider:", fullLiveStream);
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
