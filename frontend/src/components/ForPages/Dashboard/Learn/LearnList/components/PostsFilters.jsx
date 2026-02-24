import React from "react";

import { useTranslation } from "react-i18next";

const PostsFilters = ({
  statusFilter,
  isWeeklyMomentFilter,
  onStatusChange,
  onWeeklyMomentFilterChange,
}) => {
  const { t } = useTranslation();

  const statusOptions = ["published", "draft", "archived"];
  const weeklyOptions = [
    { value: null, label: t("All"), bgColor: "bg-primary" },
    { value: true, label: t("Weekly"), bgColor: "bg-green-500" },
    { value: false, label: t("Not Weekly"), bgColor: "bg-red-500" },
  ];

  return (
    <div className="flex items-center justify-between">
      {/* Status Filter */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border-b">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-medium text-gray-700">
            {t("Status")}:
          </span>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  statusFilter === status
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t(status.charAt(0).toUpperCase() + status.slice(1))}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Moment Filter */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border-b">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-medium text-gray-700">
            {t("Weekly List")}:
          </span>
          <div className="flex gap-2 flex-wrap">
            {weeklyOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => onWeeklyMomentFilterChange(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isWeeklyMomentFilter === option.value
                    ? `${option.bgColor} text-white`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostsFilters;