import React, { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { ThumbsUp, ListPlus } from "lucide-react";
import { toast } from "react-toastify";

import ShareModal from "@/components/Global/ShareModal/ShareModal";
import ShowHideText from "@/components/Global/ShowHideText/ShowHideText";
import { AddToMyList, RemoveFromMyList, PatchVideoById } from "@/api/videos";
import { PatchEventById } from "@/api/events";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

function CustomyoutubeVideo({ videoData }) {
  const { t } = useTranslation();
  const [videoItem, setVideoItem] = useState(videoData);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    setVideoItem(videoData);
  }, [videoData]);

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
      toast.success(newLikedState ? t("Like Added") : t("Like Removed"));
    } catch {
      toast.error(t("Failed to update like status"));
    }
  };

  const handleAddToMyList = async () => {
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
        toast.success(t("Removed from your list"));
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
        toast.success(t("Added to your list"));
      }
    } catch (err) {
      setErrorFn(err, t);
    }
  };
  return (
    <div className="bg-gray-100 px-4 sm:px-0  ">
      <div className="  ">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div
            className="relative bg-black"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(true)}
          >
            {/* Start video player */}
            <div className="w-full relative aspect-video">
              {videoData?.video_url ? (
                youTube ? (
                  <iframe
                    className="w-full h-full"
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
                    className="w-full h-full object-cover cursor-pointer"
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
                <div className="w-full h-full relative">
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

            {/* End video player */}

            {/* Blur background*/}
            <div className="pointer-events-none absolute -bottom-6 sm:-bottom-8 left-0 right-0 h-6 sm:h-8 bg-gradient-to-b from-black/60 via-black/25 to-transparent" />

            {!youTube && showControls && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-6 sm:pt-8">
                  {/* Start progressbar */}
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
                  {/* End progressbar */}

                  {/* Start Controls */}
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
                  {/* End Controls */}
                </div>
              </div>
            )}
          </div>

          {/* Start Video Info */}
          <div className="relative py-4 sm:py-5 md:py-6 px-4 sm:px-6 md:px-8 lg:px-10 z-50">
            {/* Blur Background*/}
            <div className="pointer-events-none absolute -top-3 sm:-top-4 left-0 right-0 h-3 sm:h-4 bg-gradient-to-b from-black/40 via-black/15 to-transparent" />

            {/* Start Tags && Watch on YouTube Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              {/* Start Tags */}
              {Array.isArray(videoData?.tags) && videoData?.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {videoData?.tags.map((t, i) => (
                    <span
                      key={`${t}-${i}`}
                      className={`px-2 sm:px-3 py-1 bg-transparent ${
                        i === 0 ? "border-[1px] border-text" : ""
                      } text-xs sm:text-sm rounded-full`}
                    >
                      {t}
                    </span>
                  ))}
                  {videoData?.durationText && (
                    <span className="px-2 sm:px-3 py-1 bg-transparent text-xs sm:text-sm rounded-full">
                      {videoData?.durationText}
                    </span>
                  )}
                </div>
              )}
              {/* End Tags */}
              {/* Start Watch on YouTube Button */}
              <button
                onClick={() => window.open(videoData?.video_url, "_blank")}
                className="flex items-center gap-2 text-white bg-[#DC2626] rounded-full px-3 sm:px-4 py-1.5 sm:py-2 hover:text-[#Dc2626] transition-all duration-200 hover:bg-white border-[1px] border-[#Dc2626] text-sm sm:text-base whitespace-nowrap"
              >
                <span className="font-medium">{t("Watch on YouTube")}</span>
                <img
                  src="/icons/youtube-icon.png"
                  alt="YouTube"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </button>

              {/* End Watch on YouTube Button */}
            </div>
            {/* End Tags && Watch on YouTube Button */}

            {/* Start Title */}
            {videoData?.title && (
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 my-4 sm:my-5 md:my-6 lg:my-7 leading-tight">
                {videoData?.title}
              </h2>
            )}
            {/* End Title */}

            {/* Start Views */}
            {(videoData?.views || videoData?.timeAgo) && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-600 text-sm sm:text-base">
                {videoData?.views && <span>{videoData?.views}</span>}
                {videoData?.views && videoData?.timeAgo && <span>•</span>}
                {videoData?.timeAgo && <span>{videoData?.timeAgo}</span>}
              </div>
            )}
            {/* End Views */}

            {/* Start Description */}
            {videoData?.description && (
              <div className="pt-4 sm:pt-6 md:pt-8 max-w-5xl">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  <ShowHideText
                    text={videoData?.description}
                    t={t}
                    count={210}
                  />
                </p>
              </div>
            )}
            {/* End Description */}

            {/* Start social Actions */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-gray-700 my-4 sm:my-6 md:my-8">
              <button
                onClick={handleLike}
                className={`outline-0 flex items-center gap-1 sm:gap-2 transition-colors ${
                  videoItem?.has_liked ? "text-blue-600" : "hover:text-black"
                }`}
                aria-pressed={videoItem?.has_liked}
              >
                {videoItem?.has_liked ? (
                  // filled thumbs up (simple svg)
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
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
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
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                />
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
                  {t("Share")}
                </span>
              </button>

              <button
                onClick={() => {
                  handleAddToMyList();
                }}
                className="flex items-center gap-1 sm:gap-2 hover:text-black transition-colors"
              >
                <ListPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
                  {videoItem?.has_in_my_list
                    ? t("Remove from My List")
                    : t("Save")}
                </span>
              </button>
            </div>
            {/* End social Actions */}
            {/* Render Share Modal */}
            <ShareModal
              isOpen={isShareOpen}
              onClose={handleCloseShare}
              url={videoData?.video_url}
              title={videoData?.title}
            />
            {/* Start channel info */}
            {/* <div className="mt-4 sm:mt-6 flex justify-between sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                <img
                  src={videoData?.channelAvatar}
                  alt={videoData?.channelName}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover"
                />
                <div>
              
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl text-gray-900">
                      {videoData?.channelName}
                    </span>
                    {videoData?.channelVerified && (
                      <img
                        src="/icons/verifyAcoount.png"
                        alt="Verified"
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                    )}
                  </div>
               
                  <div className="mt-1 text-gray-500 text-xs sm:text-sm md:text-base">
                    {videoData?.channelSubscribers}
                  </div>
                
                </div>
              </div>
            
              <button className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-primary text-gray-900 hover:bg-primary hover:text-white transition-all duration-200 text-sm sm:text-base whitespace-nowrap">
                {t("Followers")}
              </button>
            
            </div> */}
          </div>
          {/* End Video Info */}
        </div>
      </div>
    </div>
  );
}

export default CustomyoutubeVideo;
