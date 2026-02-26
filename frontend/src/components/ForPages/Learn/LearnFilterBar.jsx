import React from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineChevronDown, HiOutlineSearch } from "react-icons/hi";

const LearnFilterBar = ({
  activeCategory,
  onSearch,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 mb-10">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 leading-none">
        {t(activeCategory)} {activeCategory === "Good Effects" ? "Posters" : ""}
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        {/* Search Bar - Underlined style matching design */}
        {activeCategory === "Good Effects" ? (
          <div
            className="flex items-center border-b border-black"
            style={{ width: "340px", padding: "4px 0", gap: "10px" }}
          >
            <HiOutlineSearch className="text-black w-6 h-6 flex-shrink-0" />
            <input
              type="text"
              placeholder={t("Search image")}
              className="flex-1 bg-transparent text-base outline-none placeholder:text-[#9e9e9e] font-normal"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        ) : (
          <div />
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4">
          <div className="relative group">
            <button className="flex items-center gap-2 px-6 py-2 border border-gray-900 rounded-full text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-all">
              <span>{t("Date")}:</span>
              <span className="font-medium text-gray-600">{t("All")}</span>
              <HiOutlineChevronDown className="w-4 h-4 ml-2" />
            </button>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-2 px-6 py-2 border border-gray-900 rounded-full text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-all">
              <span>{t("Sort by")}:</span>
              <span className="font-medium text-gray-600">{t("Newest")}</span>
              <HiOutlineChevronDown className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnFilterBar;
