import React, { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import VideoCard from "@/components/Global/VideoCard/VideoCard";
import { GetTopViewedVideos } from "@/api/videos";
import BrokenCarousel from "@/components/Global/BrokenCarousel/BrokenCarousel";
import { languages } from "@/constants/constants";

import UpLeftIcon from "../../../../../assets/icons/up left.svg";

function CustomyoutubeVideo({ t, i18n, videoData }) {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [showMoreVideos, setShowMoreVideos] = useState(false);
  const textRef = useRef(null);
  const limit = 5;
  // Fetch related videos
  const fetchRelated = async (currentOffset = 0) => {
    try {
      setIsLoading(true);
      const res = await GetTopViewedVideos(videoData?.id, i18n.language);
      console.log("Related videos response:", res);
      const data = res?.data || {};
      const lang = i18n.language;
      const results = (data.results || []).map((item) => ({
        ...item[lang],
        id: item.id,
      }));
      const count = data.count || 0;

      // If it's the first load, replace   videos; otherwise append
      if (currentOffset === 0) {
        setRelatedVideos(results);
      } else {
        setRelatedVideos((prev) => [...prev, ...results]);
      }

      setOffset(currentOffset + limit);

      // Check if there are more videos to load
      const loadedCount = currentOffset + results.length;
      setHasMore(loadedCount < count);
    } catch (e) {
      console.error("Failed to fetch related videos:", e);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (videoData?.id) {
      fetchRelated(0);
    }
  }, [videoData?.id]);

  useEffect(() => {
    if (textRef.current) {
      const el = textRef.current;
      setHasMore(el.scrollHeight > el.clientHeight);
    }
  }, [videoData?.description]);

  const isYouTubeUrl = (url) =>
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))/i.test(
      url || "",
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
  };

  const youTube = isYouTubeUrl(videoData?.video_url);
  const htmlDescription = videoData?.description || "";
  const plainText = htmlDescription.replace(/<[^>]+>/g, "");
  const MAX_LENGTH = 120;
  const isLong = plainText.length > MAX_LENGTH;

  return (
    <div className=" max-w-[1200px] mx-auto ">
      {/* Back Button */}
      <div className="pt-3">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-[#285688] p-1 px-3 mt-3 text-sm"
        >
          <img src={UpLeftIcon} alt="Back" className="w-4 h-4" />
          {t("Back")}
        </button>
      </div>

      {/* Video Player Section */}
      <div className="mt-4">
        <div className="relative bg-black md:rounded-xl overflow-hidden h-[220px] lg:h-[675px]">
          {videoData?.video_url ? (
            youTube ? (
              <>
                <iframe
                  className="w-full h-full"
                  src={getYouTubeEmbedUrl(videoData?.video_url)}
                  title={videoData?.title || "YouTube video"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                {/* More Videos Button */}
                {relatedVideos.length > 0 && (
                  <button
                    onClick={() => setShowMoreVideos(true)}
                    className="absolute bottom-3 right-3 bg-black/70 hover:bg-black/90 text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                    </svg>
                    {t("More Videos")}
                  </button>
                )}
                {/* More Videos Overlay Panel */}
                {showMoreVideos && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-bold text-sm lg:text-xl">
                        {t("Other Guided Reading Videos")}
                      </h3>
                      <button
                        onClick={() => setShowMoreVideos(false)}
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 flex-1">
                      {relatedVideos.map((video, index) => (
                        <div
                          key={video.id || index}
                          onClick={() => navigate(`/videos/${video?.id}`)}
                          className="cursor-pointer group flex flex-col gap-1.5"
                        >
                          <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-800">
                            <img
                              src={video?.thumbnail_url?.medium?.url}
                              alt={video?.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-black ml-0.5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <p className="text-white text-xs font-medium line-clamp-2 leading-tight">
                            {video?.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
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
            <div className="w-full h-full relative flex items-center justify-center">
              <img
                src={videoData?.thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white bg-black/50 p-6 rounded-lg">
                  <div className="text-4xl mb-3">▶</div>
                  <p className="text-sm opacity-80">{t("Video Link")}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Title and Content Section */}
      <div className="mt-4 px-4">
        {/* Video Title */}
        <h1 className="text-xl font-bold lg:text-[32px] text-[#081945] leading-[1.5] mb-4 line-clamp-2">
          {videoData?.title}
        </h1>

        {/* Content Layout - Description + Info Sidebar */}
        <div className="lg:flex gap-3 mb-14">
          {/* Description Section */}
          <div className="flex-1 bg-[#C4DBF5] rounded-[10px]  p-4 ">
            {/* Start Created At */}
            <div className="mb-4">
              <p className="text-base font-bold text-[#081945] mb-0">
                {videoData?.created_at
                  ? (() => {
                      const parts = new Date(videoData.created_at)
                        .toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                        .split(" ");

                      return `${parts[0]}. ${parts[1]} ${parts[2]}`;
                    })()
                  : "Nov. 26, 2025"}
              </p>
            </div>
            {/* End Created At */}
            {/* Start Descripotion */}
            <div className="text-[20px] text-[#081945] leading-[1.5]">
              <div
                className={`prose max-w-none ${!expanded && isLong ? "line-clamp-3" : ""}`}
                dangerouslySetInnerHTML={{ __html: htmlDescription }}
              />
              {isLong && (
                <span
                  onClick={() => setExpanded((prev) => !prev)}
                  className="text-blue-600 cursor-pointer ml-1"
                >
                  {expanded ? "less" : "more..."}
                </span>
              )}
            </div>
            {/* End Descripotion */}
          </div>

          {/* Info Sidebar */}
          <div className="w-[396px] bg-[#C4DBF5] rounded-[10px] p-4">
            <div className="flex flex-col gap-8 text-base">
              {/* Category */}
              <div className="flex gap-1 items-center">
                <p className="font-bold text-[#081945] w-[135px]">
                  {t("Category")}
                </p>
                <p className="flex-1 font-normal text-[#081945]">
                  {videoData?.category?.name || "Guided Reading"}
                </p>
              </div>

              {/* Language */}
              <div className="flex gap-1 items-center">
                <p className="font-bold text-[#081945] w-[135px]">
                  {t("Language")}
                </p>
                <p className="flex-1 font-normal text-[#081945]">
                  {/* {videoData?.language || "English"} */}
                  {languages.find((l) => l.code === videoData?.language)?.label}
                </p>
              </div>

              {/* Guest Speakers */}
              <div className="flex gap-1 items-start">
                <div className="font-bold text-[#081945] w-[135px]">
                  <p className="mb-0">{t("Guest")}</p>
                  <p>{t("Speaker(s)")}</p>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  {videoData?.guest_speakers &&
                  videoData.guest_speakers.length > 0 ? (
                    videoData.guest_speakers.map((speaker, index) => (
                      <p key={index} className="font-normal text-[#081945]">
                        {speaker}
                      </p>
                    ))
                  ) : (
                    <p className="font-normal text-[#081945]">
                      {t("No guest speakers")}
                    </p>
                  )}
                </div>
              </div>

              {/* Supplemental Materials */}
              <div className="flex gap-1 items-start">
                <div className="font-bold text-[#081945] w-[135px]">
                  <p className="mb-0">{t("Supplemental")}</p>
                  <p>{t("Materials")}</p>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  {videoData?.attachments_data &&
                  videoData.attachments_data.length > 0
                    ? videoData.attachments_data.map((material, index) => (
                        <a
                          key={index}
                          href={material.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-normal cursor-pointer text-[#081945] underline hover:text-gray-700"
                        >
                          {material.file_name ||
                            `${t("Attachment")} ${index + 1}`}
                        </a>
                      ))
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Videos Section */}
      <div className="hidden lg:block pb-12">
        <BrokenCarousel
          data={relatedVideos}
          title={t("Other Guided Reading Videos")}
          showArrows={true}
          showCount={false}
          cardName={VideoCard}
          cardProps={{ navigate, size: "small", showDate: true, rounded: true }}
          t={t}
        />
      </div>

      {/* Start Show Items In Small Screen */}
      <div className="lg:hidden pb-12">
        <h2 className="text-base lg:text-3xl font-bold text-[#081945] mb-6 px-4">
          {t("Other Guided Reading Videos")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 mb-6">
          {relatedVideos.map((video, index) => (
            <VideoCard
              key={video.id || index}
              item={video}
              navigate={() => navigate(`/videos/${video?.id}`)}
              size="small"
              showDate={true}
              rounded={true}
              t={t}
            />
          ))}
        </div>

        {hasMore && (
          <div className="px-4 mt-6">
            <button
              onClick={() => fetchRelated(offset)}
              disabled={isLoading}
              className="w-full bg-white rounded-lg text-center py-3 text-[#285688] font-semibold border border-[#285688] hover:bg-[#f0f0f0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? t("Loading...") : t("load more...")}
            </button>
          </div>
        )}
      </div>
      {/* End Show Items In Small Screen */}
    </div>
  );
}

export default CustomyoutubeVideo;
