import React from "react";

import { Search, ArrowUp, Grid2x2, List } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";

function SearchSecion({
  setOpenFilterModal,
  setViewMode,
  viewMode,
  setSearchValue,
  handleSortData,
}) {
  const { t } = useTranslation();
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:grid lg:grid-cols-7 items-start lg:items-center gap-4 lg:gap-6">
        {/* Start Search */}
        <div className="w-full lg:col-span-5 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <Input
            type="text"
            placeholder="Search items, collections, and accounts"
            className="pl-8 sm:pl-10 pr-4 py-3 sm:py-4 lg:py-5 w-full border border-primary rounded-lg sm:rounded-xl lg:rounded-2xl outline-none text-sm sm:text-base"
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
        </div>
        {/* End Search */}

        {/* Start Sort && View Options */}
        <div className="w-full lg:col-span-2 flex  sm:flex-row lg:flex-row items-start sm:items-center lg:items-center gap-3 sm:gap-4 lg:gap-8">
          {/* Start Filter Icon  */}
          <button
            onClick={() => {
              setOpenFilterModal(true);
            }}
            className="block md:hidden border-[1px] border-primary rounded-lg p-2 hover:bg-gray-50 transition-colors"
          >
            <i className="fa-solid fa-filter" style={{ color: "#4680ff" }} />
          </button>
          {/* End Filter Icon  */}

          <button
            onClick={() => {
              handleSortData();
            }}
            className="outline-none flex items-center gap-2 px-3 lg:px-2 py-2 sm:py-[6px] border border-primary rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm sm:text-base lg:text-xl text-primary font-medium">
              {t("Sort by")}
            </span>
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Grid2x2
                className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${
                  viewMode === "grid" ? "text-white" : "text-primary"
                }`}
              />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <List
                className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${
                  viewMode === "list" ? "text-white" : "text-primary"
                }`}
              />
            </button>
          </div>
        </div>
        {/* End Sort && View Options */}
      </div>
    </div>
  );
}

export default SearchSecion;
