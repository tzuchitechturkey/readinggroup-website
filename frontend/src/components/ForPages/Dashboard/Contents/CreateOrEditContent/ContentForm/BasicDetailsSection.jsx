import { Input } from "@/components/ui/input";

export const BasicDetailsSection = ({
  t,
  formData,
  errors,
  handleInputChange,
  postStatusOptions,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Title")} *
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder={t("Enter content title")}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Subtitle")} *
          </label>
          <Input
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            placeholder={t("Enter content subtitle")}
            className={errors.subtitle ? "border-red-500" : ""}
          />
          {errors.subtitle && (
            <p className="text-red-500 text-xs mt-1">{errors.subtitle}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Status")} *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md outline-0 ${
              errors.status ? "border-red-500" : "border-gray-300"
            } ${!formData.status ? "text-gray-400" : "text-black"}`}
          >
            <option value="" hidden disabled>
              {t("Select Status")}
            </option>
            {postStatusOptions.map((option) => (
              <option
                className="text-black"
                key={option.value}
                value={option.value}
              >
                {t(option.label)}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="text-red-500 text-xs mt-1">{errors.status}</p>
          )}
        </div>

        {/* Read Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Read Time")} *
          </label>
          <Input
            name="read_time"
            type="number"
            value={formData.read_time}
            onChange={handleInputChange}
            placeholder={t("Enter Read Time in minutes")}
            className={errors.read_time ? "border-red-500" : ""}
          />
          {errors.read_time && (
            <p className="text-red-500 text-xs mt-1">{errors.read_time}</p>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {/* Active Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Status")}
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="w-5 h-5 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">
              {formData.is_active
                ? t("Active and visible")
                : t("Inactive and hidden")}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
