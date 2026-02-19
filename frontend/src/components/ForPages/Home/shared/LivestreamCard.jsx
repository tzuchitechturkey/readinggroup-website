import React, { useEffect, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Image from "../../../../assets/livestreen.png";

const LivestreamCard = ({ livestream, t }) => {
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const [imageCarouselApi, setImageCarouselApi] = useState(null);
  const data = [
    { image: Image, title: "", description: "" },
    { image: Image, title: "", description: "" },
    { image: Image, title: "", description: "" },
  ];
  useEffect(() => {
    if (!imageCarouselApi) return;

    const updateButtons = () => {
      setCurrent(imageCarouselApi.selectedScrollSnap());
      setCanPrev(imageCarouselApi.canScrollPrev());
      setCanNext(imageCarouselApi.canScrollNext());
    };

    setCount(imageCarouselApi.scrollSnapList().length);
    updateButtons();

    imageCarouselApi.on("select", updateButtons);
  }, [imageCarouselApi]);

  return (
    <div className="flex flex-col md:flex-row px-0 sm:px-2 md:px-4 lg:px-4 gap-4 sm:gap-5 md:gap-5 lg:gap-5 mt-4 sm:mt-6 md:mt-6 lg:mt-4 items-start md:items-center w-full">
      {/* Left Content */}
      <div className="flex w-full md:w-1/3 flex-col md:flex-row items-start md:items-center self-stretch">
        <div className="flex flex-col gap-[16px] sm:gap-[18px] md:gap-[20px] lg:gap-[24px] h-full items-start py-[8px] sm:py-[10px] md:py-[12px] lg:py-[12px] w-full md:w-[384px]">
          {/* Date Tag */}
          <div className="border-[1px] border-white flex gap-[6px] sm:gap-[7px] md:gap-[8px] lg:gap-[8px] items-center justify-center p-[6px] sm:p-[7px] md:p-[8px] lg:p-[8px] px-[8px] sm:px-[9px] md:px-[10px] lg:px-[10px] rounded-full">
            <p className="font-inter font-normal leading-none text-[#f5f5f5] text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px]">
              {livestream.date}
            </p>
          </div>

          {/* Title */}
          <p className="font-['Noto_Sans_TC:Black',sans-serif] font-black leading-[1.5] text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] text-white w-full whitespace-pre-wrap">
            {livestream.title}
          </p>

          {/* Speakers List */}
          <div className="flex flex-col gap-[3px] sm:gap-[3px] md:gap-[4px] lg:gap-[4px] items-start w-full">
            {livestream.speakers.map((speaker, index) => (
              <ul
                key={index}
                className="flex gap-[3px] sm:gap-[3px] md:gap-[4px] lg:gap-[4px] items-start w-full"
              >
                <li className="flex-1 flex items-center gap-2 sm:gap-3 md:gap-3 lg:gap-4 font-['Noto_Sans_TC:Regular',sans-serif] font-normal leading-[1.5] text-[11px] sm:text-[12px] md:text-[13px] lg:text-sm text-white whitespace-pre-wrap">
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full bg-white`}
                  />
                  {speaker.name}
                </li>
              </ul>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content - Image/Video */}
      <div className="flex flex-col w-full md:flex-1">
        <Carousel
          className=""
          opts={{
            align: "center",
            loop: false,
          }}
          setApi={setImageCarouselApi}
        >
          <CarouselContent>
            {data.map((imageItem, index) => (
              <CarouselItem key={index}>
                <div className="lg:h-[550px] bg-gray-200 overflow-hidden shadow-lg cursor-pointer rounded-lg group relative">
                  <img
                    src={imageItem?.image || imageItem?.image_url}
                    alt={`${imageItem?.title} - ${index + 1}`}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 text-black px-4 py-2 rounded-lg font-bold text-sm">
                      {t("View Details")}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex items-center justify-center gap-3 sm:gap-3 md:gap-4 lg:gap-4 mt-3 sm:mt-3 md:mt-4 lg:mt-4">
          {/* السابق */}
          <button
            onClick={() => imageCarouselApi?.scrollPrev()}
            disabled={!canPrev}
            className={`p-0.5 sm:p-0.5 md:p-1 lg:p-1 rounded-full ${
              canPrev ? "hover:scale-110" : "opacity-40 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="text-white w-4 sm:w-4 md:w-5 lg:w-5 h-4 sm:h-4 md:h-5 lg:h-5" />
          </button>

          {/* dots */}
          <div className="flex gap-1.5 sm:gap-1.5 md:gap-2 lg:gap-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => imageCarouselApi?.scrollTo(index)}
                className={`w-2 sm:w-2 md:w-2.5 lg:w-2.5 h-2 sm:h-2 md:h-2.5 lg:h-2.5 rounded-full transition-all ${
                  current === index
                    ? "bg-white scale-125"
                    : "bg-transparent border border-white"
                }`}
              />
            ))}
          </div>

          {/* التالي */}
          <button
            onClick={() => imageCarouselApi?.scrollNext()}
            disabled={!canNext}
            className={`p-0.5 sm:p-0.5 md:p-1 lg:p-1 rounded-full ${
              canNext ? "hover:scale-110" : "opacity-40 cursor-not-allowed"
            }`}
          >
            <ChevronRight className="text-white w-4 sm:w-4 md:w-5 lg:w-5 h-4 sm:h-4 md:h-5 lg:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LivestreamCard;
