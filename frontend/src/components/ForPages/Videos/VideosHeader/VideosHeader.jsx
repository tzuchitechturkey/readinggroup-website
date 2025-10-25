import React, { useEffect, useState } from "react";

import { Play, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import { GetTop1Video, GetTop5Videos } from "@/api/videos";
import { Button } from "@/components/ui/button";
import BrokenCarousel from "@/components/Global/BrokenCarousel/BrokenCarousel";
import VideoCard from "@/components/Global/VideoCard/VideoCard";

function VideosHeader() {
  const { t } = useTranslation();
  const [top5Videos, setTop5Videos] = useState([]);
  const [top1Video, setTop1Video] = useState(null);
  const getTop5Videos = async () => {
    try {
      const res = await GetTop5Videos();
      setTop5Videos(res.data);
    } catch (err) {
      console.error("Failed to fetch top 5 videos:", err);
    }
  };
  const getTop1Video = async () => {
    try {
      const res = await GetTop1Video();
      setTop1Video(res.data);
    } catch (err) {
      console.error("Failed to fetch top 1 video:", err);
    }
  };
  useEffect(() => {
    getTop5Videos();
    getTop1Video();
  }, []);
  return (
    <div className="relative    min-h-screen   overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center  "
        style={{
          backgroundImage: `url(${
            top1Video?.thumbnail || top1Video?.thumbnail_url
          })`,
        }}
      />
      <img
        src={"/videoPageblurBack.png"}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover  "
      />
      {/* Overlay */}

      {/* Start Content */}
      <div className="relative h-screen flex flex-col  justify-between   ">
        {/* Start Text */}
        <div className="max-w-4xl px-9 flex-1 flex flex-col justify-end  ">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
            {top1Video?.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 m-2 mb-6  text-xl ">
            {top1Video?.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {top1Video?.tags.map((tag, index) => (
                  <span key={index} className="px-1 py-1 text-white">
                    {tag}
                  </span>
                ))}
              </div>
            )}
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
            data={top5Videos}
            title={t("This Week's Videos")}
            showCount={4}
            cardName={VideoCard}
          />
        </div>
        {/* End Weekly Videos Carousel */}
      </div>
      {/* End Content */}
    </div>
  );
}

export default VideosHeader;
