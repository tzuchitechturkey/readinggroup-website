import React, { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { ThumbsUp, ListPlus, ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import ShareModal from "@/components/Global/ShareModal/ShareModal";
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
import BrokenCarousel from "@/components/Global/BrokenCarousel/BrokenCarousel";

function CustomyoutubeVideo({ videoData }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [videoItem, setVideoItem] = useState(videoData);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const videoRef = useRef(null);

  // دالة للتحقق من تسجيل الدخول
  const isLoggedIn = () => {
    return Boolean(localStorage.getItem("accessToken"));
  };

  useEffect(() => {
    setVideoItem(videoData);
  }, [videoData]);

  // Fetch related videos
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

  const handleAddToMyList = async () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }

    try {
      const currentlySaved = Boolean(videoItem?.has_in_my_list);
      if (currentlySaved) {
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
        const res = await AddToMyList(videoItem.id);
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

  return (
    <div
      className=" max-w-[1200px] mx-auto  bg-white min-h-screen"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Back Button */}
      <div className="pt-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-black border-[1px] border-black rounded-full p-1 px-3 hover:text-gray-600 text-sm"
        >
          <ChevronLeft size={16} />
          {t("Back")}
        </button>
      </div>

      {/* Video Player Section */}
      <div className="mt-4">
        <div className="relative bg-black rounded-xl overflow-hidden h-[675px]">
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

          {/* Custom Video Controls for non-YouTube videos */}
          {!youTube && showControls && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
              <div className="px-4 pb-4 pt-8">
                {/* Progress Bar */}
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

                {/* Controls */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePlayPause}
                      className="hover:text-gray-300"
                    >
                      {isPlaying ? t("pause") : t("play")}
                    </button>
                    <span className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Title and Content Section */}
      <div className="mt-4">
        {/* Video Title */}
        <h1 className="text-[32px] font-bold text-black leading-[1.5] mb-4">
          {videoData?.title}
        </h1>

        {/* Content Layout - Description + Info Sidebar */}
        <div className="flex gap-3 mb-14">
          {/* Description Section */}
          <div className="flex-1 bg-[#e4e4e4] rounded-[10px] p-4">
            <div className="mb-4">
              <p className="text-base font-bold text-black mb-0">
                {videoData?.created_at
                  ? new Date(videoData.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "November 26, 2025"}
              </p>
            </div>
            <div>
              <p
                className="text-[20px] font-normal text-black leading-[1.5]"
                dangerouslySetInnerHTML={{ __html: videoData?.description }}
              />
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="w-[396px] bg-[#e4e4e4] rounded-[10px] p-4">
            <div className="flex flex-col gap-8 text-base">
              {/* Category */}
              <div className="flex gap-1 items-center">
                <p className="font-bold text-black w-[135px]">
                  {t("Category")}
                </p>
                <p className="flex-1 font-normal text-black">
                  {videoData?.category?.name || "Guided Reading"}
                </p>
              </div>

              {/* Language */}
              <div className="flex gap-1 items-center">
                <p className="font-bold text-black w-[135px]">
                  {t("Language")}
                </p>
                <p className="flex-1 font-normal text-black">
                  {videoData?.language || "English"}
                </p>
              </div>

              {/* Guest Speakers */}
              <div className="flex gap-1 items-start">
                <div className="font-bold text-black w-[135px]">
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
                <div className="font-bold text-black w-[135px]">
                  <p className="mb-0">{t("Supplemental")}</p>
                  <p>{t("Materials")}</p>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  {videoData?.materials && videoData.materials.length > 0
                    ? videoData.materials.map((material, index) => (
                        <a
                          key={index}
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-normal text-black underline hover:text-gray-700"
                        >
                          {material.name}
                        </a>
                      ))
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Videos Section */}
        <div className="pb-12">
          <BrokenCarousel
            data={relatedVideos}
            title={t("Other Guided Reading Videos")}
            showArrows={true}
            showCount={false}
            cardName={VideoCard}
            cardProps={{ navigate, size: "small", showDate: true }}
            // nextArrowClassname={nextArrowClassname}
            // prevArrowClassname={prevArrowClassname}
          />
          {/* <h2 className="text-[24px] font-bold text-black leading-[1.5] mb-[10px]">
            {t("Other Guided Reading Videos")}
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {relatedVideos.slice(0, 4).map((video, index) => (
              <div key={video.id || index} className="flex flex-col gap-1">
                <VideoCard
                  video={video}
                  showDate={true}
                  size="small"
                  navigate={navigate}
                />
              </div>
            ))}
          </div>
        </div> */}
        </div>
      </div>

      {/* Action Buttons - Like, Share, Save */}
      {/* <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
        <button
          onClick={handleLike}
          className={`p-3 rounded-full shadow-lg transition-colors ${
            videoItem?.has_liked
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <ThumbsUp size={20} />
        </button>

        <button
          onClick={() => setIsShareOpen(true)}
          className="p-3 bg-white text-gray-700 hover:bg-gray-50 rounded-full shadow-lg"
        >
          <img src="/icons/share_icon.png" alt="share" className="w-5 h-5" />
        </button>

        <button
          onClick={handleAddToMyList}
          className="p-3 bg-white text-gray-700 hover:bg-gray-50 rounded-full shadow-lg"
        >
          <ListPlus size={20} />
        </button>
      </div> */}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
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
