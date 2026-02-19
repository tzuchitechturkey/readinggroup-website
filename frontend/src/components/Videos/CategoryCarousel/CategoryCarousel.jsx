import React from "react";

import { ChevronRight } from "lucide-react";

const CategoryCarousel = ({
  activeCategories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="flex items-center justify-between my-5 overflow-hidden">
      <div className="category-pills flex items-center gap-2 overflow-x-auto scroll-smooth pb-1 scrollbar-hide">
        {activeCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`flex-shrink-0 text-black px-4 py-2 rounded-full border border-black font-normal text-base whitespace-nowrap transition-all duration-200 ${
              selectedCategory === category.id
                ? "bg-[#B0B0B0] "
                : " hover:bg-gray-50"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Scroll indicator - show on mobile/tablet if needed */}
      <div className="flex items-center ml-4 flex-shrink-0">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default CategoryCarousel;
