import React from "react";

import { Tag, X } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * TagsSection Component
 * Handles tags input and display
 */
function TagsSection({ formData, errors, tagInput, onTagInputChange, onTagAdd, onTagRemove }) {
  const { t } = useTranslation();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onTagAdd(e);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("Tags")} *
      </label>
      <div className="space-y-2">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => onTagInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("Type a tag and press Enter")}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.tags ? "border-red-500" : "border-gray-300"
          }`}
        />
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                <Tag className="w-3 h-3" />
                {tag}
                <button
                  type="button"
                  onClick={() => onTagRemove(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      {errors.tags && (
        <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
      )}
    </div>
  );
}

export default TagsSection;
