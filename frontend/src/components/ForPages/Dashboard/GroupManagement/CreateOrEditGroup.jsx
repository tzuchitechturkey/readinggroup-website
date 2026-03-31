import React from "react";

import { useTranslation } from "react-i18next";

import { useCreateOrEditGroup } from "@/hooks/group/useCreateOrEditGroup";
import { Input } from "@/components/ui/input";

export default function CreateOrEditGroup({ group, onClose }) {
  const { t } = useTranslation();
  const {
    formData,
    errors,
    isLoading,
    hasChanges,
    handleInputChange,
    handleSubmit,
  } = useCreateOrEditGroup(group, onClose);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Group Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Group Name")} *
        </label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder={t("Enter group name")}
          disabled={isLoading}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* Content Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Content Type")} *
        </label>
        <select
          name="section_name"
          value={formData.section_name}
          onChange={handleInputChange}
          disabled={isLoading}
          className={`w-full px-4 py-2.5 border rounded-lg outline-none ${
            errors.section_name ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-blue-500`}
        >
          <option value="" hidden>
            {t("Select Content Type")}
          </option>
          <option value="learn">{t("Learn")}</option>
          <option value="video">{t("Video")}</option>
          <option value="liveStream">{t("Live Stream")}</option>
          <option value="photoCollection">{t("Photo Collection")}</option>
          <option value="latestNews">{t("Latest News")}</option>
          <option value="relatedReport">{t("Related Report")}</option>
          <option value="teamMembers">{t("Team Members")}</option>
          <option value="book">{t("Book")}</option>
          <option value="history">{t("History")}</option>
        </select>
        {errors.section_name && (
          <p className="text-red-500 text-xs mt-1">{errors.section_name}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={isLoading || (group?.id && !hasChanges)}
          className="flex-1 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? t("Saving...") : t("Save")}
        </button>
        <button
          type="button"
          onClick={() => onClose(false)}
          disabled={isLoading}
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
        >
          {t("Cancel")}
        </button>
      </div>
    </form>
  );
}
