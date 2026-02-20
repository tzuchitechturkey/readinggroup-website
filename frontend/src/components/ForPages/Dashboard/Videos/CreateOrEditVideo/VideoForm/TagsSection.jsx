import { useTranslation } from "react-i18next";
import { AlertCircle, X } from "lucide-react";

export const TagsSection = ({
  tags,
  tagInput,
  onTagInputChange,
  onTagInputKeyPress,
  onTagRemove,
  error,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t("Tags")} <span className="text-red-500">*</span>
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => onTagInputChange(e.target.value)}
          onKeyPress={onTagInputKeyPress}
          placeholder={t("Enter tag and press Enter")}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => onTagRemove(tag)}
                className="hover:text-green-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
