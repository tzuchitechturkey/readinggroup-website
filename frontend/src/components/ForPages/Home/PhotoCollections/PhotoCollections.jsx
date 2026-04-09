import React, { useEffect, useState, useRef } from "react";

import { useNavigate } from "react-router-dom";

import CollectionCard from "@/components/ForPages/Home/shared/CollectionCard";
import SectionHeader from "../shared/SectionHeader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const PhotoCollections = ({ t, data }) => {
  const navigate = useNavigate();
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const autoplayRef = useRef(null);

  const handleMoreCollectionsClick = () => {
    navigate(`/photo-collections`);
  };

  // Track current slide and set up auto-scroll
  useEffect(() => {
    if (!api) return;

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap());
    };

    const handleReInit = () => {
      setScrollSnaps(api.scrollSnapList());
      updateCurrent();
    };

    // Clear previous interval
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }

    // Set up auto-scroll every 5 seconds
    autoplayRef.current = setInterval(() => {
      api.scrollNext();
    }, 5000);

    handleReInit();
    api.on("reInit", handleReInit);
    api.on("select", updateCurrent);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
      api.off("reInit", handleReInit);
      api.off("select", updateCurrent);
    };
  }, [api]);

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px] lg:gap-[24px] items-start px-4 sm:px-6 md:px-8 lg:px-0 w-full lg:w-[1200px] mx-auto pb-12 sm:pb-16 md:pb-20 lg:pb-24">
      {/* Section Header */}
      <SectionHeader
        title={t("PHOTOS FROM LATEST LIVESTREAM")}
        actionText={t("More Collections")}
        onActionClick={handleMoreCollectionsClick}
      />

      {/* Photo Carousel */}
      {data && data.length > 0 ? (
        <div className="w-full">
          <div className="group relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
                slidesToScroll: 1,
              }}
              setApi={setApi}
              className="w-full"
            >
              <CarouselContent className="-ml-4 md:-ml-5">
                {data.map((photo) => (
                  <CarouselItem key={photo.id} className="pl-4 md:pl-5 basis-1/2">
                    <CollectionCard
                      photo={photo}
                      isNew={photo.isNew}
                      handleNavigate={handleMoreCollectionsClick}
                      t={t}
                      fromHomePage={true}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Slide Indicators */}
          {scrollSnaps.length > 0 && (
            <div className="flex gap-2 justify-center w-full mt-6 md:mt-8">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-2 md:h-2.5 rounded-full transition-all ${
                    current === index
                      ? "bg-[#5E82AB] w-6 md:w-8"
                      : "bg-[#5E82AB]/50 w-2 md:w-2.5 "
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-[200px] rounded-xl border border-dashed border-gray-300 bg-gray-50">
          <p className="text-gray-400 text-sm">{t("No photos available")}</p>
        </div>
      )}
    </div>
  );
};

export default PhotoCollections;
