import { Input } from "@/components/ui/input";

export const SelectFieldsSection = ({
  t,
  formData,
  errors,
  handleInputChange,
  languages,
  countries,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Language */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Language")} *
        </label>
        <select
          name="language"
          value={formData.language}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md outline-none ${
            errors.language ? "border-red-500" : "border-gray-300"
          } ${!formData.language ? "text-gray-400" : "text-black"}`}
        >
          <option value="" hidden disabled>
            {t("Select Language")}
          </option>
          {languages.map((lang) => (
            <option key={lang.label} className="text-black" value={lang.label}>
              {t(lang.label)}
            </option>
          ))}
        </select>
        {errors.language && (
          <p className="text-red-500 text-xs mt-1">{errors.language}</p>
        )}
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Country")}
        </label>
        <select
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md outline-none ${
            errors.country ? "border-red-500" : "border-gray-300"
          } ${!formData.country ? "text-gray-400" : "text-black"}`}
        >
          <option value="" hidden disabled>
            {t("Select Country")}
          </option>
          {countries?.map((option) => (
            <option key={option.code} className="text-black" value={option.code}>
              {t(option.name)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
