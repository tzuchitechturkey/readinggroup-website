import React from "react";

import { Plus } from "lucide-react";

function DashboardSectionHeader({
  title = "",
  subtitle = "",
  addText = "",
  totalRecords = 0,
  onAddClick = () => {},
  searchTerm = "",
  setSearchTerm = () => {},
  getData = () => {},
  t,
  i18n,
  showSearch = true,
}) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-2 lg:px-4 sm:px-6 p-4 border-b bg-white rounded-lg mb-3 md:mb-0">
        <h2 className="text-lg font-medium text-[#1D2630]">{title}</h2>

        <div className="flex items-center justify-between gap-1">
          <span className="text-xs md:text-sm text-gray-500">
            {t("Total")}: {totalRecords} {subtitle}
          </span>
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 text-xs md:text-sm bg-primary border border-primary hover:bg-white transition-all duration-200 text-white hover:text-primary px-3 py-1.5 rounded"
          >
            <Plus className="h-4 w-4" />
            {addText}
          </button>
        </div>
      </div>

      {/* Start Search */}
      {showSearch && (
        <div className="bg-white rounded-lg p-4  mb-3 md:mb-6 shadow-sm">
          <div className="relative max-w-md flex">
            <input
              type="text"
              placeholder={t(`Search ${subtitle}`)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // when press Enter we musr send the search request
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getData(0);
                }
              }}
              className={`flex-1 px-4 py-2 border border-gray-300 ${
                i18n?.language === "ar" ? "rounded-r-lg" : "rounded-l-lg"
              } text-sm pr-8`}
            />

            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  getData(0, "");
                }}
                className={` absolute ${
                  i18n?.language === "ar" ? " left-20" : " right-20"
                } top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700`}
              >
                ✕
              </button>
            )}

            <button
              onClick={() => {
                if (searchTerm.trim()) {
                  getData(0);
                }
              }}
              className={`px-4 py-2 bg-[#4680ff] text-white ${
                i18n?.language === "ar" ? "rounded-l-lg" : "rounded-r-lg"
              }  text-sm font-semibold hover:bg-blue-600`}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      )}
      {/* End Search */}
    </div>
  );
}

export default DashboardSectionHeader;
