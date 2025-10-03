import * as React from "react";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import HeroSlider from "@/components/ForPages/Home/HeroSliderSection/HeroSlider";
import WeeklyMomentsCard from "@/components/Global/WeeklyMomentsCard/WeeklyMomentsCard";
import WeekPhotosCard from "@/components/Global/WeekPhotosCard/WeekPhotosCard";
import GuidingReadingcard from "@/components/Global/GuidingReadingcard/GuidingReadingcard";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
// Import assets so Vite bundles them and rewrites URLs correctly for GitHub Pages
import authback from "@/assets/authback.jpg";
import weeklyImages from "@/assets/weekly-images.jpg";

function Band({ children, tone = "light" }) {
  const toneClass =
    tone === "blue"
      ? "bg-gradient-to-b from-[#eef6ff] to-white"
      : "bg-gradient-to-b from-slate-50 to-white";
  return (
    <section className={`${toneClass} py-12 md:py-16`}>
      <div className="container mx-auto max-w-7xl px-6">{children}</div>
    </section>
  );
}

function HeadingBlock({ title, description, ctaLabel, to = "#" }) {
  const { t } = useTranslation();
  const label = ctaLabel ?? t("See more");
  // HeadingBlock doesn't need to set document direction itself.
  // Direction is handled at the page root (HomeContent).

  return (
    <div>
      <h3 className="text-[40px] md:text-[56px] leading-[1.02] font-serif font-bold mb-4 md:mb-6">
        {title}
      </h3>
      {description ? (
        <p className="text-base md:text-lg mb-6 md:mb-8 max-w-xl text-slate-700">
          {description}
        </p>
      ) : null}
      <Link
        to={to}
        className="inline-flex items-center bg-[#0b63d6] hover:bg-[#0956b8] text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg shadow-md text-sm md:text-base font-semibold transition"
        aria-label={label}
      >
        {label}
      </Link>
    </div>
  );
}

export default function HomeContent() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const direction = isRtl ? "rtl" : "ltr";

  const sampleMoment = {
    image: authback,
    title: t("Report: Community Gathering"),
    startTime: t("6:00 AM"),
    date: t("SEPT 02"),
    type: t("News"),
    source: t("Community"),
    language: t("AR / EN"),
  };

  const samplePhoto = {
    id: "photo-hero",
    image: weeklyImages,
    title: t("Alexander Bastian"),
    subtitle: t("Session Photo"),
  };

  const sampleReading = {
    id: "guide-1",
    badge: t("New"),
    title: t("Start with Small Steps, Inspire Big Change"),
    author: t("Anas Daas"),
    rating: 4.6,
    reviews: 1.2,
  };

  const sampleFullVideo = {
    id: "vid-full",
    image: authback,
    title: t("This Week’s Full Highlight"),
    duration: t("1:20"),
    unit: t("Weekly Feature"),
  };

  const sampleUnitVideo = {
    id: "vid-unit",
    image: authback,
    title: t("Community Activity"),
    duration: t("25:00"),
    unit: t("Unit Video"),
  };

  return (
    <div dir={direction} className="min-h-screen">
      {/* Hero Slider */}
      <div dir="ltr">
        <HeroSlider />
      </div>

      {/* 1) This Weekly Moments */}
      <Band tone="blue">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-1">
            <HeadingBlock
              title={t("This Weekly Moments")}
              description={t(
                "Stay updated with this week’s top moments, from community gatherings to global highlights."
              )}
              to="/weekly-moments"
              ctaLabel={t("See more")}
            />
          </div>

          <div className="order-2">
            <div className="relative w-full flex justify-end">
              <div className="relative w-[92%] md:w-[460px]">
                <div className="absolute -right-3 -top-3 w-full h-full rounded-[32px] bg-gradient-to-br from-[#eef6ff] to-[#e6f0ff] shadow-[0_40px_80px_rgba(40,80,160,0.12)]" />
                <div className="relative z-10">
                  <WeeklyMomentsCard item={sampleMoment} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Band>

      {/* 2) This Week’s Photos */}
      <Band tone="light">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="relative w-full md:w-[440px]">
              <div className="absolute left-0 -top-3 w-full h-[95%] rounded-[32px] bg-gradient-to-br from-[#eef6ff] to-[#e6f0ff] shadow-[0_40px_80px_rgba(40,80,160,0.12)]" />
              <div className="relative z-10 -ml-3">
                <WeekPhotosCard item={samplePhoto} />
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <HeadingBlock
              title={t("This Week’s Photos")}
              description={t(
                "A visual snapshot of the week — photos that highlight stories, people, and places."
              )}
              to="/cards-photos"
              ctaLabel={t("See more")}
            />
          </div>
        </div>
      </Band>

      {/* 3) This Week’s Guided Reading */}
      <Band tone="blue">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-1">
            <HeadingBlock
              title={t("This Week’s Guided Reading")}
              description={t(
                "Dive into this week’s guided readings — inspiring stories, thoughtful articles, and meaningful reflections curated for you."
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
                  <GuidingReadingcard item={sampleReading} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Band>

      {/* 4) This Week’s Full Videos */}
      <Band tone="light">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="relative w-full md:w-[560px]">
              <div className="relative z-10 ml-3 md:ml-6">
                <div className="rounded-[24px] overflow-hidden h-[320px] md:h-[360px]">
                  <VideoCard className="h-full w-full" item={sampleFullVideo} />
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <HeadingBlock
              title={t("This Week’s Full Videos")}
              description={t(
                "Watch the full videos of the week — complete stories, in-depth talks, and powerful highlights brought to life on screen."
              )}
              to="/videos"
              ctaLabel={t("See more")}
            />
          </div>
        </div>
      </Band>

      {/* 5) This Week’s Unit Videos */}
      <Band tone="blue">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-1">
            <HeadingBlock
              title={t("This Week’s Unit Videos")}
              description={t(
                "Watch this week’s featured videos — stories, reports, and highlights captured in motion."
              )}
              to="/videos/unit"
              ctaLabel={t("See more")}
            />
          </div>

          <div className="order-2">
            <div className="relative w-full md:w-[560px]">
              <div className="relative z-10 -mr-3 md:-mr-0">
                <div className="rounded-[24px] overflow-hidden h-[320px] md:h-[360px]">
                  <VideoCard className="h-full w-full" item={sampleUnitVideo} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Band>
    </div>
  );
}
