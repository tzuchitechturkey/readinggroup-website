import { useTranslation } from "react-i18next";
import { Save, X } from "lucide-react";

export const FormActionsSection = ({
  isLoading,
  hasChanges,
  onSubmit,
  onCancel,
  isEditMode,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end gap-4">
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <X size={20} />
        <span>{t("Cancel")}</span>
      </button>

      <button
        type="submit"
        onClick={onSubmit}
        disabled={isLoading || (!isEditMode && !hasChanges)}
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading && <span className="animate-spin">⏳</span>}
        <Save size={20} />
        <span>
          {isLoading ? t("Saving...") : isEditMode ? t("Update") : t("Create")}
        </span>
      </button>
    </div>
  );
};
