import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const FormActionsSection = ({ 
  onSubmit, 
  isLoading, 
  isEditMode 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/admin/photo-collections");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
      <button
        type="submit"
        onClick={onSubmit}
        disabled={isLoading}
        className={`
          px-6 py-3 rounded-lg font-medium text-white transition-colors
          ${isLoading 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-blue-500 hover:bg-blue-600"
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {t("Saving...")}
          </span>
        ) : (
          t(isEditMode ? "Update Collection" : "Create Collection")
        )}
      </button>

      <button
        type="button"
        onClick={handleCancel}
        disabled={isLoading}
        className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        {t("Cancel")}
      </button>
    </div>
  );
};

export default FormActionsSection;