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

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={isLoading || (group?.id && !hasChanges)}
          className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
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
