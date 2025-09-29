import React from "react";

import { useTranslation } from "react-i18next";

function VideoShow({ selectedVideo, setShowDetailsModal, handleEdit }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <img
            src={selectedVideo.image}
            alt={selectedVideo.title}
            className="w-32 h-24 rounded object-cover"
          />
          <div className="flex-1">
            <h4 className="font-medium text-[#1D2630] mb-2">
              {selectedVideo.title}
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">{t("Duration")}: </span>
                <span className="font-medium">{selectedVideo.duration}</span>
              </div>
              <div>
                <span className="text-gray-600">{t("Views")}: </span>
                <span className="font-medium">{selectedVideo.views}</span>
              </div>
              <div>
                <span className="text-gray-600">{t("Category")}: </span>
                <span className="font-medium">{selectedVideo.category}</span>
              </div>
              <div>
                <span className="text-gray-600">{t("Type")}: </span>
                <span className="font-medium">{selectedVideo.type}</span>
              </div>
              <div>
                <span className="text-gray-600">{t("Language")}: </span>
                <span className="font-medium">{selectedVideo.language}</span>
              </div>
              <div>
                <span className="text-gray-600">{t("Subject")}: </span>
                <span className="font-medium">{selectedVideo.subject}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h5 className="font-medium text-[#1D2630] mb-2">{t("Additional Information")}</h5>
          <div className="text-sm space-y-2">
            <div>
              <span className="text-gray-600">{t("Published")}: </span>
              <span>{selectedVideo.timeAgo}</span>
            </div>
            <div>
              <span className="text-gray-600">{t("Video URL")}: </span>
              <a
                href={selectedVideo.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {t("Watch on YouTube")}
              </a>
            </div>
            <div className="flex gap-2">
              {selectedVideo.featured && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                  {t("Featured Video")}
                </span>
              )}
              {selectedVideo.isNew && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  {t("New Video")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowDetailsModal(false)}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          {t("Close")}
        </button>
        <button
          onClick={() => {
            handleEdit(selectedVideo.id);
            setShowDetailsModal(false);
          }}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
        >
          {t("Edit Video")}
        </button>
      </div>
    </div>
  );
}

export default VideoShow;
