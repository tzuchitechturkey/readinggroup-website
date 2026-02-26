import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import CustomyoutubeVideo from "@/components/ForPages/Videos/VideoPage/CustomyoutubeVideo/CustomyoutubeVideo";
import { GetVideoById } from "@/api/videos";
import Loader from "@/components/Global/Loader/Loader";

function VideoPageContent() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { id: paramId } = useParams();
  const [videoData, setVideoData] = useState(null);

  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await GetVideoById(paramId);
      setVideoData(res.data);
    } catch (err) {
      console.error("Failed to fetch video data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [paramId]);

  return (
    <div
      className="bg-[#D7EAFF] min-h-screen"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      {/* Start Show Video */}
      <CustomyoutubeVideo t={t} i18n={i18n} videoData={videoData} />
      {/* End Show Video */}
    </div>
  );
}

export default VideoPageContent;
