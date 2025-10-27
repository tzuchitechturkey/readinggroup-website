import React, { useEffect, useState } from "react";

import { Play, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";

import { GetTop1Video, GetTop5Videos } from "@/api/videos";
import { Button } from "@/components/ui/button";
import BrokenCarousel from "@/components/Global/BrokenCarousel/BrokenCarousel";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import VideoDetailsContent from "@/pages/Videos/VideoDetails/VideoDetailsContent";

function VideosHeader() {
  const { t } = useTranslation();
  const [top5Videos, setTop5Videos] = useState([]);
  const [top1Video, setTop1Video] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <Link
              to={`/videos/${top1Video?.id}`}
              className="flex items-center justify-center bg-white text-black hover:bg-white/90 transition-all duration-300 rounded-md px-3 xs:px-4 py-1.5 xs:py-2 font-medium text-xs xs:text-sm hover:scale-105 hover:shadow-lg hover:shadow-white/25 group"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Play className="w-3.5 xs:w-4 h-3.5 xs:h-4 mr-1.5 xs:mr-2 transition-all duration-300 group-hover:scale-110 group-hover:translate-x-0.5 pointer-events-none" />
              <span className="text-sm transition-all duration-300 group-hover:font-semibold pointer-events-none">
                {t("Watch Now")}
              </span>
            </Link>
            <Button
              variant="outline"
              className="border-white font-bold text-black hover:bg-white hover:text-black px-6 py-3"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
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
      {/* Video Details Modal - Using Portal to render outside normal DOM hierarchy */}
      {isModalOpen &&
        createPortal(
          <VideoDetailsContent
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
            }}
            videoData={top1Video}
          />,
          document.body
        )}
    </div>
  );
}

export default VideosHeader;
