import * as React from "react";

import { Link } from "react-router-dom";
import { Play, Info, Plus, SquareDashedMousePointer } from "lucide-react";
import { useTranslation } from "react-i18next";

import HeroTitle from "@/components/Global/HeroTitle/HeroTitle";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import TopFiveSection from "@/components/ForPages/Home/TopFiveSection/TopFiveSection";
import { useIsMobile } from "@/hooks/use-mobile";
import ArrowButton from "@/components/Global/ArrowButton/ArrowButton";

export default function HeroSlider({ newsPage = false, data = null }) {
  const { t } = useTranslation();
  const isMobile = useIsMobile(1024);

  const homePageSlider = React.useMemo(() => {
    if (!data) return [];

    const slides = [];

    // Slide 1: Videos
    if (data?.videos && data?.videos.length > 0) {
      const mainVideo = data?.videos[0];
      slides.push({
        id: "videos",
        image: mainVideo.thumbnail || mainVideo.thumbnail_url,
        h1Line1: mainVideo.title || t("This Week's Videos"),
        h1Line2Prefix: "",
        h1Line2Under: t("— watch now"),
        description:
          mainVideo.description ||
          t(
            "Watch this week's featured videos — stories, reports, and highlights captured in motion."
          ),
        primaryTo: `/videos/${mainVideo.id}`,
        secondaryTo: "/videos",
        allData: data?.videos,
      });
    }

    // Slide 2: Contents
    if (data?.contents && data?.contents.length > 0) {
      const mainContent = data?.contents[0];
      slides.push({
        id: "contents",
        image:
          mainContent.images[0]?.image ||
          mainContent.image_url[0]?.image ||
          "/authback.jpg",
        h1Line1: mainContent.title || t("Contents"),
        h1Line2Prefix: "",
        h1Line2Under: t("— Contents for you"),
        description:
          mainContent.description ||
          t("Dive into inspiring contents and thoughtful insights every week."),
        primaryTo: `/contents/content/${mainContent.id}`,
        secondaryTo: "/contents",
        allData: data?.contents,
      });
    }

    // Slide 3: Cards & Photos
    if (data?.posts_card_photo && data?.posts_card_photo.length > 0) {
      const mainCard = data?.posts_card_photo[0];
      slides.push({
        id: "cards",
        image: mainCard.image || mainCard.image_url || "/authback.jpg",
        h1Line1: mainCard.title || t("Cards & Photos"),
        h1Line2Prefix: "",
        h1Line2Under: t("— Cards & Photos weekly"),
        description:
          mainCard.description ||
          t("Visual snapshots that highlight stories, people, and places."),
        primaryTo: `/cards-photos/card/${mainCard.id}`,
        secondaryTo: "/cards-photos",
        allData: data?.posts_card_photo,
      });
    }
    // Slide 4: Top Section Events
    if (data?.top_section?.id && data?.top_section?.events?.length > 0) {
      const mainCard = data?.top_section?.events[0];
      slides.push({
        id: "events",
        image: mainCard.image || mainCard.image_url,
        h1Line1: mainCard.title,
        h1Line2Prefix: "",
        h1Line2Under: t("— Events weekly"),
        description: mainCard.description,
        primaryTo:
          mainCard?.report_type === "videos"
            ? `/events/video/${mainCard.id}`
            : `/events/report/${mainCard.id}`,
        secondaryTo: "/events",
        allData: data?.top_section?.events,
      });
    }

    return slides;
  }, [data, t]);

  const sliders = newsPage ? newsPageSlider : homePageSlider;
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
    if (api) {
      startAuto();
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [api, startAuto]);

  return (
    <div className="w-full lg:pt-8">
      <Carousel
        className="w-full"
        opts={{ align: "center", loop: true, skipSnaps: false }}
        setApi={setApi}
      >
        <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
          <CarouselContent className="-ml-2 md:-ml-4">
            {sliders.map((slide) => (
              <CarouselItem
                key={slide.id}
                className="pl-2 md:pl-4 md:basis-4/5 lg:basis-11/12"
              >
                <div
                  className={`relative w-full min-h-[600px] md:min-h-[660px]  lg:min-h-[700px]  py-8 md:py-12 overflow-hidden rounded-2xl shadow-2xl group`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${slide.image})` }}
                    role="img"
                    aria-label={slide.h1Line1}
                  />
                  <div className="absolute inset-0 bg-black/70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />
                  {/* Start Title && Actions */}
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
                                {slide?.id === "videos" ? (
                                  <Play
                                    className="h-4 w-4 md:h-5 md:w-5 fill-black text-black"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <SquareDashedMousePointer className="h-4 w-4 md:h-5 md:w-5 text-black" />
                                )}
                                {slide?.id === "videos"
                                  ? t("Play")
                                  : t("Browse Now")}
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

                  {/* Start Top Five Section */}
                  <div className="pointer-events-auto absolute left-1 right-1 bottom-3 md:bottom-10 z-10">
                    <TopFiveSection data={slide.allData} />
                  </div>
                  {/* End Top Five Section */}
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
