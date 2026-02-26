import React from "react";

import { ChevronRight, X } from "lucide-react";

const CategoryCarousel = ({
  activeCategories,
  selectedCategories = [],
  onCategorySelect,
}) => {
  return (
    <div className="flex items-center justify-between my-5 overflow-hidden">
      <div className="category-pills flex items-center gap-2 overflow-x-auto scroll-smooth pb-1 scrollbar-hide">
        {activeCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`flex-shrink-0 flex items-center gap-2  px-4 py-1 rounded-full font-normal text-base whitespace-nowrap transition-all duration-200 ${
              selectedCategories.includes(category.id)
                ? "bg-[#285688] text-white border-0"
                : " bg-white text-[#285688]"
            }`}
          >
            <span>{category.name}</span>
            {selectedCategories.includes(category.id) && (
              <X size={16} className="text-white" />
            )}
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
