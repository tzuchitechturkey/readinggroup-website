import React from "react";

import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { LEARN_TYPE_OPTIONS } from "@/constants/learn/learnConstant";

import CategorySelectionDropdown from "./CategorySelectionDropdown";

function BasicDetailsSection({
  formData,
  errors,
  onInputChange,
  onLearnTypeChange,
  showCategoryDropdown,
  setShowCategoryDropdown,
  categoriesList,
  categorySearchValue,
  setCategorySearchValue,
  getCategories,
  handleCategoryClearSearch,
  handleCategorySelect,
  categoryDropdownRef,
}) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Title")} *
        </label>
        <Input
          name="title"
          value={formData.title}
          onChange={onInputChange}
          placeholder={t("Enter post title")}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Subtitle")} *
        </label>
        <Input
          name="subtitle"
          value={formData.subtitle}
          onChange={onInputChange}
          placeholder={t("Enter post subtitle")}
          className={errors.subtitle ? "border-red-500" : ""}
        />
        {errors.subtitle && (
          <p className="text-red-500 text-xs mt-1">{errors.subtitle}</p>
        )}
      </div>

      {/* Start Learn Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Type")} *
        </label>
        <select
          name="learn_type"
          value={formData.learn_type}
          onChange={onLearnTypeChange}
          className={`w-full px-3 py-2 border rounded-md outline-none ${
            errors.learn_type ? "border-red-500" : "border-gray-300"
          } ${!formData.learn_type ? "text-gray-400" : "text-black"}`}
        >
          <option value="" hidden disabled>
            {t("Select Type")}
          </option>
          {LEARN_TYPE_OPTIONS.map((option) => (
            <option
              key={option.value}
              className="text-black"
              value={option.value}
            >
              {t(option.label)}
            </option>
          ))}
        </select>
        {errors.learn_type && (
          <p className="text-red-500 text-xs mt-1">{errors.learn_type}</p>
        )}
      </div>
      {/* End Learn Type */}
      {/* Category and Writer Selection */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Category")} *
          </label>
          <CategorySelectionDropdown
            showDropdown={showCategoryDropdown}
            onToggleDropdown={setShowCategoryDropdown}
            selectedCategoryId={formData.category?.id}
            categoriesList={categoriesList}
            categorySearchValue={categorySearchValue}
            onSearchChange={setCategorySearchValue}
            onSearch={() => getCategories(categorySearchValue)}
            onClearSearch={handleCategoryClearSearch}
            onSelect={handleCategorySelect}
            errors={errors}
            dropdownRef={categoryDropdownRef}
            disabled={!formData.learn_type}
            disabledMessage={t("Please select a learn type first")}
          />
        </div>
      </div>
    </div>
  );
}

export default BasicDetailsSection;
