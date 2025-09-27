import React from "react";

import VideoCard from "@/components/Global/VideoCard/VideoCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function BrokenCarousel({ data, title, showArrows = false, showCount = 3 }) {
  return (
    <div>
      {title && (
        <p className="text-3xl px-4 text-white font-bold mb-4">{title}</p>
      )}
      <Carousel className="w-full overflow-visible ">
        <CarouselContent className="px-1">
          {data.map((item) => (
            <CarouselItem
              key={item.id}
              className={` py-2 basis-full sm:basis-1/2 md:basis-[28.57%] lg:basis-[28.57%] ${
                showCount === 4 ? " xl:basis-[22.57%]" : " xl:basis-[27.57%]"
              }  overflow-visible h-52`}
            >
              <VideoCard item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {showArrows && (
          <>
            <CarouselNext />
            <CarouselPrevious />
          </>
        )}
      </Carousel>
    </div>
  );
}

export default BrokenCarousel;
