import React, { useState, useEffect } from "react";

import { Play, Heart, Download, Share2, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import TabsSection from "@/components/ForPages/Videos/VideoDetails/TabsSections/TabSections";
import Modal from "@/components/Global/Modal/Modal";
import ShareModal from "@/components/Global/ShareModal/ShareModal";
import { GetVideoById, LikeVideo, UnlikeVideo } from "@/api/videos";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";

function VideoDetailsContent({
  isOpen: externalIsOpen = true,
  onClose,
  videoData,
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  // const [videoData, setVideoData] = useState(videoData);
  // Use internal state to control modal visibility
  const [internalIsOpen, setInternalIsOpen] = useState(externalIsOpen);
  const [userId, setUserId] = useState();

  const [showAllCast, setShowAllCast] = useState(false);

  // State to control favorite status
  const [isLiked, setIsLiked] = useState(false);

  // State to control share modal visibility
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // State to control download button clicked status
  const [isDownloadClicked, setIsDownloadClicked] = useState(false);
  // const getVideoData = async ( ) => {
  //   setIsLoading(true);
  //   try {
  //     const res = await GetVideoById(videoId);
  //     setVideoData(res.data?.data);
  //   } catch (err) {
  //     setErrorFn(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  //   useEffect(() => {
  //   getVideoData(videoId);
  // }, [videoId]);
  // Sync with external isOpen prop when it changes

  // دالة الإعجاب
  const handleLike = async () => {
    try {
      if (!isLiked) {
        await LikeVideo({ user: userId, video: videoData?.id });
        toast.success(t("Added to favorites!"));
      } else {
        await UnlikeVideo({ user: userId, video: videoData?.id });
        toast.info(t("Removed from favorites"));
      }
      setIsLiked(!isLiked);
    } catch (error) {
      setErrorFn(error);
    }
  };

  useEffect(() => {
    setInternalIsOpen(externalIsOpen);
  }, [externalIsOpen]);

  // Keep modal open on route/location changes
  useEffect(() => {
    setInternalIsOpen(true);
  }, [location.pathname, location.search]);
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);
  const handleClose = () => {
    // Set internal state first
    setInternalIsOpen(false);

    // Use timeout to allow animation to complete before navigation
    setTimeout(() => {
      if (onClose && typeof onClose === "function") {
        onClose();
        return;
      }
      // If no onClose provided (rendered via route), go back
      navigate(-1);
    }, 300); // Match animation duration in Modal component
  };
  return (
    <Modal
      isOpen={internalIsOpen}
      onClose={handleClose}
      width="1000px"
      mountOnEnter={true}
      unmountOnExit={false}
    >
      {isLoading && <Loader />}
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
          {/* Hero Section with Background */}
          <div className="relative h-[45vh] xs:h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] overflow-hidden rounded-none -m-1">
            {/* Background Image */}
            <div className="absolute inset-0 -m-1">
              <img
                src={videoData?.thumbnail || videoData?.thumbnail_url}
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
                  {videoData?.title}
                </h1>

                {/* Play Button and Controls Row */}
                <div className="flex items-center gap-2 relative z-50 xs:gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <Link
                    to={`/videos/${videoData?.id}`}
                    className="flex items-center justify-center bg-white text-black hover:bg-white/90 transition-all duration-300 rounded-md px-3 xs:px-4 py-1.5 xs:py-2 font-medium text-xs xs:text-sm hover:scale-105 hover:shadow-lg hover:shadow-white/25 group"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Play className="w-3.5 xs:w-4 h-3.5 xs:h-4 mr-1.5 xs:mr-2 transition-all duration-300 group-hover:scale-110 group-hover:translate-x-0.5 pointer-events-none" />
                    <span className="text-sm transition-all duration-300 group-hover:font-semibold pointer-events-none">
                      {t("Play")}
                    </span>
                  </Link>

                  <button
                    className={`  p-2 xs:p-3 min-w-[36px] xs:min-w-[44px] min-h-[36px] xs:min-h-[44px] flex items-center justify-center rounded-full backdrop-blur-sm border-2 transition-all duration-200 group cursor-pointer ${
                      isLiked
                        ? "bg-red-500/20 border-red-400/60 hover:bg-red-500/30 hover:border-red-400/80"
                        : "bg-black/40 border-white/50 hover:bg-black/60 hover:border-white/70"
                    }`}
                    title={
                      isLiked ? "Remove from Favorites" : "Add to Favorites"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike();
                    }}
                    style={{ touchAction: "manipulation" }}
                  >
                    <Heart
                      className={`w-3.5 xs:w-4 h-3.5 xs:h-4 transition-all duration-200 group-hover:scale-110 pointer-events-none ${
                        isLiked
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDownloadClicked(true);
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
              <p className="text-gray-400 text-xs xs:text-sm font-light mb-2">
                {t("Season")} · {videoData?.season}
              </p>
              <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed mb-3 xs:mb-4">
                {videoData?.description}
              </p>
            </div>

            {/* Right Column - Additional Info */}
            <div className="lg:col-span-1">
              <div className="space-y-3">
                {/* Start Cast   */}
                <div>
                  <p className="text-sm flex items-center flex-wrap text-gray-600 leading-snug mb-2">
                    <span className="font-medium text-gray-700">
                      {t("Top Cast")}:{" "}
                    </span>
                    {videoData?.cast?.map((cas, index) => (
                      <span
                        key={index}
                        className="px-1 py-1 border-[1px] border-gray-300 rounded-full mx-1 text-xs"
                      >
                        {cas}
                      </span>
                    ))}
                  </p>
                  {/* {videoData?.cast.length > 3 && (
                    <button
                      className="inline-flex items-center px-3 py-1.5 bg-transparent hover:bg-blue-50 text-[var(--color-primary)] hover:text-[var(--color-primary)] text-xs border border-[var(--color-primary)] rounded-full transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAllCast(!showAllCast);
                      }}
                    >
                      <span>{showAllCast ? "View Less" : "View More"}</span>
                      <svg
                        className={`ml-1 w-3 h-3 transition-transform duration-200 ${
                          showAllCast ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )} */}
                </div>
                {/* End Cast   */}

                <div>
                  <p className="text-sm flex items-center flex-wrap text-gray-600 leading-snug mb-2">
                    <span className="font-medium text-gray-700">
                      {t("Tags")}:{" "}
                    </span>
                    {videoData?.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-1 py-1 border-[1px] border-gray-300 rounded-full mx-1 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </p>
                </div>

                {/* Start Category   */}
                <div>
                  <p className="text-sm flex items-center flex-wrap text-gray-600 leading-snug mb-2">
                    <span className="font-medium text-gray-700">
                      {t("Category")}:{" "}
                    </span>
                    <span className="px-1 py-1 border-[1px] border-gray-300 rounded-full mx-1 text-xs">
                      {videoData?.category?.name}
                    </span>
                  </p>
                </div>
                {/* End Cast   */}
              </div>
            </div>
          </div>
          {/* End Description */}

          {/* Top Cast Section removed as it's now in the right info column */}
        </div>

        {/* End Description && Top Cast */}

        {/* Start Episodes && User Reviews */}
        <div className="px-0 xs:px-1 sm:px-2 md:px-2 lg:px-5 py-1 xs:py-2 sm:py-3 md:py-4">
          <TabsSection />
        </div>
        {/* End Episodes && User Reviews */}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={window.location.href}
        title={videoData?.title}
      />
    </Modal>
  );
}

export default VideoDetailsContent;
