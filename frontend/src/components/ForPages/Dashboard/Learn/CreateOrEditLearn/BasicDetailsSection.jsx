import React from "react";

import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import DatePickerWithMonthYear from "@/components/Global/DatePickerWithMonthYear/DatePickerWithMonthYear";

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
  disableCategory,
  disableLearnType,
}) {
  const { t } = useTranslation();
  const learnType = formData.learn_type || formData?.category?.learn_type;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Title")}
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
          {t("Subtitle")}
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
          value={
            disableLearnType
              ? "cards"
              : formData.learn_type || formData?.category?.learn_type || ""
          }
          onChange={onLearnTypeChange}
          className={`w-full px-3 py-2 border rounded-md outline-none ${
            errors.learn_type ? "border-red-500" : "border-gray-300"
          } `}
        >
          <option value="" hidden>
            {t("Select Type")}
          </option>
          <option className="text-black" value={"cards"}>
            {t("Cards")}
          </option>
          <option
            disabled={disableLearnType}
            className="text-black"
            value={"posters"}
          >
            {t("Posters")}
          </option>
        </select>
        {errors.learn_type && (
          <p className="text-red-500 text-xs mt-1">{errors.learn_type}</p>
        )}
      </div>
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Author/Speaker Name")}
        </label>
        <Input
          name="author_name"
          value={formData.author_name || ""}
          onChange={onInputChange}
          placeholder={t("Enter author/speaker name")}
        />
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Author/Speaker Country")}
        </label>
        <Input
          name="author_country"
          value={formData.author_country || ""}
          onChange={onInputChange}
          placeholder={t("Enter author/speaker country")}
        />
      </div>

      {/* Date Picker - posters only */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Date")} {learnType === "posters" && "*"}
        </label>
        <DatePickerWithMonthYear
          value={formData.event_date || ""}
          onChange={onInputChange}
          error={!!errors.event_date}
          t={t}
          name="event_date"
        />
        {errors.event_date && (
          <p className="text-red-500 text-xs mt-1">{errors.event_date}</p>
        )}
      </div>

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
            selectedCategoryId={formData.category?.id ?? formData.category}
            selectedCategoryName={formData.category?.name}
            categoriesList={categoriesList}
            categorySearchValue={categorySearchValue}
            onSearchChange={setCategorySearchValue}
            onSearch={() =>
              getCategories(formData.learn_type, categorySearchValue)
            }
            onClearSearch={handleCategoryClearSearch}
            onSelect={handleCategorySelect}
            errors={errors}
            dropdownRef={categoryDropdownRef}
            disabled={
              disableCategory ||
              (!formData.learn_type && !formData?.category?.learn_type)
            }
            disabledMessage={
              disableCategory
                ? t("Category is fixed for your account")
                : t("Please select a learn type first")
            }
          />
        </div>
      </div>
    </div>
  );
}

export default BasicDetailsSection;
