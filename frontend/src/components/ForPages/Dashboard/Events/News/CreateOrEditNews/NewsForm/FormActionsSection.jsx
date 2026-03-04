import { useTranslation } from "react-i18next";

const FormActionsSection = ({ 
  onSave, 
  onCancel, 
  isLoading = false,
  isEdit = false 
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-end gap-3 pt-6 border-t">
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("Cancel")}
      </button>
      <button
        type="submit"
        onClick={onSave}
        disabled={isLoading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading
          ? t("Saving...")
          : isEdit
          ? t("Update News")
          : t("Create News")
        }
      </button>
    </div>
  );
};

export default FormActionsSection;