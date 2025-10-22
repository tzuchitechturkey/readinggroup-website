import React from "react";

import { Calendar, Clock, Eye, Play, ExternalLink, Hash } from "lucide-react";
import { useTranslation } from "react-i18next";

function VideoShow({ selectedVideo, setShowDetailsModal, handleEdit }) {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const formatViews = (views) => {
    if (!views) return "0";
    return views.toLocaleString();
  };
  return (
    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[85vh] overflow-y-auto">
      <div className="space-y-6">
        {/* Header with thumbnail and title */}
        <div className="flex items-start gap-6">
          <div className="relative">
            <img
              src={selectedVideo.thumbnail_url || selectedVideo.thumbnail}
              alt={selectedVideo.title}
              className="w-48 h-32 rounded-lg object-cover shadow-md bg-gray-100"
              onError={(e) => {
                e.target.src = "/placeholder-video.png";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg hover:bg-opacity-20 transition-all cursor-pointer">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-xl text-[#1D2630] mb-3 leading-tight">
              {selectedVideo.title}
            </h4>

            {/* Reference Code */}
            {selectedVideo.reference_code && (
              <div className="flex items-center gap-2 mb-4">
                <Hash className="w-4 h-4 text-gray-500" />
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm font-mono">
                  {selectedVideo.reference_code}
                </span>
              </div>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600">{t("Duration")}: </span>
                <span className="font-medium">
                  {selectedVideo.duration || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">{t("Views")}: </span>
                <span className="font-medium">
                  {formatViews(selectedVideo.views)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main information grid */}
        <div className="border-t pt-6">
          <h5 className="font-semibold text-lg text-[#1D2630] mb-4">
            {t("Video Information")}
          </h5>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-gray-600 text-sm block mb-1">
                  {t("Category")}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedVideo.category?.name || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-600 text-sm block mb-1">
                  {t("Video Type")}
                </span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedVideo.video_type || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-600 text-sm block mb-1">
                  {t("Language")}
                </span>
                <span className="font-medium text-gray-800">
                  {selectedVideo.language || "N/A"}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-gray-600 text-sm block mb-2">
                  {t("Tags")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedVideo.tags && selectedVideo.tags.length > 0 ? (
                    selectedVideo.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">N/A</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-gray-600 text-sm block mb-2">
                  {t("Casts")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedVideo.cast && selectedVideo.cast.length > 0 ? (
                    selectedVideo.cast.map((castMember, index) => (
                      <span
                        key={index}
                        className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {castMember}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">N/A</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-gray-600 text-sm flex items-center gap-1 mb-1">
                  <Calendar className="w-4 h-4" />
                  {t("Published Date")}
                </span>
                <span className="font-medium text-gray-800">
                  {formatDate(selectedVideo.published_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status and Links */}
        <div className="border-t pt-6">
          <h5 className="font-semibold text-lg text-[#1D2630] mb-4">
            {t("Type & Links")}
          </h5>

          {/* Start Status badges */}
          <div className="flex gap-3 mb-4">
            <p> {t("Status")}</p>
            {selectedVideo.featured && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                ⭐ {t("Featured Video")}
              </span>
            )}
            {selectedVideo.is_new && (
              <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                🆕 {t("New Video")}
              </span>
            )}
            {!selectedVideo.featured && !selectedVideo.is_new && (
              <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-sm font-medium">
                📹 {t("Standard Video")}
              </span>
            )}
          </div>
          {/* End Status badges */}

          {/* Start Video Type */}
          <div className="flex items-center gap-3 mt-3 mb-4">
            <span> {t("Type")}</span>
            <span className="w-fit  bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
              {selectedVideo?.video_type}
            </span>
          </div>
          {/* End Video Type */}
          {/* Video link */}
          {selectedVideo.video_url && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-gray-600 text-sm block mb-2">
                {t("Video URL")}
              </span>
              <a
                href={selectedVideo.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2 hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                {t("Watch Video")}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
        <button
          onClick={() => setShowDetailsModal(false)}
          className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {t("Close")}
        </button>
        <button
          onClick={() => {
            handleEdit(selectedVideo.id);
            setShowDetailsModal(false);
          }}
          className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
        >
          {t("Edit Video")}
        </button>
      </div>
    </div>
  );
}

export default VideoShow;
