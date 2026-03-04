import { useTranslation } from "react-i18next";

const BasicDetailsSection = ({
  title,
  reportType,
  onTitleChange,
  onReportTypeChange,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Title")} *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={t("Enter report title")}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* Report Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Report Type")} *
        </label>
        <select
          value={reportType}
          onChange={(e) => onReportTypeChange(e.target.value)}
          className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.report_type ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="" disabled hidden>
            {t("Select Type")}
          </option>
          <option value="videos">{t("Video")}</option>
          <option value="reports">{t("Reports")}</option>
        </select>
        {errors.report_type && (
          <p className="text-red-500 text-xs mt-1">{errors.report_type}</p>
        )}
      </div>
    </div>
  );
};

export default BasicDetailsSection;
