import React from "react";
import { useTranslation } from "react-i18next";

/**
 * ExcerptSection Component
 * Handles post excerpt input
 */
function ExcerptSection({ formData, errors, onExcerptChange }) {
  const { t } = useTranslation();

  const readTime = Math.ceil(formData.excerpt.split(" ").length / 60);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("Excerpt")} *
      </label>
      <textarea
        name="excerpt"
        value={formData.excerpt}
        onChange={onExcerptChange}
        rows={4}
        placeholder={t("Enter post excerpt or summary")}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors.excerpt ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors.excerpt && (
        <p className="text-red-500 text-xs mt-1">{errors.excerpt}</p>
      )}
      <p className="text-xs text-gray-500 mt-1">
        {t("Approximately")} {readTime} {t("minute(s) read")}
      </p>
    </div>
  );
}

export default ExcerptSection;
