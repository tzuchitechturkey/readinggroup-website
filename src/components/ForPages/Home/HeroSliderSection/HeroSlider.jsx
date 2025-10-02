import * as React from "react";

import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import TopFiveSection from "@/components/ForPages/Home/TopFiveSection/TopFiveSection";
import authbackImg from "@/assets/authback.jpg";
import { useIsMobile } from "@/hooks/use-mobile";

function ArrowButton({ side, onClick, label }) {
  const isLeft = side === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[
        "absolute top-1/2 -translate-y-1/2 z-20 transition",
        isLeft ? "left-3 md:left-6" : "right-3 md:right-6",
        "h-11 w-11 md:h-12 md:w-12 grid place-items-center rounded-full",
        "bg-white/15 text-white backdrop-blur-sm shadow-lg",
        "ring-1 ring-white/20 hover:bg-white/25 hover:ring-white/30",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b63d6]",
      ].join(" ")}
    >
      {isLeft ? (
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
      ) : (
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
      )}
    </button>
  );
}

function HeroTitle({ h1Line1, h1Line2Prefix, h1Line2Under, description }) {
  return (
    <>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.06] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] text-left max-w-3xl">
        <span className="block">{h1Line1}</span>
        <span className="block">
          {h1Line2Prefix}{" "}
          {h1Line2Under ? (
            <span className="relative inline-block underline decoration-2 decoration-[#2ea5ff] underline-offset-6">
              {h1Line2Under}
            </span>
          ) : null}
        </span>
      </h1>

      <p className="mt-4 text-sm md:text-base text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] text-left max-w-2xl">
        {description}
      </p>
    </>
  );
}

export default function CarouselDemo() {
  const { t } = useTranslation();
  const isMobile = useIsMobile(1024);

  const slides = [
    {
      id: 1,
      image: authbackImg,
      h1Line1: t("Discover Weekly Moments, Photos"),
      h1Line2Prefix: "",
      h1Line2Under: t("— all in one place."),
      description: t(
        "Stay connected with highlights, inspiring stories, and community updates every week."
      ),
      primaryTo: "/videos",
      secondaryTo: "/about/history",
    },
    {
      id: 2,
      image: authbackImg,
      h1Line1: t("Explore Guided Reading"),
      h1Line2Prefix: "",
      h1Line2Under: t("— curated for you."),
      description: t(
        "Dive into inspiring readings and thoughtful insights every week."
      ),
      primaryTo: "/guiding-reading",
      secondaryTo: "/about/history",
    },
    {
      id: 3,
      image: authbackImg,
      h1Line1: t("Browse Cards & Photos"),
      h1Line2Prefix: "",
      h1Line2Under: t("— captured weekly."),
      description: t(
        "Visual snapshots that highlight stories, people, and places."
      ),
      primaryTo: "/cards-photos",
      secondaryTo: "/connect",
    },
  ];

  const [api, setApi] = React.useState(null);
  const timerRef = React.useRef(null);
  const pausedRef = React.useRef(false);

  const startAuto = React.useCallback(() => {
    if (!api || pausedRef.current) return;
    timerRef.current = window.setInterval(() => {
      if (!pausedRef.current) api.scrollNext();
    }, 9000);
  }, [api]);

  const stopAuto = React.useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onEnter = React.useCallback(() => {
    pausedRef.current = true;
    stopAuto();
  }, [stopAuto]);

  const onLeave = React.useCallback(() => {
    pausedRef.current = false;
    stopAuto();
    startAuto();
  }, [startAuto, stopAuto]);

  React.useEffect(() => {
    if (!api) return;
    startAuto();
    return () => stopAuto();
  }, [api, startAuto, stopAuto]);

  return (
    <div className="w-full pt-8">
      <Carousel
        className="w-full"
        opts={{ align: "center", loop: true, skipSnaps: false }}
        setApi={setApi}
      >
        <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
          <CarouselContent className="-ml-2 md:-ml-4">
            {slides.map((slide) => (
              <CarouselItem
                key={slide.id}
                className="pl-2 md:pl-4 md:basis-4/5 lg:basis-11/12"
              >
                <div className="relative w-full min-h-[640px] md:min-h-[720px] lg:min-h-[780px] py-8 md:py-12 overflow-hidden rounded-2xl shadow-2xl group">
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${slide.image})` }}
                    role="img"
                    aria-label={slide.h1Line1}
                  />
                  <div className="absolute inset-0 bg-black/70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute inset-0 flex items-center">
                    <div className="text-white px-7 md:px-12 w-full max-w-6xl ">
                      <div className="pb-24 md:pb-32 lg:pb-36">
                        <HeroTitle
                          h1Line1={slide.h1Line1}
                          h1Line2Prefix={slide.h1Line2Prefix}
                          h1Line2Under={slide.h1Line2Under}
                          description={slide.description}
                        />

                        <div className="mt-4 flex items-center gap-3">
                          <Link
                            to={slide.primaryTo}
                            className="inline-flex items-center gap-2 rounded-md bg-white text-black px-4 py-2.5 md:px-5 md:py-3 text-sm font-semibold shadow hover:brightness-95"
                            aria-label={t("Play")}
                          >
                            <Play
                              className="h-4 w-4 md:h-5 md:w-5 fill-black text-black"
                              aria-hidden="true"
                            />
                            {t("Play")}
                          </Link>

                          <Link
                            to={slide.secondaryTo}
                            className="inline-flex items-center gap-2 rounded-md bg-white/20 text-white px-4 py-2.5 md:px-5 md:py-3 text-sm font-semibold ring-1 ring-white/30 hover:bg-white/30"
                            aria-label={t("More Info")}
                          >
                            <Info
                              className="h-4 w-4 md:h-5 md:w-5"
                              aria-hidden="true"
                            />
                            {t("More Info")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pointer-events-auto absolute left-6 right-6 bottom-3 md:bottom-20 z-10">
                    <TopFiveSection />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {!isMobile && (
            <>
              <ArrowButton
                side="left"
                label={t("Previous slide")}
                onClick={() => {
                  stopAuto();
                  api?.scrollPrev();
                  startAuto();
                }}
              />
              <ArrowButton
                side="right"
                label={t("Next slide")}
                onClick={() => {
                  stopAuto();
                  api?.scrollNext();
                  startAuto();
                }}
              />
            </>
          )}
        </div>
      </Carousel>
    </div>
  );
}
