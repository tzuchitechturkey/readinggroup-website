import React from "react";

import { useTranslation } from "react-i18next";

import { VideosList } from "@/components/ForPages/Dashboard/ChartCards/Videos";

function VideoManagement() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("Video Management")}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {t(
            "Manage your video library, create new content, and organize your media collection."
          )}
        </p>
      </div>

      {/* Videos List Component */}
      <VideosList />
    </div>
  );
}

export default VideoManagement;
