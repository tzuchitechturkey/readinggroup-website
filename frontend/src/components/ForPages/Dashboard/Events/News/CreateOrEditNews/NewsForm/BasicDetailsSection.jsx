import { useTranslation } from "react-i18next";
import DatePickerWithMonthYear from "@/components/Global/DatePickerWithMonthYear/DatePickerWithMonthYear";

const BasicDetailsSection = ({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  happenedAt,
  onHappenedAtChange,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Latest News Title")}*
        </label>
        <input
          type="text"
          value={title}
          onChange={onTitleChange}
          className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={t("Enter news title")}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Description")}*
        </label>
        <textarea
          value={description}
          onChange={onDescriptionChange}
          rows={5}
          className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={t("Enter news description")}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Latest News Date")}*
        </label>
        <DatePickerWithMonthYear
          value={happenedAt}
          onChange={onHappenedAtChange}
          error={errors.happened_at}
          t={t}
        />
        {errors.happened_at && (
          <p className="text-red-500 text-xs mt-1">{errors.happened_at}</p>
        )}
      </div>
    </div>
  );
};

export default BasicDetailsSection;