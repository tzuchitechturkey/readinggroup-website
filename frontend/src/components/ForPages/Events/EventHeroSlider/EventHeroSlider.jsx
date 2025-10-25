import React, { useRef, useState, useEffect, useCallback } from "react";

import { Link } from "react-router-dom";
import { Play, Info, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import TopFiveSection from "@/components/ForPages/Home/TopFiveSection/TopFiveSection";
import { useIsMobile } from "@/hooks/use-mobile";
import ArrowButton from "@/components/Global/ArrowButton/ArrowButton";
import HeroTitle from "@/components/Global/HeroTitle/HeroTitle";
import Loader from "@/components/Global/Loader/Loader";
import { GetEventSections, GetTop5EventsBySectionId } from "@/api/events";

export default function HeroSlider({ newsPage = false }) {
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile(1024);
  const [isLoading, setIsLoading] = useState(false);

  const [sliders, setSliders] = useState([]);
  const [api, setApi] = useState(null);
  const timerRef = useRef(null);
  const pausedRef = useRef(false);

  const getSectionsList = async () => {
    try {
      const res = await GetEventSections(100, 0, "");
      return res.data.results;
    } catch (error) {
      console.error("Error fetching sections list:", error);
      return [];
    }
  };

  const topFiveBySectionId = async (sectionId) => {
    try {
      const res = await GetTop5EventsBySectionId(sectionId);
      return res.data.results;
    } catch (error) {
      console.error("Error fetching top five videos:", error);
      return [];
    }
  };

  const startAuto = useCallback(() => {
    if (!api || pausedRef.current) return;
    timerRef.current = window.setInterval(() => {
      if (!pausedRef.current) api.scrollNext();
    }, 9000);
  }, [api]);

  const stopAuto = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onEnter = useCallback(() => {
    pausedRef.current = true;
    stopAuto();
  }, [stopAuto]);

  const onLeave = useCallback(() => {
    pausedRef.current = false;
    stopAuto();
    startAuto();
  }, [startAuto, stopAuto]);

  useEffect(() => {
    if (!api) return;
    startAuto();
    return () => stopAuto();
  }, [api, startAuto, stopAuto]);

  useEffect(() => {
    const fetchSectionsWithTop5 = async () => {
      setIsLoading(true);

      const sections = await getSectionsList();

      const slidersData = await Promise.all(
        sections.map(async (section) => {
          const topFive = await topFiveBySectionId(section.id);

          return {
            id: section.id,
            image: section.image,
            h1Line1: section.title,
            h1Line2Prefix: section.prefix,
            h1Line2Under: section.under,
            description: section.description,
            primaryTo: section.primaryTo,
            secondaryTo: section.secondaryTo,
            topFive,
          };
        })
      );

      setSliders(slidersData);
      setIsLoading(false);
    };

    fetchSectionsWithTop5();
  }, []);

  return (
    <div className="w-full lg:pt-8">
      {isLoading && <Loader />}
      <Carousel
        className="w-full"
        opts={{ align: "center", loop: true, skipSnaps: false }}
        setApi={setApi}
      >
        <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
          <CarouselContent
            className={` ${
              i18n.language === "ar"
                ? "flex-row-reverse"
                : "flex-row -ml-2 md:-ml-4"
            }`}
          >
            {sliders.map((slide) => (
              <CarouselItem
                key={slide.id}
                className="pl-2 md:pl-4 md:basis-4/5 lg:basis-11/12"
              >
                <div className="relative w-full min-h-[600px] md:min-h-[660px]  lg:min-h-[700px]  py-8 md:py-12 overflow-hidden rounded-2xl shadow-2xl group">
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
                      <div className="pb-24 md:pb-32 lg:pb-40">
                        <HeroTitle
                          h1Line1={slide.h1Line1}
                          h1Line2Prefix={newsPage ? "" : slide.h1Line2Prefix}
                          h1Line2Under={newsPage ? "" : slide.h1Line2Under}
                          description={newsPage ? "" : slide.description}
                          titleClassName={newsPage ? "font-semibold" : ""}
                        />

                        {/* Start Actions */}
                        <div className="mt-4">
                          {newsPage ? (
                            <div className=" flex items-center gap-3 mt-6">
                              <Link
                                to={slide.primaryTo}
                                className="inline-flex items-center gap-2 rounded-full text-white px-4 py-2.5 md:px-5 md:py-3 text-sm font-semibold shadow transition-all duration-200"
                                style={{
                                  background:
                                    "linear-gradient(90deg, #6512CF 0%, #321AC5 100%)",
                                }}
                                aria-label={t("Play")}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background =
                                    "linear-gradient(90deg, #321AC5 0%, #6512CF 100%)";
                                  e.currentTarget.style.transform =
                                    "scale(1.06)";
                                  e.currentTarget.style.boxShadow =
                                    "0 4px 24px 0 rgba(50,26,197,0.18)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background =
                                    "linear-gradient(90deg, #6512CF 0%, #321AC5 100%)";
                                  e.currentTarget.style.transform = "scale(1)";
                                  e.currentTarget.style.boxShadow = "";
                                }}
                              >
                                {t("WATCH NOW")}
                              </Link>
                              <button
                                className="border-[1px] border-white rounded-full px-3 py-1 transition-all duration-200 bg-white/10 hover:bg-white/30 hover:scale-110 shadow hover:shadow-lg"
                                style={{ backdropFilter: "blur(2px)" }}
                                aria-label={t("Add")}
                              >
                                <Plus className="h-6 w-6 md:h-7 md:w-7 text-white/90 group-hover:text-white transition-colors duration-200" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
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
                          )}
                        </div>
                        {/* Start Actions */}
                      </div>
                    </div>
                  </div>
                  {/* End Title && Actions */}

                  <div className="pointer-events-auto absolute left-6 right-6 bottom-3 md:bottom-10 z-10">
                    <TopFiveSection data={slide.topFive} />
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
