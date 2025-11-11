import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { createPortal } from "react-dom";

import ShareModal from "@/components/Global/ShareModal/ShareModal";
import ImageControls from "@/components/Global/ImageControls/ImageControls";
import ImageModal from "@/components/Global/ImageModal/ImageModal";
import { GetEventById, GetTopEventsViewed, PatchEventById } from "@/api/events";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import VideoDetailsContent from "@/pages/Videos/VideoDetails/VideoDetailsContent";

import NewsCard from "../NewsCard/NewsCard";

const EventHeroEnhanced = ({ className = "" }) => {
  const { t, i18n } = useTranslation();
  const { id: paramId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [sideEventData, setSideEventData] = useState([]);
  const [eventData, setEventData] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDetailsVideoModal, setOpenDetailsVideoModal] = useState(false);
  const navigate = useNavigate();

  const getEventsData = async () => {
    try {
      const res = await GetTopEventsViewed();
      setSideEventData(res.data);
    } catch (err) {
      console.error("Failed to fetch side events data:", err);
    }
  };
  // Event handlers - يمكن تخصيصها حسب الحاجة
  const handleArticleClick = (article) => {
    setSelectedItem(article);
    if (article.report_type === "videos") {
      setOpenDetailsVideoModal(true);
    } else {
      // console.log("Article clicked", article);
      navigate(`/events/report/${article.id}`);
    }
  };
  // دالة الإعجاب
  const handleLike = async () => {
    try {
      const newLikedState = !eventData?.has_liked;

      await PatchEventById(eventData?.id, {
        has_liked: newLikedState,
      });
      setEventData({
        ...eventData,
        has_liked: newLikedState,
        likes_count: newLikedState
          ? eventData?.likes_count + 1
          : eventData?.likes_count - 1,
      });
      // toast.success(newLikedState ? t("Like Added") : t("Like Removed"));
    } catch (err) {
      setErrorFn(err, t);
    }
  };
  // دالة فتح الصورة في عرض مكبر
  const handleOpenImage = () => {
    setIsImageModalOpen(true);
  };
  // دالة تحميل الصورة
  const handleDownloadImage = async () => {
    try {
      const imageUrl = eventData?.image || eventData?.image_url;

      // جلب الصورة كـ blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // إنشاء URL للـ blob
      const blobUrl = window.URL.createObjectURL(blob);

      // إنشاء رابط التحميل
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${eventData?.title.replace(/\s+/g, "_")}.jpg`;
      document.body.appendChild(link);
      link.click();

      // تنظيف الموارد
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      // إظهار رسالة نجاح التحميل
      toast.success(t("Image downloaded successfully!"));
    } catch (error) {
      console.error("خطأ في تحميل الصورة:", error);
      toast.error(t("Failed to download image"));
    }
  };
  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await GetEventById(paramId);
      setEventData(res.data);
    } catch (err) {
      console.error("Failed to fetch event data:", err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, [paramId]);

  useEffect(() => {
    getEventsData();
  }, []);

  return (
    <div
      className={`lg:flex gap-4 lg:gap-4 items-start w-full  p-4 lg:p-6 news-hero-container ${className}`}
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      {/* Start Main Article */}
      <div className="flex flex-col gap-6 flex-1 max-w-4xl news-hero-main">
        {/* Start TItle */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-text leading-tight tracking-tight">
          {eventData?.title}
        </h1>
        {/* End Title */}
        {/* Start Image */}
        <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
          <img
            src={eventData?.image || eventData?.image_url}
            alt={eventData?.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        {/* ENd Image */}
        {/* Start Description */}
        <p className="text-base md:text-lg text-text leading-relaxed">
          {eventData?.description || eventData?.summary}
        </p>
        {/* End description */}
        {/* Start Article Info */}
        <div className="w-full flex items-center justify-between text-text border-b-2 border-blue-600/60 pb-3">
          {/* left: writer & date */}
          <div className="flex items-center gap-4">
            <span className="text-base md:text-lg">
              {t("By")} {eventData?.writer}
            </span>
            <div className="w-px h-6 bg-white opacity-50" />
            <span className="text-base md:text-lg">{eventData?.date}</span>
          </div>

          {/* right: country pill + image controls */}
          <div className="flex items-center gap-3">
            <span className="lg:px-3 py-1 border border-white/50 rounded-full text-text/80 backdrop-blur-sm text-sm">
              {t(eventData?.country)}
            </span>

            <ImageControls
              has_liked={eventData?.has_liked}
              onLike={handleLike}
              onExpandImage={handleOpenImage}
              onDownloadImage={handleDownloadImage}
              onShareImage={() => setIsShareModalOpen(true)}
              className="!relative !bottom-0 !left-0"
            />
            {/* Start Icons */}
            {/* <div className="flex items-center gap-2">
              <button
                onClick={() => setIsShareOpen(true)}
                className="w-8 h-8 flex items-center justify-center text-text hover:bg-white/10 rounded transition-colors"
                aria-label="Share article"
              >
                <Share2 />
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center text-text hover:bg-white/10 rounded transition-colors"
                aria-label="Bookmark article"
              >
                <img
                  src="../../../icons/verifyAcoount.png"
                  alt="Verified"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center text-text hover:bg-white/10 rounded transition-colors"
                aria-label="Download article"
              >
                <Download />
              </button>
            </div> */}
            {/* End Icons */}
          </div>
        </div>
      </div>
      {/* End Main Article */}

      {/* Start Side Articles */}
      <div className="flex flex-col gap-1 w-full lg:w-80 flex-shrink-0 news-hero-sidebar news-sidebar max-h-screen overflow-y-auto">
        {sideEventData?.map((sideArticle) => (
          <NewsCard
            key={sideArticle.id}
            t={t}
            article={sideArticle}
            onClick={handleArticleClick}
            imgClassName="w-20 h-20"
          />
        ))}
      </div>
      {/* End Side Articles */}
      {/* Start Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={window.location.href}
        title={eventData?.title}
      />
      {/* End Share Modal */}

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageData={{
          image: eventData?.image,
          title: eventData?.title,
          subtitle: eventData?.category,
          writer: eventData?.writer,
          details: `${eventData?.date} • ${eventData?.country}`,
        }}
        onDownloadImage={handleDownloadImage}
        isRTL={i18n.language === "ar"}
      />
      {openDetailsVideoModal &&
        createPortal(
          <VideoDetailsContent
            isOpen={openDetailsVideoModal}
            onClose={() => setOpenDetailsVideoModal(false)}
            videoData={selectedItem}
          />,
          document.body
        )}
    </div>
  );
};

export default EventHeroEnhanced;
