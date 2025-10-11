import React from "react";

const CategoryTag = ({ category, isActive = false, onClick }) => (
  <button
    className={`px-2 md:px-4 lg:px-6 py-2 rounded text-base font-normal transition-all duration-200 shadow-md hover:-translate-y-0.5 hover:shadow-lg focus:outline-2 focus:outline-white/50 focus:outline-offset-2 ${
      isActive
        ? "bg-white text-black"
        : "bg-white border-[1px] border-text text-text hover:bg-zinc-500 hover:text-white"
    }`}
    onClick={() => onClick?.(category)}
  >
    {category}
  </button>
);

export default CategoryTag;
