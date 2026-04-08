import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";

import { languages } from "@/constants/constants";

export const LanguageAndStatusSection = ({
  formData,
  onInputChange,
  errors,
  usedLangCodes = [],
  disableVideoType = false,
}) => {
  const { t } = useTranslation();


  return (
    <div className="grid grid-cols-1 gap-4  pt-1 ">
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
            <option
              className="text-black"
              key={lang?.code}
              value={lang?.code}
              disabled={usedLangCodes.includes(lang?.code)}
            >
              {lang?.name || lang?.label}
              {usedLangCodes.includes(lang?.code) ? ` (${t("already added")})` : ""}
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

      {/* Start Video Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Video Type")} <span className="text-red-500">*</span>
        </label>
        <select
          name="video_type"
          value={formData?.video_type}
          onChange={onInputChange}
          disabled={disableVideoType}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            disableVideoType ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
          } ${
            errors?.video_type ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option hidden disabled value="">
            {t("Select video type")}
          </option>
          <option value={"clip_video"}>New Clip</option>
          <option value={"full_video"}>Full Live Stream</option>
        </select>
        {errors?.video_type && (
          <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
            <AlertCircle size={16} />
            <span>{errors.video_type}</span>
          </div>
        )}
      </div>

      {/* End Video Type */}
    </div>
  );
};
