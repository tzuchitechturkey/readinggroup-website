import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import CarouselControls from "@/components/Global/CarouselControls/CarouselControls";

const TeamFunctionCarousel = ({ bannerImages = [] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const slides =
    bannerImages?.length > 0
      ? bannerImages
      : ["https://placehold.co/800x450/cbd5e1/475569?text=No+Banner+Available"];

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-md shadow-md" ref={emblaRef}>
        <div className="flex h-[250px] sm:h-[300px] lg:h-[385px]">
          {slides?.map((image, index) => (
            <div className="flex-[0_0_100%] min-w-0 relative" key={index}>
              <img
                src={image?.image}
                alt={`Team Slide ${index + 1}`}
                className="w-full h-full object-cover transition-opacity duration-700"
              />
            </div>
          ))}
        </div>
      </div>

      <CarouselControls
        canPrev={canPrev}
        canNext={canNext}
        onPrev={() => emblaApi?.scrollPrev()}
        onNext={() => emblaApi?.scrollNext()}
        count={scrollSnaps.length}
        current={selectedIndex}
        onDotClick={(index) => emblaApi?.scrollTo(index)}
        activeClass="bg-[#7d93b3]"
        inactiveClass="bg-[#c8d4e5]"
        buttonClass="text-[#7d93b3]"
      />
    </div>
  );
};

const TeamFunctionsSection = ({ data }) => {
  return (
    <div className="space-y-16 lg:space-y-20 max-w-[1200px] mx-auto ">
      {data?.map((team, index) => (
        <div
          key={index}
          className={`flex flex-col ${index % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-10 items-center lg:min-h-[435px]`}
        >
          <div className="w-full lg:w-[60%] shrink-0">
            <TeamFunctionCarousel bannerImages={team?.images} />
          </div>

          <div className="w-full lg:w-[40%] flex flex-col justify-center px-2 ">
            <h3 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-[#112344] mb-4 leading-tight">
              {team?.title}
            </h3>
            <p
              className="text-[#4a6288] leading-relaxed text-sm lg:text-base font-medium"
              dangerouslySetInnerHTML={{
                __html: team?.description,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamFunctionsSection;
