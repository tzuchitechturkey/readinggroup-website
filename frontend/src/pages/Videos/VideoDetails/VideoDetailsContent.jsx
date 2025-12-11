import React, { useState, useEffect } from "react";

import { Play, Heart, Download, Share2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import TabsSection from "@/components/ForPages/Videos/VideoDetails/TabsSections/TabSections";
import ShareModal from "@/components/Global/ShareModal/ShareModal";
import { PatchVideoById } from "@/api/videos";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Modal from "@/components/Global/Modal/Modal";

function VideoDetailsContent({
  isOpen: externalIsOpen = true,
  onClose,
  videoData,
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [videoItem, setVideoItem] = useState(videoData);
  const [internalIsOpen, setInternalIsOpen] = useState(externalIsOpen);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDownloadClicked, setIsDownloadClicked] = useState(false);

  // Download image function
  const handleDownloadImage = async () => {
    try {
      setIsDownloadClicked(true);

      const imageUrl = videoItem?.thumbnail || videoItem?.thumbnail_url;
      if (!imageUrl) {
        toast.error(t("No image available to download"));
        return;
      }

      // Fetch the image
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${videoItem?.title || "video"}-thumbnail.jpg`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      t("Image downloaded successfully");

      // Reset button state after 2 seconds
      setTimeout(() => {
        setIsDownloadClicked(false);
      }, 2000);
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error(t("Failed to download image"));
      setIsDownloadClicked(false);
    }
  };

  const handleLike = async () => {
    try {
      const newLikedState = !videoItem?.has_liked;

      await PatchVideoById(videoItem.id, {
        has_liked: newLikedState,
      });

      setVideoItem({
        ...videoItem,
        has_liked: newLikedState,
      });
    } catch (error) {
      setErrorFn(error, t);
      toast.error(t("Failed to update like status"));
    }
  };

  useEffect(() => {
    setVideoItem(videoData);
  }, [videoData]);

  const handleClose = () => {
    setInternalIsOpen(false);

    setTimeout(() => {
      if (onClose && typeof onClose === "function") {
        onClose();
        return;
      }
      navigate(-1);
    }, 300);
  };

  return (
    <Modal
      isOpen={internalIsOpen}
      onClose={handleClose}
      width="1000px"
      mountOnEnter={true}
      unmountOnExit={false}
    >
      <div
        className="relative w-full h-full overflow-auto p-0 custom-scrollbar rounded-none"
        style={{
          margin: "0",
          padding: "0",
          width: "101%",
          maxHeight: "calc(85vh - 4rem)",
          overflowX: "hidden",
          borderRadius: "0",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        dir={i18n?.language === "ar" ? "rtl" : "ltr"}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 xs:top-3 right-2 xs:right-3 text-white hover:text-gray-300 bg-black/80 backdrop-blur-sm rounded-full p-1.5 xs:p-2 shadow-xl border border-white/20 transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          style={{
            zIndex: 9999,
          }}
        >
          <X size={18} className="xs:w-5 xs:h-5" strokeWidth={2} />
        </button>

        {/* Start Hero Section */}
        <div className="bg-black text-white relative z-11 -m-6 rounded-none">
          {/* Hero Section with Background */}
          <div className="relative h-[45vh] xs:h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] overflow-hidden rounded-none -m-1">
            {/* Background Image */}
            <div className="absolute inset-0 -m-1">
              <img
                src={videoItem?.thumbnail || videoItem?.thumbnail_url}
                alt="Video background"
                className="w-full h-full object-cover rounded-none -m-1"
                onError={(e) => {
                  console.error("Image failed to load:", e);
                  e.target.src = `${window.location.origin}/src/assets/authback.jpg`;
                }}
                style={{
                  display: "block",
                  zIndex: 0,
                  objectPosition: "center center",
                  borderRadius: "0",
                  margin: "0",
                  padding: "0",
                }}
              />
              {/* Gradient Overlays */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                style={{ zIndex: 1 }}
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent"
                style={{ zIndex: 2 }}
              />
            </div>

            {/* Content */}
            <div
              className="relative z-10 flex flex-col justify-end h-full px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 pb-6 xs:pb-8 sm:pb-10 md:pb-12"
              style={{ zIndex: 10 }}
            >
              <div className="max-w-3xl px-6 md:px-0">
                <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-4xl mb-3 sm:mb-4 md:mb-6 leading-tight font-bold text-white">
                  {videoItem?.title}
                </h1>

                {/* Play Button and Controls Row */}
                <div className="flex items-center gap-2 relative z-50 xs:gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <Link
                    to={
                      videoItem?.report_type
                        ? `/events/video/${videoItem?.id}`
                        : `/videos/${videoItem?.id}`
                    }
                    className="flex items-center justify-center bg-white text-black hover:bg-white/90 transition-all duration-300 rounded-md px-3 xs:px-4 py-1.5 xs:py-2 font-medium text-xs xs:text-sm hover:scale-105 hover:shadow-lg hover:shadow-white/25 group"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose();
                    }}
                  >
                    <Play className="w-3.5 xs:w-4 h-3.5 xs:h-4 mr-1.5 xs:mr-2 transition-all duration-300 group-hover:scale-110 group-hover:translate-x-0.5 pointer-events-none" />
                    <span className="text-sm transition-all duration-300 group-hover:font-semibold pointer-events-none">
                      {t("Play")}
                    </span>
                  </Link>

                  <button
                    className={`  p-2 xs:p-3 min-w-[36px] xs:min-w-[44px] min-h-[36px] xs:min-h-[44px] flex items-center justify-center rounded-full backdrop-blur-sm border-2 transition-all duration-200 group cursor-pointer ${
                      videoItem?.has_liked
                        ? "bg-red-500/20 border-red-400/60 hover:bg-red-500/30 hover:border-red-400/80"
                        : "bg-black/40 border-white/50 hover:bg-black/60 hover:border-white/70"
                    }`}
                    title={
                      videoItem?.has_liked
                        ? "Remove from Favorites"
                        : "Add to Favorites"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike();
                    }}
                    style={{ touchAction: "manipulation" }}
                  >
                    <Heart
                      className={`w-3.5 xs:w-4 h-3.5 xs:h-4 transition-all duration-200 group-hover:scale-110 pointer-events-none ${
                        videoItem?.has_liked
                          ? "text-red-500 fill-red-500 group-hover:text-red-400 group-hover:fill-red-400"
                          : "text-white group-hover:text-red-300"
                      }`}
                    />
                  </button>

                  <button
                    className={`p-2 xs:p-3 min-w-[36px] xs:min-w-[44px] min-h-[36px] xs:min-h-[44px] flex items-center justify-center rounded-full backdrop-blur-sm border-2 transition-all duration-200 group cursor-pointer ${
                      isDownloadClicked
                        ? "bg-green-500/20 border-green-400/60 hover:bg-green-500/30 hover:border-green-400/80"
                        : "bg-black/40 border-white/50 hover:bg-black/60 hover:border-white/70"
                    }`}
                    title="Download"
                    onClick={() => {
                      handleDownloadImage();
                    }}
                    style={{ touchAction: "manipulation" }}
                  >
                    <Download
                      className={`w-3.5 xs:w-4 h-3.5 xs:h-4 transition-all duration-200 group-hover:scale-110 pointer-events-none ${
                        isDownloadClicked
                          ? "text-green-500 group-hover:text-green-400"
                          : "text-white group-hover:text-white"
                      }`}
                    />
                  </button>

                  <button
                    className="p-2 xs:p-3 min-w-[36px] xs:min-w-[44px] min-h-[36px] xs:min-h-[44px] flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border-2 border-white/50 hover:bg-black/60 transition-all duration-200 group cursor-pointer"
                    title="Share"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsShareModalOpen(true);
                    }}
                    style={{ touchAction: "manipulation" }}
                  >
                    <Share2 className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-white pointer-events-none" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Start Blur Background */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 bg-gradient-to-t from-white via-white/50 to-transparent"
            style={{ zIndex: 1 }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-8 sm:h-10 md:h-12 bg-gradient-to-t from-white/70 to-transparent"
            style={{ zIndex: 19 }}
          />
        </div>
        {/* End Hero Section */}

        {/* Start Description && Top Cast */}
        <div className="py-4 xs:py-6 sm:py-8 md:py-10 lg:py-12 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 mt-2 xs:mt-4">
          {/* Video Details and Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 lg:gap-6 mb-4 xs:mb-6">
            {/* Left Column - Description */}
            <div className="lg:col-span-2">
              {/* Seasons and Year on left side below description */}
              {!videoData?.report_type && videoItem?.season_name && (
                <p className="text-gray-400 text-xs xs:text-sm font-light mb-2">
                  {t("Season")} · {videoItem?.season_name?.season_id}
                </p>
              )}
              <div
                dangerouslySetInnerHTML={{
                  __html: videoItem?.description || "",
                }}
                className=" text-xs xs:text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed mb-3 xs:mb-4"
              />
              {/* {videoItem?.report_type
                  ? videoItem?.summary
                  : videoItem?.description} */}

              {/* </div> */}
            </div>

            {/* Right Column - Additional Info */}
            <div className="lg:col-span-1">
              <div className="space-y-3">
                {/* Start Cast   */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <span className="font-medium text-gray-700">
                      {t("Top Cast")}:
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {videoItem?.cast?.map((cas, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full shadow-sm hover:bg-blue-50 transition-all duration-200 text-xs cursor-pointer"
                      >
                        {cas}
                      </span>
                    ))}
                  </div>
                </div>
                {/* End Cast   */}

                {/* Start Tags   */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <span className="font-medium text-gray-700">
                      {t("Tags")}:
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {videoItem?.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-800 rounded-full shadow-sm hover:bg-yellow-100 transition-all duration-200 text-xs cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {/* End Tags */}

                {/* Start Category   */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <span className="font-medium text-gray-700">
                      {t("Category")}:
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-800 rounded-full shadow-sm hover:bg-green-100 transition-all duration-200 text-xs cursor-pointer">
                      {/* بدون أيقونة نقطة */}
                      {videoItem?.category?.name}
                    </span>
                  </div>
                </div>
                {/* End Category   */}
              </div>
            </div>
          </div>
          {/* End Description */}

          {/* Top Cast Section removed as it's now in the right info column */}
        </div>
        {/* End Description && Top Cast */}

        {/* Start Episodes && User Reviews */}
        {!videoItem?.report_type && (
          <div className="px-0 xs:px-1 sm:px-2 md:px-2 lg:px-5 py-1 xs:py-2 sm:py-3 md:py-4">
            <TabsSection videoData={videoItem} />
          </div>
        )}
        {/* End Episodes && User Reviews */}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={window.location.href}
        title={videoItem?.title}
      />
    </Modal>
  );
}

export default VideoDetailsContent;
