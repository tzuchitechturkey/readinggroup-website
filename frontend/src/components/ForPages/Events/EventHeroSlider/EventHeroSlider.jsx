import React, { useState, useEffect } from "react";

import { Play, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { GetTop5ViewedEvent } from "@/api/events";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import BrokenCarousel from "@/components/Global/BrokenCarousel/BrokenCarousel";
import EventCard from "@/components/Global/EventCard/EventCard";
import Loader from "@/components/Global/Loader/Loader";

export default function EventHeroSlider({ top1Event }) {
  const { t } = useTranslation();
  const [firstEvent, setFirstEvent] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [top5Events, setTop5Events] = useState([]);

  const fetchSectionsWithTop5 = async () => {
    setIsLoading(true);
    try {
      const response = await GetTop5ViewedEvent();
      setTop5Events(response?.data || []);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionsWithTop5();
  }, []);
  useEffect(() => {
    setFirstEvent(top1Event !== null ? top1Event : top5Events[0]);
  }, [top1Event, top5Events]);
  return (
    <div className="relative min-h-screen overflow-hidden">
      {isLoading && <Loader />}
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center  "
        style={{
          backgroundImage: `url(${firstEvent?.image || firstEvent?.image_url})`,
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
            {firstEvent?.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 m-2 mb-6  text-xl ">
            {firstEvent?.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {firstEvent?.tags.map((tag, index) => (
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
              to={`/videos/${firstEvent?.id}`}
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
        <div className="mt-12 w-full mb-1  pr-2 ">
          <BrokenCarousel
            data={top5Events}
            title={t("This Week's Videos")}
            showCount={4}
            cardName={EventCard}
          />
        </div>
        {/* End Weekly Videos Carousel */}
      </div>
      {/* End Content */}
    </div>
  );
}
