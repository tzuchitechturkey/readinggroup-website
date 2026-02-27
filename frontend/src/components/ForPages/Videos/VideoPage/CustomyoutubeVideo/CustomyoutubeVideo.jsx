import React, { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import VideoCard from "@/components/Global/VideoCard/VideoCard";
import { GetTopViewedVideos } from "@/api/videos";
import BrokenCarousel from "@/components/Global/BrokenCarousel/BrokenCarousel";

import UpLeftIcon from "../../../../../assets/icons/up left.svg";

function CustomyoutubeVideo({ t, i18n, videoData }) {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const textRef = useRef(null);
  console.log("videoData:", videoData);
  const LIMIT = 4;

  // Fetch related videos
  const fetchRelated = async (currentOffset = 0) => {
    try {
      setIsLoading(true);
      const res = await GetTopViewedVideos(LIMIT, currentOffset);
      const data = res?.data || {};
      const results = data.results || [];
      const count = data.count || 0;

      // If it's the first load, replace videos; otherwise append
      if (currentOffset === 0) {
        setRelatedVideos(results);
      } else {
        setRelatedVideos((prev) => [...prev, ...results]);
      }

      setTotalCount(count);
      setOffset(currentOffset + LIMIT);

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
    fetchRelated(0);
  }, []);
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
    // setCurrentTime(videoRef.current.currentTime || 0);
    // setDuration(videoRef.current.duration || 0);
  };

  const youTube = isYouTubeUrl(videoData?.video_url);

  return (
    <div
      className=" max-w-[1200px] mx-auto "
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
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
          <div className="flex-1 bg-[#C4DBF5] rounded-[10px] p-4 mb-2">
            <div className="mb-4">
              <p className="text-base font-bold text-[#081945] mb-0">
                {videoData?.created_at
                  ? new Date(videoData.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "November 26, 2025"}
              </p>
            </div>
            <div className="flex items-end ">
              <p
                ref={textRef}
                className={`text-[20px] font-normal text-[#081945] leading-[1.5] ${
                  expanded ? "" : "line-clamp-2"
                }`}
                dangerouslySetInnerHTML={{ __html: videoData?.description }}
              />

              {hasMore && (
                <button
                  onClick={() => setExpanded((prev) => !prev)}
                  className={`text-blue-600 mt-2 block`}
                >
                  {expanded ? "less" : "more..."}
                </button>
              )}
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="w-[396px] bg-[#C4DBF5] rounded-[10px] p-4">
            <div className="flex flex-col gap-8 text-base">
              {/* Category */}
              <div className="flex gap-1 items-center">
                <p className="font-bold text-[#081945] w-[135px]">
                  {t("Category")}
                </p>
                <p className="flex-1 font-normal text-black">
                  {videoData?.category?.name || "Guided Reading"}
                </p>
              </div>

              {/* Language */}
              <div className="flex gap-1 items-center">
                <p className="font-bold text-[#081945] w-[135px]">
                  {t("Language")}
                </p>
                <p className="flex-1 font-normal text-black">
                  {videoData?.language || "English"}
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
                      <p key={index} className="font-normal text-black">
                        {speaker}
                      </p>
                    ))
                  ) : (
                    <p className="font-normal text-black">
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
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-normal text-black underline hover:text-gray-700"
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
          cardProps={{ navigate, size: "small", showDate: true }}
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
              navigate={navigate}
              size="small"
              showDate={true}
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
