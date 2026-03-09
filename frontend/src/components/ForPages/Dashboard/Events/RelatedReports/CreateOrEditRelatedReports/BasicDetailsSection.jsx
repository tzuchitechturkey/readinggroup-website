import React from "react";

import { ChevronDown, Search, X } from "lucide-react";
import DatePickerWithMonthYear from "@/components/Global/DatePickerWithMonthYear/DatePickerWithMonthYear";

const BasicDetailsSection = ({
  formData,
  errors,
  onInputChange,
  showCategoryDropdown,
  setShowCategoryDropdown,
  categoriesList,
  categorySearchValue,
  setCategorySearchValue,
  categoryDropdownRef,
  onCategorySelect,
  onCategoryClearSearch,
  getCategories,
  t,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        {t("Basic Information")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Report Title")} *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={onInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("Enter report title")}
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title}</p>
          )}
        </div>
        {/* End Title */}

        {/* Start Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Duration")} *
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration || ""}
            onChange={onInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.duration ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("e.g., 45 minutes")}
          />
          {errors.duration && (
            <p className="text-sm text-red-600 mt-1">{errors.duration}</p>
          )}
        </div>
        {/* End Duration */}

        {/* Start Event Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Event Date")} *
          </label>
          <DatePickerWithMonthYear
            value={formData.happened_at || ""}
            onChange={onInputChange}
            error={!!errors.happened_at}
            t={t}
          />
          {errors.happened_at && (
            <p className="text-sm text-red-600 mt-1">{errors.happened_at}</p>
          )}
        </div>
        {/* End Event Date */}

        {/* Start External Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("External Link")}
          </label>
          <input
            type="text"
            name="external_link"
            value={formData?.external_link || ""}
            onChange={onInputChange}
            placeholder={t("e.g., https://example.com")}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors?.external_link ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.external_link && (
            <p className="text-sm text-red-600 mt-1">{errors.external_link}</p>
          )}
        </div>
        {/* End External Link */}

        {/* Start Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Category")} *
          </label>
          <div className="relative" ref={categoryDropdownRef}>
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className={`w-full px-3 py-2 border rounded-md text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <span className="text-gray-900">
                {formData.category?.title || t("Select a category")}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showCategoryDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="p-2 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={categorySearchValue}
                      onChange={(e) => {
                        setCategorySearchValue(e.target.value);
                        getCategories(e.target.value);
                      }}
                      className="w-full pl-10 pr-8 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t("Search categories...")}
                    />
                    {categorySearchValue && (
                      <button
                        type="button"
                        onClick={onCategoryClearSearch}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {categoriesList.length > 0 ? (
                    categoriesList.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => onCategorySelect(category)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {category.title}
                          </div>
                          {category.description && (
                            <div className="text-sm text-gray-500 truncate">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 text-center">
                      {t("No categories found")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {errors.category && (
            <p className="text-sm text-red-600 mt-1">{errors.category}</p>
          )}
        </div>
        {/* End Category */}
      </div>
    </div>
  );
};
export default BasicDetailsSection;
