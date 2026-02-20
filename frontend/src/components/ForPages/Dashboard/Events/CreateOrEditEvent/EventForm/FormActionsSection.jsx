import { useTranslation } from "react-i18next";

const FormActionsSection = ({
  isLoading,
  isEditing,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end gap-3 mt-6">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        disabled={isLoading}
      >
        {t("Cancel")}
      </button>
      <button
        type="submit"
        onClick={onSubmit}
        disabled={isLoading}
        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-white border-[1px] border-primary hover:text-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? t("Loading...") : isEditing ? t("Save Changes") : t("Add Event")}
      </button>
    </div>
  );
};

export default FormActionsSection;
