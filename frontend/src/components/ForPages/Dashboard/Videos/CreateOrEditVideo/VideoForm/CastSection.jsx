import { useTranslation } from "react-i18next";
import { AlertCircle, X } from "lucide-react";

export const CastSection = ({
  guestSpeakers,
  guestSpeakersInput,
  onGuestSpeakersInputChange,
  onGuestSpeakersInputKeyPress,
  onGuestSpeakersRemove,
  error,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t("Guest Speakers")}
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={guestSpeakersInput}
          onChange={(e) => onGuestSpeakersInputChange(e.target.value)}
          onKeyDown={onGuestSpeakersInputKeyPress}
          placeholder={t("Enter guest speaker name and press Enter")}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {guestSpeakers && guestSpeakers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {guestSpeakers.map((guestSpeaker, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              <span>{guestSpeaker}</span>
              <button
                type="button"
                onClick={() => onGuestSpeakersRemove(guestSpeaker)}
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
