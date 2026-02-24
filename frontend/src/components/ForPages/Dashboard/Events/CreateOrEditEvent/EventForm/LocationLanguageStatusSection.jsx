import { useTranslation } from "react-i18next";

import countries from "@/constants/countries.json";
import { languages, postStatusOptions } from "@/constants/constants";

const LocationLanguageStatusSection = ({
  country,
  language,
  status,
  onCountryChange,
  onLanguageChange,
  onStatusChange,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Country")} *
        </label>
        <select
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.country ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="" disabled hidden>
            {t("Select Country")}
          </option>
          {countries.map((c) => (
            <option key={c.code} value={c.name}>
              {t(c.name)}
            </option>
          ))}
        </select>
        {errors.country && (
          <p className="text-red-500 text-xs mt-1">{errors.country}</p>
        )}
      </div>

      {/* Language */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Language")} *
        </label>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.language ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="" disabled hidden>
            {t("Select Language")}
          </option>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.label}>
              {t(lang.label)}
            </option>
          ))}
        </select>
        {errors.language && (
          <p className="text-red-500 text-xs mt-1">{errors.language}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Status")} *
        </label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.status ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="" disabled hidden>
            {t("Select Status")}
          </option>
          {postStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="text-red-500 text-xs mt-1">{errors.status}</p>
        )}
      </div>
    </div>
  );
};

export default LocationLanguageStatusSection;
