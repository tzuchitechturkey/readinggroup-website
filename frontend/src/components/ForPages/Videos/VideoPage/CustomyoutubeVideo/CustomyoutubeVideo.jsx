import React from "react";

import { useTranslation } from "react-i18next";
import { ThumbsUp, ListPlus } from "lucide-react";

import ShareModal from "@/components/Global/ShareModal/ShareModal";
import ShowHideText from "@/components/Global/ShowHideText/ShowHideText";

function CustomyoutubeVideo({ videoData }) {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [showControls, setShowControls] = React.useState(true);
  const videoRef = React.useRef(null);

  const defaultVideoData = {
    title: "Tzu Chi Visits Syrian Lands",
    videoUrl: "https://www.youtube.com/watch?v=CXD816uXjzw",
    thumbnail: "/api/placeholder/800/450",
    views: "132,757 views",
    timeAgo: "22 hours ago",
    durationText: "1h 28m",
    tags: ["Journey", "Documentary", "Humanitarian"],
    description:
      "In this heartfelt documentary, Tzu Chi Foundation visits Syrian lands to provide humanitarian aid and relief to communities affected by conflict. Through touching encounters with families and volunteers, the film highlights real stories of hope, resilience, and compassion that shine through resilience, and compassion that shine through ",
    channelName: "Musa AL AHMED",
    channelAvatar: "/Beared Guy02-min 1.png",
    channelVerified: true,
    channelSubscribers: "14.1M Subscriber",
  };

  const video = videoData || defaultVideoData;

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

  const youTube = isYouTubeUrl(video.videoUrl);
  const [isShareOpen, setIsShareOpen] = React.useState(false);

  const handleOpenShare = () => setIsShareOpen(true);
  const handleCloseShare = () => setIsShareOpen(false);
  const toggleLike = () => setLiked((s) => !s);
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
              {video.videoUrl ? (
                youTube ? (
                  <iframe
                    className="w-full h-full"
                    src={getYouTubeEmbedUrl(video.videoUrl)}
                    title={video.title || "YouTube video"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover cursor-pointer"
                    poster={video.thumbnail}
                    controls={false}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleTimeUpdate}
                    onClick={handlePlayPause}
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                    {t("Your browser does not support.")}
                  </video>
                )
              ) : (
                <div className="w-full h-full relative">
                  <img
                    src={video.thumbnail}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white bg-black/50 p-4 sm:p-6 rounded-lg">
                      <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">
                        ▶
                      </div>
                      <p className="text-xs sm:text-sm opacity-80">
                        Video Link
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
              {Array.isArray(video.tags) && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((t, i) => (
                    <span
                      key={`${t}-${i}`}
                      className={`px-2 sm:px-3 py-1 bg-transparent ${
                        i === 0 ? "border-[1px] border-text" : ""
                      } text-xs sm:text-sm rounded-full`}
                    >
                      {t}
                    </span>
                  ))}
                  {video.durationText && (
                    <span className="px-2 sm:px-3 py-1 bg-transparent text-xs sm:text-sm rounded-full">
                      {video.durationText}
                    </span>
                  )}
                </div>
              )}
              {/* End Tags */}
              {/* Start Watch on YouTube Button */}
              <button className="flex items-center gap-2 text-white bg-[#DC2626] rounded-full px-3 sm:px-4 py-1.5 sm:py-2 hover:text-[#Dc2626] transition-all duration-200 hover:bg-white border-[1px] border-[#Dc2626] text-sm sm:text-base whitespace-nowrap">
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
            {video.title && (
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 my-4 sm:my-5 md:my-6 lg:my-7 leading-tight">
                {video.title}
              </h2>
            )}
            {/* End Title */}

            {/* Start Views */}
            {(video.views || video.timeAgo) && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-600 text-sm sm:text-base">
                {video.views && <span>{video.views}</span>}
                {video.views && video.timeAgo && <span>•</span>}
                {video.timeAgo && <span>{video.timeAgo}</span>}
              </div>
            )}
            {/* End Views */}

            {/* Start Description */}
            {video.description && (
              <div className="pt-4 sm:pt-6 md:pt-8 max-w-5xl">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  <ShowHideText text={video.description} t={t} count={210} />
                </p>
              </div>
            )}
            {/* End Description */}

            {/* Start social Actions */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-gray-700 my-4 sm:my-6 md:my-8">
              <button
                onClick={toggleLike}
                className={`flex items-center gap-1 sm:gap-2 transition-colors ${
                  liked ? "text-blue-600" : "hover:text-black"
                }`}
                aria-pressed={liked}
              >
                {liked ? (
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
                  21K
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

              <button className="flex items-center gap-1 sm:gap-2 hover:text-black transition-colors">
                <ListPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
                  {t("Save")}
                </span>
              </button>
            </div>
            {/* End social Actions */}
            {/* Render Share Modal */}
            <ShareModal
              isOpen={isShareOpen}
              onClose={handleCloseShare}
              url={video.videoUrl}
              title={video.title}
            />
            {/* Start channel info */}
            <div className="mt-4 sm:mt-6 flex justify-between sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              {/* Start Image && Name && Subscribers */}
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                <img
                  src={video.channelAvatar}
                  alt={video.channelName}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover"
                />
                <div>
                  {/* Start Name && Verify Icon */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl text-gray-900">
                      {video.channelName}
                    </span>
                    {video.channelVerified && (
                      <img
                        src="/icons/verifyAcoount.png"
                        alt="Verified"
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                    )}
                  </div>
                  {/* End Name && Verify Icon */}
                  {/* Start Subscribers */}
                  <div className="mt-1 text-gray-500 text-xs sm:text-sm md:text-base">
                    {video.channelSubscribers}
                  </div>
                  {/* End Subscribers */}
                </div>
              </div>
              {/* End Image && Name && Subscribers */}
              {/* Start Followers Buttons */}
              <button className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-primary text-gray-900 hover:bg-primary hover:text-white transition-all duration-200 text-sm sm:text-base whitespace-nowrap">
                {t("Followers")}
              </button>
              {/* End Followers Buttons */}
            </div>
            {/* End channel info */}
          </div>
          {/* End Video Info */}
        </div>
      </div>
    </div>
  );
}

export default CustomyoutubeVideo;
