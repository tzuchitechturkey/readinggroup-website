import { useTranslation } from "react-i18next";
import { AlertCircle, X } from "lucide-react";

export const CastSection = ({
  cast,
  castInput,
  onCastInputChange,
  onCastInputKeyPress,
  onCastRemove,
  error,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t("Cast Members")}
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={castInput}
          onChange={(e) => onCastInputChange(e.target.value)}
          onKeyPress={onCastInputKeyPress}
          placeholder={t("Enter cast member name and press Enter")}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {cast && cast.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {cast.map((castMember, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              <span>{castMember}</span>
              <button
                type="button"
                onClick={() => onCastRemove(castMember)}
                className="hover:text-blue-600"
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
