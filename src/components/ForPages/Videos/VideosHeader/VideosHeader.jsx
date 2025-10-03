import React from "react";

import { Play, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import BrokenCarousel from "@/components/Global/BrokenCarousel/BrokenCarousel";
import { mockVideos } from "@/mock/Viedeos";
import { resolveAsset } from "@/utils/assetResolver";

const heroBackground = resolveAsset("authback.jpg");
const heroOverlay = resolveAsset("videoPageblurBack.png");

function VideosHeader() {
  const { t } = useTranslation();

  return (
    <div className="relative    min-h-screen   overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center  "
        style={{
          backgroundImage: `url(${heroBackground})`,
        }}
      />
      <img
        src={heroOverlay}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover  "
      />
      {/* Overlay */}

      {/* Start Content */}
      <div className="relative h-screen flex flex-col  justify-between   ">
        {/* Start Text */}
        <div className="max-w-4xl px-9 flex-1 flex flex-col justify-end  ">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
            {t("School activity")}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6 text-xl">
            <span className="px-1 py-1 text-white">Journey</span>
            <span className="px-1 py-1 text-white">Documentary - Drama</span>
            <span className="px-1 py-1 text-white">Humanitarian 1h 28m</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button className="bg-white font-bold text-black hover:bg-gray-200 px-6 py-3">
              <Play className="w-4 h-4 mr-2" />
              {t("Watch Now")}
            </Button>
            <Button
              variant="outline"
              className="border-white font-bold text-black hover:bg-white hover:text-black px-6 py-3"
            >
              {t("More Info")}
              <Info className="w-4 h-4 mr-2" />
            </Button>
          </div>
        </div>
        {/* End Text */}
        {/* Start Weekly Videos Carousel */}
        <div className="mt-12 w-full -mb-2  pr-2 ">
          <BrokenCarousel
            data={mockVideos}
            title={t("This Week's Videos")}
            showCount={4}
          />
        </div>
        {/* End Weekly Videos Carousel */}
      </div>
      {/* End Content */}
    </div>
  );
}

export default VideosHeader;
