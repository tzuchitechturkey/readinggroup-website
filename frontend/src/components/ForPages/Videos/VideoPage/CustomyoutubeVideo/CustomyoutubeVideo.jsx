import React, { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { ThumbsUp, ListPlus, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-toastify";

import ShareModal from "@/components/Global/ShareModal/ShareModal";
import ShowHideText from "@/components/Global/ShowHideText/ShowHideText";
import ContentInfoCard from "@/components/Global/ContentInfoCard/ContentInfoCard";
import RatingSection from "@/components/Global/RatingSection/RatingSection";
import CommentsSection from "@/components/Global/CommentsSection/CommentsSection";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import LoginModal from "@/components/Global/LoginModal";
import {
  AddToMyList,
  RemoveFromMyList,
  PatchVideoById,
  GetTop5ViewedVideos,
} from "@/api/videos";
import { PatchEventById } from "@/api/events";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

function CustomyoutubeVideo({ videoData }) {
  const { t, i18n } = useTranslation();
  const [videoItem, setVideoItem] = useState(videoData);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [showAllRelated, setShowAllRelated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const videoRef = useRef(null);

  // دالة للتحقق من تسجيل الدخول
  const isLoggedIn = () => {
    return Boolean(localStorage.getItem("accessToken"));
  };

  // تطبيق RTL عند تغيير اللغة
  useEffect(() => {
    const isRTL = i18n.language === "ar";
    document.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.style.direction = isRTL ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    setVideoItem(videoData);
  }, [videoData]);

  // Fetch top viewed videos to show as similar content (to match other section)
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await GetTop5ViewedVideos();
        setRelatedVideos(res?.data || []);
      } catch (e) {
        console.error("Failed to fetch related videos:", e);
      }
    };
    fetchRelated();
  }, []);

  const isYouTubeUrl = (url) =>
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))/i.test(
      url || ""
    );

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    try {
      const u = new URL(url);
      let id = "";
      if (u.hostname.includes("youtu.be")) {
        id = u.pathname.slice(1);
      } else if (u.pathname.startsWith("/watch")) {
        id = u.searchParams.get("v") || "";
      } else if (u.pathname.startsWith("/shorts/")) {
        id = u.pathname.split("/")[2] || "";
      } else if (u.pathname.startsWith("/embed/")) {
        id = u.pathname.split("/")[2] || "";
      }
      if (!id) return "";
      const params = new URLSearchParams({
        rel: "0",
        modestbranding: "1",
        color: "white",
        iv_load_policy: "3",
      });
      return `https://www.youtube.com/embed/${id}?${params.toString()}`;
    } catch {
      return "";
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying((p) => !p);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime || 0);
    setDuration(videoRef.current.duration || 0);
  };

  const handleProgressClick = (e) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;
    const newTime = Math.max(0, Math.min(1, clickRatio)) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (sec = 0) => {
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((sec / 60) % 60)
      .toString()
      .padStart(2, "0");
    const h = Math.floor(sec / 3600);
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  const youTube = isYouTubeUrl(videoData?.video_url);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleOpenShare = () => setIsShareOpen(true);
  const handleCloseShare = () => setIsShareOpen(false);

  // دالة الإعجاب
  const handleLike = async () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }

    try {
      const newLikedState = !videoItem?.has_liked;
      if (videoData?.report_type) {
        await PatchEventById(videoItem.id, {
          has_liked: newLikedState,
        });
      } else {
        await PatchVideoById(videoItem.id, {
          has_liked: newLikedState,
        });
      }

      setVideoItem({
        ...videoItem,
        has_liked: newLikedState,
        likes_count: newLikedState
          ? videoItem?.likes_count + 1
          : videoItem?.likes_count - 1,
      });
    } catch {
      toast.error(t("Failed to update like status"));
    }
  };

  // Placeholder for rating handler removed due to unused lint warning

  const handleAddToMyList = async () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }

    try {
      const currentlySaved = Boolean(videoItem?.has_in_my_list);
      if (currentlySaved) {
        // currently saved -> remove
        const res = await RemoveFromMyList(videoItem.id);
        const serverHas =
          res && res.data && typeof res.data.has_in_my_list !== "undefined"
            ? res.data.has_in_my_list
            : false;
        setVideoItem((prev) => ({
          ...prev,
          has_in_my_list: Boolean(serverHas),
        }));
      } else {
        // not saved -> add
        const res = await AddToMyList(videoItem.id);
        // server returns serialized video; prefer server value if present
        const serverHas =
          res && res.data && typeof res.data.has_in_my_list !== "undefined"
            ? res.data.has_in_my_list
            : true;
        setVideoItem((prev) => ({
          ...prev,
          has_in_my_list: Boolean(serverHas),
        }));
      }
    } catch (err) {
      setErrorFn(err, t);
    }
  };
  // console.log removed to satisfy lint rules

  return (
    <div
      className={`min-h-screen bg-gray-50 ${
        i18n.language === "ar" ? "rtl" : "ltr"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            {/* Video Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="relative group">
                <div
                  className="relative bg-black"
                  onMouseEnter={() => setShowControls(true)}
                  onMouseLeave={() => setShowControls(true)}
                >
                  {/* Video Player */}
                  <div className="w-full relative aspect-video">
                    {videoData?.video_url ? (
                      youTube ? (
                        <iframe
                          className="w-full h-full rounded-t-xl"
                          src={getYouTubeEmbedUrl(videoData?.video_url)}
                          title={videoData?.title || "YouTube video"}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover cursor-pointer rounded-t-xl"
                          poster={videoData?.thumbnail}
                          controls={false}
                          onTimeUpdate={handleTimeUpdate}
                          onLoadedMetadata={handleTimeUpdate}
                          onClick={handlePlayPause}
                        >
                          <source src={videoData?.video_url} type="video/mp4" />
                          {t("Your browser does not support.")}
                        </video>
                      )
                    ) : (
                      <div className="w-full h-full relative rounded-t-xl">
                        <img
                          src={videoData?.thumbnail}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white bg-black/50 p-4 sm:p-6 rounded-lg">
                            <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">
                              ▶
                            </div>
                            <p className="text-xs sm:text-sm opacity-80">
                              {t("Video Link")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Video Controls */}
                  {!youTube && showControls && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-6 sm:pt-8">
                        {/* Progress Bar */}
                        <div className="mb-3 sm:mb-4">
                          <div
                            className="w-full bg-white/30 rounded-full h-1 cursor-pointer"
                            onClick={handleProgressClick}
                          >
                            <div
                              className="bg-red-600 h-1 rounded-full transition-all duration-100"
                              style={{
                                width: duration
                                  ? `${(currentTime / duration) * 100}%`
                                  : "0%",
                              }}
                            />
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center gap-2 sm:gap-4">
                            <button
                              onClick={handlePlayPause}
                              className="hover:text-gray-300 text-sm sm:text-base"
                            >
                              {isPlaying ? t("pause") : t("play")}
                            </button>
                            <span className="text-xs sm:text-sm">
                              {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6">
                {/* Title & YouTube Button Row */}
                <div
                  className={`flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-6 ${
                    i18n.language === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* العنوان */}
                  {videoData?.title && (
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-0">
                      {videoData?.title}
                    </h1>
                  )}
                  {/* زر يوتيوب */}
                  {videoData?.video_url && (
                    <button
                      onClick={() =>
                        window.open(videoData?.video_url, "_blank")
                      }
                      className="flex items-center gap-2 text-white bg-[#DC2626] rounded-full px-3 sm:px-4 py-1.5 sm:py-2 hover:text-[#Dc2626] transition-all duration-200 hover:bg-white border-[1px] border-[#Dc2626] text-sm sm:text-base whitespace-nowrap"
                    >
                      <span className="font-medium">
                        {t("Watch on YouTube")}
                      </span>
                      <img
                        src="/icons/youtube-icon.png"
                        alt="YouTube"
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                    </button>
                  )}
                </div>
                {/* مدة الفيديو */}
                {videoData?.duration && (
                  <span className="px-2 sm:px-3 py-1 bg-transparent border-[1px] border-gray-300 text-xs sm:text-sm rounded-full mb-4 inline-block">
                    {videoData?.duration}
                  </span>
                )}

                {/* Views and Date */}
                {videoData?.views && (
                  <div
                    className={`flex flex-wrap items-center justify-between gap-2 sm:gap-3 mb-6 ${
                      i18n.language === "ar" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                      <span>
                        {t("Views")}: {videoData?.views}
                      </span>

                      {videoData?.created_at ? (
                        <span>
                          {t("Published")}:{" "}
                          {videoData?.created_at?.split(" ")[0]}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-gray-700">
                      <button
                        onClick={handleLike}
                        className={`outline-0 flex items-center gap-1 sm:gap-2 transition-colors ${
                          videoItem?.has_liked
                            ? "text-blue-600"
                            : "hover:text-black"
                        }`}
                        aria-pressed={videoItem?.has_liked}
                      >
                        {videoItem?.has_liked ? (
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M2 21h4V9H2v12zM23 10.5c0-.83-.67-1.5-1.5-1.5h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 2 7.59 8.59C7.22 8.95 7 9.45 7 10v9c0 1.1.9 2 2 2h7c.78 0 1.45-.45 1.79-1.11L23 10.5z" />
                          </svg>
                        ) : (
                          <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                        <span className="text-sm sm:text-base md:text-lg font-semibold">
                          {videoItem?.likes_count || "0"}
                        </span>
                      </button>

                      <button
                        onClick={handleOpenShare}
                        className="flex items-center gap-1 sm:gap-2 hover:text-black transition-colors"
                      >
                        <img
                          src="/icons/share_icon.png"
                          alt="share"
                          className="w-6 h-6 sm:w-7 sm:h-7"
                        />
                        <span className="text-sm sm:text-base md:text-lg font-semibold">
                          {t("Share")}
                        </span>
                      </button>

                      <button
                        onClick={handleAddToMyList}
                        className="flex items-center gap-1 sm:gap-2 hover:text-black transition-colors"
                      >
                        <ListPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base md:text-lg font-semibold">
                          {videoItem?.has_in_my_list
                            ? t("Remove from My List")
                            : t("Save")}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <CommentsSection itemId={videoItem?.id} type={"video"} />
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            {/* Video Info Card */}
            <ContentInfoCard
              contentData={videoItem}
              contentType="video"
              isRTL={i18n.language === "ar"}
            />

            {/* Similar Content - match layout used in other place */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <DynamicSection
                title={t("Similar Content")}
                titleClassName="text-[21px] sm:text-2xl md:text-3xl font-medium"
                data={
                  showAllRelated ? relatedVideos : relatedVideos.slice(0, 3)
                }
                isSlider={false}
                cardName={VideoCard}
                gridClassName="flex flex-col gap-4"
                viewMoreUrl="/videos"
              />
              {relatedVideos?.length > 3 && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllRelated((v) => !v)}
                    aria-label={
                      showAllRelated ? t("View Less") : t("View More")
                    }
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  >
                    {showAllRelated ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={handleCloseShare}
        url={videoData?.video_url || window.location.href}
        title={videoData?.title}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}

export default CustomyoutubeVideo;
