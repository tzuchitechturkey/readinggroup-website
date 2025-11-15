import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import VideosHero from "@/components/ForPages/Videos/VideosHero/VideosHero";
import VideoFilterSections from "@/components/ForPages/Videos/VideoFilterSections/VideoFilterSections";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import {
  GetMyListedVideos,
  GetTopLikedVideos,
  GetRandomPublishedVideos,
  GetVideoCategories,
  GetItemsByCategoryId,
  GetVideos,
} from "@/api/videos";

function VideosPageContent() {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const [mixVideos, setMixVideos] = useState([]);
  const [weeklyList, setWeeklyList] = useState([]);
  const [myListedVideos, setMyListedVideos] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [categoriesData, setCategoriesData] = useState({});
  const [targetCategoryId, setTargetCategoryId] = useState(null);
  const getMyListedVideos = async () => {
    try {
      const res = await GetMyListedVideos(10, 0, "");
      setMyListedVideos(res.data?.results || []);
    } catch (err) {
      console.error("Failed to fetch my listed videos:", err);
    }
  };
  const getLikedVideos = async () => {
    try {
      const res = await GetTopLikedVideos();
      setLikedVideos(res.data);
    } catch (err) {
      console.error("Failed to fetch liked videos:", err);
    }
  };
  const getMixVideos = async () => {
    try {
      const res = await GetRandomPublishedVideos(10, 0);
      setMixVideos(res.data?.results);
    } catch (err) {
      console.error("Failed to fetch top mix videos:", err);
    }
  };

  const getWeeklyList = async () => {
    try {
      const res = await GetVideos(20, 0, "published", "", {
        is_weekly_moment: true,
      });
      console.log(res.data?.results, "sssssssssssssssssss");
      setWeeklyList(res.data?.results);
    } catch (err) {
      console.error("Failed to fetch top mix videos:", err);
    }
  };

  const getActiveVideoCategories = async () => {
    try {
      const res = await GetVideoCategories(200, 0);
      const allCategories = res.data?.results || res.data || [];
      const active = allCategories.filter((cat) => cat.is_active === true);
      setActiveCategories(active);

      // Fetch items for each active category
      for (const category of active) {
        try {
          const itemsRes = await GetItemsByCategoryId(category.id);
          setCategoriesData((prev) => ({
            ...prev,
            [category.id]: itemsRes.data?.results || itemsRes.data || [],
          }));
        } catch (err) {
          console.error(
            `Failed to fetch items for category ${category.id}:`,
            err
          );
        }
      }
    } catch (err) {
      console.error("Failed to fetch video categories:", err);
    }
  };

  useEffect(() => {
    if (location.state?.targetCategoryId) {
      setTargetCategoryId(location.state.targetCategoryId);
    }
  }, [location.state]);

  useEffect(() => {
    if (targetCategoryId && activeCategories.length > 0) {
      const categoryExists = activeCategories.some(
        (cat) => cat.id === targetCategoryId
      );
      if (categoryExists) {
        setTimeout(() => {
          const el = document.getElementById(`category-${targetCategoryId}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 500);
      }
    }
  }, [targetCategoryId, activeCategories]);

  useEffect(() => {
    getMixVideos();
    getLikedVideos();
    getMyListedVideos();
    getWeeklyList();
    getActiveVideoCategories();
  }, []);

  return (
    <div
      className="min-h-screen bg-gray-100"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Hero Section */}
      <VideosHero top1Video={weeklyList?.length ? weeklyList[0] : null} />

      {/* Start Filter Secion */}
      <VideoFilterSections mixVideos={mixVideos} likedVideos={likedVideos} />
      {/* End Filter Secion */}
      <div className="max-w-7xl mx-auto pb-2">
        {/* Start Weekly List  */}
        {weeklyList?.length ? (
          <div className="my-3" id="full-videos">
            <DynamicSection
              title={t("Top Weekly Videos")}
              titleClassName="text-[30px] font-medium mb-2"
              data={weeklyList}
              isSlider={false}
              cardName={VideoCard}
              viewMoreUrl="/videos"
            />
          </div>
        ) : (
          ""
        )}
        {/* End Weekly List  */}

        {/* Start My LIST */}
        {myListedVideos?.length > 0 && (
          <div className="my-5">
            <DynamicSection
              title={t("My List")}
              titleClassName="text-[30px] font-medium mb-2"
              data={myListedVideos}
              isSlider={false}
              viewMore={true}
              cardName={VideoCard}
              viewMoreUrl="/my-list"
            />
          </div>
        )}
        {/* End My LIST */}

        {/* Start Show Active Categories */}

        {activeCategories.map((category) => (
          <div
            key={category.id}
            id={`category-${category.id}`}
            className="mt-12"
          >
            <DynamicSection
              title={category.name}
              titleClassName="text-[30px] font-medium mb-2"
              data={categoriesData[category.id] || []}
              isSlider={false}
              cardName={VideoCard}
            />
          </div>
        ))}

        {/* End Show Active Categories */}
      </div>
    </div>
  );
}

export default VideosPageContent;
