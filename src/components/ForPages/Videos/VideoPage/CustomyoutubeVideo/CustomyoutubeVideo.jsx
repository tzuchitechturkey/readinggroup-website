import React from "react";

import { useTranslation } from "react-i18next";
import { ThumbsUp, ListPlus } from "lucide-react";

import ShowHideText from "@/components/Global/ShowHideText/ShowHideText";

function CustomyoutubeVideo({ videoData }) {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = React.useState(false);
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
    channelAvatar: "../../../src/assets/Beared Guy02-min 1.png",
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
  return (
    <div className="bg-gray-100">
      <div className="">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden  mx-auto">
          <div
            className="relative bg-black"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(true)}
          >
            {/* Start video player */}
            <div className="w-full  relative">
              {video.videoUrl ? (
                youTube ? (
                  <iframe
                    className="w-full h-[620px]"
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
                    className="w-full h-[700px] object-cover cursor-pointer"
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
                    <div className="text-center text-white bg-black/50 p-6 rounded-lg">
                      <div className="text-4xl mb-3">▶</div>
                      <p className="text-sm opacity-80">Video Link</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* End video player */}

            {/* Blur backgound*/}
            <div className="pointer-events-none absolute -bottom-8 left-0 right-0 h-8 bg-gradient-to-b from-black/60 via-black/25 to-transparent" />

            {!youTube && showControls && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
                <div className="px-4 pb-4 pt-8">
                  {/* Start progressbar */}
                  <div className="mb-4">
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
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handlePlayPause}
                        className="hover:text-gray-300"
                      >
                        {isPlaying ? t("peuse") : t("play")}
                      </button>
                      <span className="text-xs">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                  {/* End Controls */}
                </div>
              </div>
            )}
          </div>

          {/* Start Viedo Info */}
          <div className="relative py-5 px-6 md:px-10 z-50 ">
            {/* Blur Background*/}
            <div className="pointer-events-none absolute -top-4 left-0 right-0 h-4 bg-gradient-to-b from-black/40 via-black/15 to-transparent" />

            {/* Start Tags && Watch on YouTube Button */}
            <div className="flex items-center justify-between">
              {/* Start Tags */}
              {Array.isArray(video.tags) && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2  ">
                  {video.tags.map((t, i) => (
                    <span
                      key={`${t}-${i}`}
                      className={`px-3 py-1 bg-transparent  ${
                        i === 0 ? "border-[1px] border-text" : ""
                      } text-sm rounded-full`}
                    >
                      {t}
                    </span>
                  ))}
                  {video.durationText && (
                    <span
                      className={`px-3 py-1 bg-transparent   text-sm rounded-full`}
                    >
                      {video.durationText}
                    </span>
                  )}
                </div>
              )}
              {/* End Tags */}
              {/* Start Watch on YouTube Button */}
              <button className=" flex items-center gap-2 text-white bg-[#DC2626] rounded-full px-4 py-2 hover:text-[#Dc2626] transition-all duration-200 hover:bg-white border-[1px] border-[#Dc2626] ">
                <span className=" font-medium">{t("Watch on YouTube")}</span>
                <img
                  src="../../../src/assets/icons/youtube-icon.png"
                  alt="YouTube"
                  className="w-5 h-5"
                />
              </button>
              {/* End Watch on YouTube Button */}
            </div>
            {/* End Tags && Watch on YouTube Button */}

            {/* Start Title */}
            {video.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 my-7">
                {video.title}
              </h2>
            )}
            {/* End Title */}

            {/* Start Views */}
            {(video.views || video.timeAgo) && (
              <div className="flex items-center gap-3 text-gray-600">
                {video.views && <span>{video.views}</span>}
                {video.views && video.timeAgo && <span>•</span>}
                {video.timeAgo && <span>{video.timeAgo}</span>}
              </div>
            )}
            {/* End Views */}

            {/* Start Description */}
            {video.description && (
              <div className="  pt-8 max-w-5xl">
                <p className="text-gray-700 leading-relaxed">
                  <ShowHideText text={video.description} t={t} count={210} />
                </p>
              </div>
            )}
            {/* End Description */}

            {/* Start social Actions */}
            <div className="flex items-center gap-6 text-gray-700 my-8">
              <button className="flex items-center gap-2 hover:text-black">
                <ThumbsUp />
                <span className="text-xl font-semibold">21K</span>
              </button>

              <button className="flex items-center gap-2 hover:text-black">
                <img
                  src="../../../src/assets/icons/share_icon.png"
                  alt="share"
                  className="size-8"
                />
                <span className="text-xl font-semibold">{t("Share")}</span>
              </button>

              <button className="flex items-center gap-2 hover:text-black">
                <ListPlus />
                <span className="text-xl font-semibold">{t("Save")}</span>
              </button>

              <button className="flex items-center gap-2 hover:text-black">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>
            </div>
            {/* End social Actions */}
            {/* Start channel info */}
            <div className="mt-6 flex items-center gap-10">
              {/* Start Image && Name && Subscribers */}
              <div className="flex items-center gap-5">
                <img
                  src={video.channelAvatar}
                  alt={video.channelName}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  {/* Start  Name&&  Verify Icon */}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-2xl text-gray-900">
                      {video.channelName}
                    </span>
                    {video.channelVerified && (
                      <img
                        src="../../../src/assets/icons/verifyAcoount.png"
                        alt="Verified"
                        className="w-5 h-5"
                      />
                    )}
                  </div>
                  {/* Start Name && Verify Icon */}
                  {/* Start Subscribers */}
                  <div className="mt-1 text-gray-500">
                    {video.channelSubscribers}
                  </div>
                  {/* End Subscribers */}
                </div>
              </div>
              {/* End Image && Name && Subscribers */}
              {/* Start Followers Buttons */}
              <button className="px-4 py-1.5 rounded-full border border-primary text-gray-900 hover:bg-primary hover:text-white transition-all duration-200">
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
