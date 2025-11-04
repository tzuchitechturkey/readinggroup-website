import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import HeroSlider from "@/components/ForPages/Home/HeroSliderSection/HeroSlider";
import WeeklyMomentsCard from "@/components/Global/WeeklyMomentsCard/WeeklyMomentsCard";
import WeekPhotosCard from "@/components/Global/WeekPhotosCard/WeekPhotosCard";
import GuidingReadingcard from "@/components/Global/GuidingReadingcard/GuidingReadingcard";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import { HomeData } from "@/api/home";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import HeadingBlock from "@/components/ForPages/Home/HeadingBlock/HeadingBlock";
import Band from "@/components/ForPages/Home/Band/Band";
import { GetStatistics } from "@/api/dashboard";

export default function HomeContent() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const direction = isRtl ? "rtl" : "ltr";
  const [sliderData, setSliderData] = useState(null);
  const [top1Data, setTop1Data] = useState(null);

  const getSliderData = async () => {
    try {
      const res = await HomeData();
      setSliderData(res.data);
    } catch (error) {
      setErrorFn(error, t);
    }
  };

  const getTop1Data = async () => {
    try {
      const res = await GetStatistics();
      setTop1Data(res.data?.top_liked);
    } catch (error) {
      setErrorFn(error, t);
    }
  };

  useEffect(() => {
    getSliderData();
    getTop1Data();
    localStorage.removeItem("redirectAfterLogin");
  }, []);

  return (
    <div dir={direction} className="min-h-screen">
      {/* Start Hero Slider */}
      <div dir="ltr">
        <HeroSlider data={sliderData} />
      </div>
      {/* End Hero Slider */}

      {/* 1) This Weekly Card */}
      <Band tone="blue">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-1">
            <HeadingBlock
              title={t("This Weekly Card")}
              description={t(
                "Stay updated with this week's top moments, from community gatherings to global highlights."
              )}
              to="/cards-photos"
              ctaLabel={t("See more")}
            />
          </div>

          <div className="order-2">
            <div className="relative w-full flex justify-end">
              <div className="relative w-[92%] md:w-[460px]">
                <div className="absolute -right-3 -top-3 w-full h-full rounded-[32px] bg-gradient-to-br from-[#eef6ff] to-[#e6f0ff] shadow-[0_40px_80px_rgba(40,80,160,0.12)]" />
                <div className="relative z-10">
                  <WeeklyMomentsCard item={top1Data?.post_card} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Band>

      {/* 2) This Week's Photos */}
      <Band tone="light">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="relative w-full md:w-[440px]">
              <div className="absolute left-0 -top-3 w-full h-[95%] rounded-[32px] bg-gradient-to-br from-[#eef6ff] to-[#e6f0ff] shadow-[0_40px_80px_rgba(40,80,160,0.12)]" />
              <div className="relative z-10 -ml-3">
                <WeekPhotosCard item={top1Data?.post_photo} />
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <HeadingBlock
              title={t("This Week's Photos")}
              description={t(
                "A visual snapshot of the week — photos that highlight stories, people, and places."
              )}
              to="/cards-photos"
              ctaLabel={t("See more")}
            />
          </div>
        </div>
      </Band>

      {/* 3) This Week's Guided Reading */}
      <Band tone="blue">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-1">
            <HeadingBlock
              title={t("This Week's Guided Reading")}
              description={t(
                "Dive into this week's guided readings — inspiring stories, thoughtful articles, and meaningful reflections curated for you."
              )}
              to="/guiding-reading"
              ctaLabel={t("See more")}
            />
          </div>

          <div className="order-2">
            <div className="relative w-full flex justify-end">
              <div className="relative w-[92%] md:w-[420px]">
                <div className="absolute -right-3 -top-3 w-full h-full rounded-[24px] bg-gradient-to-br from-[#eef6ff] to-[#f7fbff] shadow-[0_40px_80px_rgba(40,80,160,0.12)]" />
                <div className="relative z-10">
                  <GuidingReadingcard item={top1Data?.post_reading} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Band>

      {/* 4) This Week's Full Videos */}
      <Band tone="light">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="relative w-full md:w-[560px]">
              <div className="relative z-10 ml-3 md:ml-6">
                <div className="rounded-[24px] overflow-hidden h-[320px] md:h-[360px]">
                  <VideoCard
                    className="h-full w-full"
                    item={top1Data?.video}
                    VideoCard={true}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <HeadingBlock
              title={t("This Week's Full Video")}
              description={t(
                "Watch the full videos of the week — complete stories, in-depth talks, and powerful highlights brought to life on screen."
              )}
              to="/videos"
              ctaLabel={t("See more")}
            />
          </div>
        </div>
      </Band>

      {/* 5) This Week's Unit Videos */}
      <Band tone="blue">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-1">
            <HeadingBlock
              title={t("This Week's Event")}
              description={t(
                "Watch this week's events and stay up-to-date on the most important happenings"
              )}
              to="/videos/unit"
              ctaLabel={t("See more")}
            />
          </div>

          <div className="order-2">
            <div className="relative w-full md:w-[560px]">
              <div className="relative z-10 -mr-3 md:-mr-0">
                <div className="rounded-[24px] overflow-hidden h-[320px] md:h-[360px]">
                  <VideoCard className="h-full w-full" item={top1Data?.event} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Band>
    </div>
  );
}
