import React from "react";

import { ChevronDown, X, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

function Filter({
  setIsDateModalOpen,
  selectedDateRange,
  setSelectedDateRange,
}) {
  const { t } = useTranslation();
  return (
    <div className="w-80 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Side Filtration */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text">Side filtration</h3>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          {/* Content Type Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">All content</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">169</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="full-videos"
                defaultChecked
                className="rounded border-gray-300"
              />
              <label
                htmlFor="full-videos"
                className="text-sm text-gray-700 flex-1"
              >
                Full Videos
              </label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                111
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="unit-video"
                defaultChecked
                className="rounded border-gray-300"
              />
              <label
                htmlFor="unit-video"
                className="text-sm text-gray-700 flex-1"
              >
                Unit Video
              </label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                58
              </span>
            </div>
          </div>
        </div>

        {/* Index Subject */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-900">
              Index Subject
            </h3>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="health"
                defaultChecked
                className="rounded border-gray-300"
              />
              <label htmlFor="health" className="text-sm text-gray-700 flex-1">
                Health
              </label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                113
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="environment"
                defaultChecked
                className="rounded border-gray-300"
              />
              <label
                htmlFor="environment"
                className="text-sm text-gray-700 flex-1"
              >
                Environment
              </label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                56
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="education"
                className="rounded border-gray-300"
              />
              <label
                htmlFor="education"
                className="text-sm text-gray-700 flex-1"
              >
                Education
              </label>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">45</span>
            </div>
          </div>
        </div>

        {/* Language Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-900">Language</h3>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="arabic"
                defaultChecked
                className="rounded border-gray-300"
              />
              <label htmlFor="arabic" className="text-sm text-gray-700 flex-1">
                Arabic
              </label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                113
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="chinese"
                defaultChecked
                className="rounded border-gray-300"
              />
              <label htmlFor="chinese" className="text-sm text-gray-700 flex-1">
                Chinese
              </label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                56
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="japanese"
                className="rounded border-gray-300"
              />
              <label
                htmlFor="japanese"
                className="text-sm text-gray-700 flex-1"
              >
                Japanese
              </label>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">45</span>
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div className="">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setIsDateModalOpen(true)}
              className="flex items-center gap-2 text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Date
            </button>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          {/* Selected Date Display */}
          {(selectedDateRange.startDate || selectedDateRange.endDate) && (
            <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-800">
                  {selectedDateRange.startDate && selectedDateRange.endDate
                    ? `${format(
                        selectedDateRange.startDate,
                        "MMM dd"
                      )} - ${format(selectedDateRange.endDate, "MMM dd, yyyy")}`
                    : selectedDateRange.startDate
                    ? format(selectedDateRange.startDate, "MMM dd, yyyy")
                    : format(selectedDateRange.endDate, "MMM dd, yyyy")}
                </div>
                <button
                  onClick={() =>
                    setSelectedDateRange({
                      startDate: null,
                      endDate: null,
                    })
                  }
                  className="text-blue-600 hover:text-red-600 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600"
              onClick={() =>
                setSelectedDateRange({ startDate: null, endDate: null })
              }
            >
              Reset
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsDateModalOpen(true)}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filter;
