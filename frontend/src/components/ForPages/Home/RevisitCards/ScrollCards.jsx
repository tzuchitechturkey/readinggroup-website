import { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import RevisitCard from "../shared/RevisitCard";

export default function ScrollCards({ items, t, direction }) {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const autoplayRef = useRef(null);

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
  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[200px] rounded-xl border border-dashed border-white/40 bg-white/10">
        <p className="text-white/60 text-sm">{t("No cards available")}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="group relative px-5">
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
            {items.map((item) => {
              return (
                <CarouselItem
                  key={item.id}
                  className={`pl-4 md:pl-5 ${direction === "horizontal" ? "basis-1/2 md:basis-1/2" : "basis-1/2 md:basis-1/2 lg:basis-1/4"}`}
                >
                  <RevisitCard item={item} t={t} />
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Navigation Buttons - Hidden by default, shown on hover */}
          <CarouselPrevious className=" hidden md:flex w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent border-[1px] border-white   text-white rounded-full" />
          <CarouselNext className=" hidden md:flex w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent border-[1px] border-white   text-white rounded-full" />
        </Carousel>
      </div>

      {/* Slide Indicators */}
      {scrollSnaps.length > 0 && (
        <div className="flex gap-2 justify-center w-full mt-3 ">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 md:h-2.5 rounded-full transition-all ${
                current === index
                  ? "bg-white w-6 md:w-8"
                  : "bg-white/50 w-2 md:w-2.5 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
