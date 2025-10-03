import React from "react";

import { useTranslation } from "react-i18next";
import { Star, Calendar, User, BookOpen, Globe, MapPin, Plus } from "lucide-react";

import GuidingReadingcard from "@/components/Global/GuidingReadingcard/GuidingReadingcard";

function FilteredResults({ 
  readings, 
  isSearchPerformed, 
  totalCount, 
  hasMore, 
  isLoading, 
  onLoadMore 
}) {
  const { t } = useTranslation();

  if (!isSearchPerformed) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Results Header */}
      {/* <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {t("Search Results")}
        </h2>
        <p className="text-gray-600">
          {t("Showing")} {readings.length} {t("of")} {totalCount || readings.length} {t("reading(s)")}
        </p>
      </div> */}

      {/* Results Grid */}
      {readings.length > 0 ? (
        <div className="space-y-8">
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readings.map((item) => (
              <div key={item.id}>
                <GuidingReadingcard item={item} />
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {hasMore && (
            <div className="flex justify-center pt-8">
              <button
                onClick={onLoadMore}
                disabled={isLoading}
                className={`
                  inline-flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-sm
                  transition-all duration-200 min-w-[160px] justify-center
                  ${isLoading 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    {t("Loading...")}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    {t("Show More")}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        // No Results Found
        <div className="text-center py-12">
          <div className="mb-4">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            {t("No results found")}
          </h3>
          <p className="text-gray-500">
            {t("Try adjusting your search criteria or filters")}
          </p>
        </div>
      )}
    </div>
  );
}

export default FilteredResults;
