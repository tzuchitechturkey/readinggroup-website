import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import authbackImg from "@/assets/authback.jpg";

export default function CarouselDemo() {
  const slides = [
    {
      id: 1,
      image: authbackImg,
      title: "School activity",
      subtitle: "",
      buttonText: "WATCH NOW",
      hasVideo: true,
    },
    {
      id: 2,
      image: authbackImg,
      title: "Reading Session",
      subtitle: "",
      buttonText: "JOIN NOW",
      hasVideo: false,
    },
    {
      id: 3,
      image: authbackImg,
      title: "Learning Together",
      subtitle: "",
      buttonText: "EXPLORE",
      hasVideo: false,
    },
  ];
  return (
    <div className="w-full pt-8  ">
      <Carousel
        className="w-full  "
        opts={{
          align: "center",
          loop: true,
          skipSnaps: false,
        }}
      >
        <CarouselContent className="  md:-ml-4 px-2">
          {slides.map((slide) => (
            <CarouselItem
              key={slide.id}
              className=" md:pl-4  border-[red] md:basis-4/5 lg:basis-11/12"
            >
              <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl group cursor-pointer">
                {/* Start Background image */}
                <div
                  className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                  }}
                >
                  {/* Start Dark Background */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                  {/* End Dark Backgorund*/}

                  {/* Start Content */}
                  <div className="absolute inset-0 flex items-end">
                    <div className="text-left text-white px-6 md:px-16 pb-8 md:pb-[70px] max-w-2xl transform transition-all duration-300">
                      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                        {slide.title}
                      </h1>
                      {slide.subtitle && (
                        <p className="text-base md:text-lg mb-8 opacity-90 max-w-lg">
                          {slide.subtitle}
                        </p>
                      )}

                      {/* Start Buttons */}
                      <div className="flex items-center gap-4">
                        <button className="bg-[#4680FF] hover:bg-blue-700 text-white px-6 md:px-8 py-3 md:py-3 rounded-full font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 uppercase tracking-wide">
                          {slide.buttonText}
                        </button>
                        {slide.hasVideo && (
                          <button className="p-2 px-5 font-bold border-[1px] border-white rounded-full flex items-center justify-center text-white text-xl hover:bg-white/30 transition-all duration-200 hover:scale-110">
                            +
                          </button>
                        )}
                      </div>
                      {/* End Buttons */}
                    </div>
                  </div>
                  {/* End Content */}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
