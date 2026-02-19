import React, { useMemo } from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import FeaturedVideoPlayer from "@/components/ForPages/Home/HomeHeroSlider/FeaturedVideoPlayer";

export default function HomePageHeroSlider({ data = null }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sliders = useMemo(() => {
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
            "Watch this week's featured videos — stories, reports, and highlights captured in motion.",
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

    return slides;
  }, [data, t]);

  const mainSlide = sliders[0];

  return (
    <div className="w-full">
      {/* Start Featured Video */}
      <FeaturedVideoPlayer
        videoId="iUF3p_l1DfY"
        title={mainSlide?.h1Line1 || "أشهى تجربة غذائية - محفوض بتراث والتاريخ"}
        description={
          mainSlide?.description ||
          "شاهد هذا الفيديو المميز حول التراث الثقافي والتاريخ"
        }
        item={mainSlide || {}}
        t={t}
        navigate={navigate}
      />
      {/* End Featured Video */}
    </div>
  );
}
