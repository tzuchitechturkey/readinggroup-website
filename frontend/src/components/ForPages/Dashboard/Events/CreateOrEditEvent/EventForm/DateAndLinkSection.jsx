import { useTranslation } from "react-i18next";

import DatePickerWithYearMonth from "../../../Videos/CreateOrEditVideo/DatePickerWithYearMonth";

const DateAndLinkSection = ({
  happenedAt,
  externalLink,
  onDateChange,
  onLinkChange,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Happened At Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Happened At")} *
        </label>
        <DatePickerWithYearMonth
          value={happenedAt}
          onChange={onDateChange}
          placeholder={t("Pick Happened At date")}
          error={Boolean(errors.happened_at)}
        />
        {errors.happened_at && (
          <p className="text-red-500 text-xs mt-1">{errors.happened_at}</p>
        )}
      </div>

      {/* External Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("External Link")} *
        </label>
        <input
          type="url"
          value={externalLink}
          onChange={(e) => onLinkChange(e.target.value)}
          className={`w-full p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.external_link ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={t(
            "Enter the external link (e.g., https://example.com)",
          )}
        />
        <p className="text-xs text-gray-500 mt-1">
          {t("Please enter a valid URL starting with http:// or https://")}
        </p>
        {errors.external_link && (
          <p className="text-red-500 text-xs mt-1">{errors.external_link}</p>
        )}
      </div>
    </div>
  );
};

export default DateAndLinkSection;
