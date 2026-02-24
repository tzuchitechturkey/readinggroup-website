import React from "react";

import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import countries from "@/constants/countries.json";
import { languages } from "@/constants/constants";

/**
 * SelectFieldsSection Component
 * Handles language and country selection
 */
function SelectFieldsSection({ formData, errors, onInputChange }) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Language */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Language")} *
        </label>
        <select
          name="language"
          value={formData.language}
          onChange={onInputChange}
          className={`w-full px-3 py-2 border rounded-md outline-none ${
            errors.language ? "border-red-500" : "border-gray-300"
          } ${!formData.language ? "text-gray-400" : "text-black"}`}
        >
          <option value="" hidden disabled>
            {t("Select Language")}
          </option>
          {languages.map((lang) => (
            <option
              key={lang.code}
              className="text-black"
              value={lang.label}
            >
              {t(lang.label)}
            </option>
          ))}
        </select>
        {errors.language && (
          <p className="text-red-500 text-xs mt-1">{errors.language}</p>
        )}
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Country")}
        </label>
        <select
          name="country"
          value={formData.country}
          onChange={onInputChange}
          className={`w-full px-3 py-2 border rounded-md outline-none ${
            errors.country ? "border-red-500" : "border-gray-300"
          } ${!formData.country ? "text-gray-400" : "text-black"}`}
        >
          <option value="" hidden disabled>
            {t("Select Country")}
          </option>
          {countries?.map((option) => (
            <option
              key={option.code}
              className="text-black"
              value={option.code}
            >
              {t(option.name)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SelectFieldsSection;
