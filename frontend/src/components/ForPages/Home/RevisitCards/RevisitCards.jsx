import React, { useEffect, useState } from "react";

import { GetLearnCategories, GetLearnsByCategoryId } from "@/api/learn";
import ScrollCards from "./ScrollCards";

const RevisitCards = ({ t }) => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories on component mount
  const getCategories = async () => {
    setIsLoading(true);
    try {
      const res = await GetLearnCategories();
      setCategories(res.data.results || []);
      if (res.data.results && res.data.results.length > 0) {
        setActiveCategory(res.data.results[0]);
        await handleGetItemsByCategory(res.data.results[0].id);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch items by category
  const handleGetItemsByCategory = async (categoryId) => {
    setIsLoading(true);
    try {
      const res = await GetLearnsByCategoryId(categoryId, 8, 0);
      console.log("Fetched items for category:", categoryId, res.data.results);
      setItems(res.data.results || []);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    handleGetItemsByCategory(category.id);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="bg-[#285688] h-auto md:h-[700px] relative">
      <div className="flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px] lg:gap-[24px] items-start w-full max-w-7xl px-4 sm:px-8 md:px-12 lg:px-16 py-6 md:py-12 lg:py-16 mx-auto">
        {/* Section Header - White Style */}
        <div className="flex gap-[12px] sm:gap-[14px] md:gap-[16px] lg:gap-[16px] items-center w-full mb-6">
          {/* Icon Line */}
          <div className="h-[24px] sm:h-[28px] md:h-[32px] lg:h-[36px] w-0 relative shrink-0">
            <div className="absolute inset-[0_-4px]">
              <svg
                width="8"
                height="100%"
                viewBox="0 0 8 36"
                fill="none"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="8" height="36" fill="white" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <p className="font-['Noto_Sans_TC:Bold',sans-serif] font-bold leading-[1.5] text-[16px] sm:text-[18px] md:text-[22px] lg:text-[24px] text-white shrink-0">
            {t("REVISIT CARDS FROM LIVESTREAMS")}
          </p>

          <hr className="h-[1px] sm:h-[1.5px] md:h-[2px] lg:h-[2px] flex-1 bg-[#FCFDFF] border-0" />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 sm:gap-4 md:gap-5 scrollbar-hide overflow-auto scroll-0 w-full mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 sm:py-2.5 rounded-full shrink-0 w-fit font-['Noto_Sans_TC:Regular',sans-serif] text-[13px] md:text-[16px] transition-all ${
                activeCategory?.id === category.id
                  ? "bg-white text-[#285688]"
                  : "bg-[#4a7ba7] text-[#FCFDFF]/80 hover:bg-[#5a8bb7]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Cards Carousel */}
        {!isLoading && items.length > 0 && <ScrollCards items={items} t={t} />}

        {/* Loading State */}
        {isLoading && (
          <div className="w-full h-48 flex items-center justify-center">
            <p className="text-white text-center">{t("Loading...")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevisitCards;
