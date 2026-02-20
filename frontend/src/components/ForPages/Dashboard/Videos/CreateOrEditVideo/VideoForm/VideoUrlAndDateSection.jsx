import { useTranslation } from "react-i18next";
import { AlertCircle, Loader } from "lucide-react";

import DatePickerWithYearMonth from "../DatePickerWithYearMonth";

export const VideoUrlAndDateSection = ({
  formData,
  onInputChange,
  onFetchYouTube,
  isFetchingYoutube,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Video URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Video URL")} <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="video_url"
            value={formData?.video_url}
            onChange={onInputChange}
            placeholder={t("Enter YouTube URL")}
            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors?.video_url ? "border-red-500" : "border-gray-300"
            }`}
          />
          <button
            type="button"
            onClick={onFetchYouTube}
            disabled={isFetchingYoutube || !formData?.video_url}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            {isFetchingYoutube && <Loader size={16} className="animate-spin" />}
            {t("Fetch Info")}
          </button>
        </div>
        {errors?.video_url && (
          <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
            <AlertCircle size={16} />
            <span>{errors.video_url}</span>
          </div>
        )}
      </div>

      {/* Happened At Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Happened At")} <span className="text-red-500">*</span>
        </label>
        <DatePickerWithYearMonth
          value={formData?.happened_at}
          onChange={(date) => {
            onInputChange({
              target: { name: "happened_at", value: date },
            });
          }}
        />
        {errors?.happened_at && (
          <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
            <AlertCircle size={16} />
            <span>{errors.happened_at}</span>
          </div>
        )}
      </div>
    </div>
  );
};
