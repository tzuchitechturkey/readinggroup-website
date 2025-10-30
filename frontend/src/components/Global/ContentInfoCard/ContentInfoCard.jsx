import React from "react";

import { useTranslation } from "react-i18next";
import { Star, User, Camera, Calendar, MapPin } from "lucide-react";

function ContentInfoCard({
  contentData,
  contentType = "card", // "card" or "photo"
  isRTL = false,
  className = "",
}) {
  const { t } = useTranslation();

  // دالة ترجمة الـ tags
  const translateTag = (tag) => {
    return t(tag) || tag;
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 mb-6 ${className}`}>
      {/* Header with badge and more options */}
      {/* <div className="flex items-start justify-between mb-4">
        <div>
          <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-md">
            {contentType === "photo" ? contentData?.category : contentData?.badge}
          </span>
        </div>
      </div> */}

      {/* Title */}
      <h1
        className={`text-xl font-bold text-gray-900 mb-2 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {contentData?.title}
      </h1>

      {/* Subtitle for photos */}
      {contentType === "photo" && contentData?.subtitle && (
        <p
          className={`text-gray-600 text-sm mb-4 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {contentData?.subtitle}
        </p>
      )}

      {/* Start Writer/Photographer and Rating Row */}
      <div
        className={`flex items-center ${
          isRTL ? "flex-row-reverse" : ""
        } justify-between mb-4`}
      >
        <div
          className={`flex items-center ${
            isRTL ? "space-x-reverse" : ""
          } space-x-2`}
        >
          {contentType === "photo" ? (
            <Camera className="w-4 h-4 text-primary" />
          ) : (
            <User className="w-4 h-4 text-primary" />
          )}
          <span className="text-sm text-primary">{contentData?.writer}</span>
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
                  i < Math.floor(contentData?.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({contentData?.reviews})
          </span>
        </div>
      </div>
      {/* End Writer/Photographer and Rating Row */}

      {/* Start Body  */}
      <div>
        <p className="m-1">{contentData?.body}</p>
      </div>
      {/* End Body  */}
      {/* Date and Location Row for photos */}
      {contentType === "photo" && (
        <div
          className={`flex items-center ${
            isRTL ? "flex-row-reverse" : ""
          } justify-between mb-4`}
        >
          <div
            className={`flex items-center ${
              isRTL ? "space-x-reverse" : ""
            } space-x-2`}
          >
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{contentData?.date}</span>
          </div>
          <div
            className={`flex items-center ${
              isRTL ? "space-x-reverse" : ""
            } space-x-2`}
          >
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {contentData?.location}
            </span>
          </div>
        </div>
      )}

      {/* Description */}
      <p
        className={`text-gray-700 text-sm leading-relaxed mb-4 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {contentData?.description}
      </p>

      {/* Camera Settings for photos */}
      {contentType === "photo" &&
        contentData?.camera &&
        contentData?.settings && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              {t("Camera Settings")}
            </h4>
            <div className="space-y-1">
              <div
                className={`flex ${
                  isRTL ? "flex-row-reverse" : ""
                } justify-between text-xs`}
              >
                <span className="text-gray-600">{t("Camera")}:</span>
                <span className="text-gray-900">{contentData?.camera}</span>
              </div>
              <div
                className={`flex ${
                  isRTL ? "flex-row-reverse" : ""
                } justify-between text-xs`}
              >
                <span className="text-gray-600">{t("Settings")}:</span>
                <span className="text-gray-900">{contentData?.settings}</span>
              </div>
            </div>
          </div>
        )}

      {/* Tags */}
      <div
        className={`flex flex-wrap gap-2 ${
          isRTL ? "justify-start" : "justify-start"
        }`}
      >
        {contentData?.tags &&
          contentData?.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              {translateTag(tag)}
            </span>
          ))}
      </div>
    </div>
  );
}

export default ContentInfoCard;
