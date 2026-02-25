import { useTranslation } from "react-i18next";

export const AdditionalInfoSection = ({
  formData,
  onInputChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Reference Code */}
      {/* <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Reference Code")}
        </label>
        <input
          type="text"
          name="reference_code"
          value={formData?.reference_code}
          onChange={onInputChange}
          placeholder={t("Enter reference code (optional)")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}

      {/* Is Featured */}
      {/* <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_featured"
          id="is_featured"
          checked={formData?.is_featured}
          onChange={onInputChange}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />
        <label htmlFor="is_featured" className="text-sm font-medium text-gray-700 cursor-pointer">
          {t("Featured Video")}
        </label>
      </div> */}

      {/* Duration (Read-only) */}
      {formData?.duration && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Duration")}
          </label>
          <input
            type="text"
            value={formData?.duration}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>
      )}
    </div>
  );
};
