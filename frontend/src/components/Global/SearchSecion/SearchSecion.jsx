import React from "react";

import { Search, ArrowUp, Grid2x2, List, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CiFilter } from "react-icons/ci";

import { Input } from "@/components/ui/input";

function SearchSecion({
  setOpenFilterModal,
  setSearchValue,
  setMakingSearch,
  searchValue,
  handleSortData,
  onSearch,
}) {
  const { t, i18n } = useTranslation();
  const [searchValueLocale, setSearchValueLocal] = React.useState("");
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:grid lg:grid-cols-7 items-start lg:items-center gap-4 lg:gap-6">
        {/* Start Search */}
        <div className="w-full relative  flex lg:col-span-5 items-center gap-1">
          <div className="flex-1 relative">
            {searchValueLocale ? (
              <X
                onClick={() => {
                  setSearchValue("");
                  setSearchValueLocal("");
                  setMakingSearch(false);
                }}
                className="cursor-pointer absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5"
              />
            ) : (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            )}

            <Input
              type="text"
              placeholder={t("Search items, collections, and accounts")}
              className="pl-8 sm:pl-10 pr-4 py-3 sm:py-4 lg:py-5 w-full border border-primary rounded-lg sm:rounded-xl lg:rounded-2xl outline-none text-sm sm:text-base"
              onChange={(e) => {
                setSearchValueLocal(e.target.value);
                setSearchValue(e.target.value);
              }}
              value={searchValue}
            />
          </div>
          {searchValueLocale && (
            <Search
              onClick={() => {
                onSearch(searchValueLocale);
              }}
              className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5"
            />
          )}

          <button
            onClick={() => {
              onSearch(searchValueLocale);
            }}
            className="inline-flex lg:hidden items-center justify-center rounded-lg p-2 text-sm font-semibold text-[#1f3fb3] shadow-sm transition border-[1px] border-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white/80"
          >
            <Search
              className={`h-4 w-4 ${
                i18n?.language === "ar" ? "mr-1" : "mr-1"
              } `}
            />
          </button>
          {/* Start Filter Icon  */}
          <button
            onClick={() => {
              setOpenFilterModal(true);
            }}
            className="block md:hidden border-[1px] border-primary rounded-lg p-2 hover:bg-gray-50 transition-colors"
          >
            <CiFilter color={"4680ff"} />
          </button>
          {/* End Filter Icon  */}
        </div>
        {/* End Search */}

        {/* Start Sort && View Options */}
        <div className="w-full lg:col-span-2 flex  sm:flex-row lg:flex-row items-start sm:items-center lg:items-center gap-3 sm:gap-4 lg:gap-8">
          <button
            onClick={() => {
              handleSortData();
            }}
            className="hidden lg:flex outline-none  items-center gap-2 px-3 lg:px-2 py-2 sm:py-[6px] border border-primary rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm sm:text-base lg:text-xl text-primary font-medium">
              {t("Sort by")}
            </span>
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </button>

          {/* View Mode Toggle */}
          {/* <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
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
          </div> */}
        </div>
        {/* End Sort && View Options */}
      </div>
    </div>
  );
}

export default SearchSecion;
