import React from "react";

import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";

function RatingSection({
  userRating,
  hoveredRating,
  onStarRating,
  onStarHover,
  onStarLeave,
  contentData,
  isRTL = false,
  className = "",
}) {
  const { t } = useTranslation();

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 mb-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {t("Rate this content")}
      </h3>
      <div
        className={`flex items-center ${
          isRTL ? "flex-row-reverse" : ""
        } justify-between`}
      >
        <div
          className={`flex items-center ${
            isRTL ? "space-x-reverse" : ""
          } space-x-2`}
        >
          <span className={`text-sm text-gray-600 ${isRTL ? "ml-3" : "mr-3"}`}>
            {t("Your rating:")}
          </span>
          <div
            className={`flex items-center ${
              isRTL ? "space-x-reverse" : ""
            } space-x-1`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onStarRating(star)}
                onMouseEnter={() => onStarHover(star)}
                onMouseLeave={onStarLeave}
                className="transition-all duration-200 hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 transition-colors duration-200 ${
                    star <= (hoveredRating || userRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-200"
                  }`}
                />
              </button>
            ))}
          </div>
          {userRating > 0 && (
            <span className={`text-sm text-primary ${isRTL ? "mr-2" : "ml-2"}`}>
              ({userRating}/5)
            </span>
          )}
        </div>
        <div
          className={`flex items-center ${
            isRTL ? "space-x-reverse" : ""
          } space-x-2`}
        >
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(contentData.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {contentData.rating} ({contentData.reviews}k {t("reviews")})
          </span>
        </div>
      </div>
     
    </div>
  );
}

export default RatingSection;
