import React from "react";

import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";

const VideoSearchBar = ({
  searchTerm,
  activeSearchTerm,
  onSearch,
  placeholderText,
}) => {
  const { t } = useTranslation();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(e.target.value, true); // true indicates search should be triggered
    }
  };

  const handleInputChange = (value) => {
    onSearch(value, false); // false indicates just updating the input
  };

  return (
    <div className="relative flex-1 w-full ">
      <div className="relative flex items-center gap-2 border-b border-[#081945] pb-1">
        <Search
          className="text-[#25282B]"
          onClick={() => onSearch(searchTerm, true)}
        />
        <input
          type="text"
          placeholder={placeholderText || t("Search video")}
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent border-none outline-none text-base text-gray-800 placeholder-gray-500"
        />
        {/* Clear Search Button */}
        {activeSearchTerm && (
          <button
            onClick={() => onSearch("", true)} // Clear and search
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoSearchBar;
