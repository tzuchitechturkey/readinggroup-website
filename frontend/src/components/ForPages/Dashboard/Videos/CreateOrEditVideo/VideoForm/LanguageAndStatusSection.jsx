import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";

import { languages, postStatusOptions } from "@/constants/constants";

export const LanguageAndStatusSection = ({
  formData,
  onInputChange,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Language */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Language")} <span className="text-red-500">*</span>
        </label>
        <select
          name="language"
          value={formData?.language}
          onChange={onInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none text-black${
            errors?.language ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">{t("Select language")}</option>
          {languages?.map((lang) => (
            <option className="text-black" key={lang?.code} value={lang?.code}>
              {lang?.name || lang?.label}
            </option>
          ))}
        </select>
        {errors?.language && (
          <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
            <AlertCircle size={16} />
            <span>{errors.language}</span>
          </div>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Status")} <span className="text-red-500">*</span>
        </label>
        <select
          name="status"
          value={formData?.status}
          onChange={onInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors?.status ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">{t("Select status")}</option>
          {postStatusOptions?.map((status) => (
            <option key={status?.id} value={status?.id}>
              {t(status?.name || status?.value)}
            </option>
          ))}
        </select>
        {errors?.status && (
          <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
            <AlertCircle size={16} />
            <span>{errors.status}</span>
          </div>
        )}
      </div>
    </div>
  );
};
