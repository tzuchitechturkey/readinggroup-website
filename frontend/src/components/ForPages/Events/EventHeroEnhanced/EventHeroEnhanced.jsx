import React, { useState, useEffect, useMemo, useRef } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { createPortal } from "react-dom";

import ShareModal from "@/components/Global/ShareModal/ShareModal";
import ImageControls from "@/components/Global/ImageControls/ImageControls";
import ImageModal from "@/components/Global/ImageModal/ImageModal";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import VideoDetailsContent from "@/pages/Videos/VideoDetails/VideoDetailsContent";
import {
  GetContentById,
  PatchContentById,
  TopLikedContents,
} from "@/api/contents";
import Contentcard from "@/components/Global/GlobalCard/GlobalCard";
import HtmlContent from "@/components/Global/HtmlContent/HtmlContent";

import NewsCard from "../../../Global/NewsCard/NewsCard";

const ContentHeroEnhanced = () => {
  const { t, i18n } = useTranslation();
  const { id: paramId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [sideContentData, setSideContentData] = useState([]);
  const [contentData, setContentData] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDetailsVideoModal, setOpenDetailsVideoModal] = useState(false);
  const navigate = useNavigate();

  const getContentData = async () => {
    try {
      const res = await TopLikedContents();
      setSideContentData(res.data);
    } catch (err) {
      setErrorFn(err, t);
    }
  };
  // Content handlers - يمكن تخصيصها حسب الحاجة
  const handleArticleClick = (article) => {
    navigate(`/contents/content/${article?.id}`);
  };
  // دالة الإعجاب
  const handleLike = async () => {
    try {
      const newLikedState = !contentData?.has_liked;

      await PatchContentById(contentData?.id, {
        has_liked: newLikedState,
      });
      setContentData({
        ...contentData,
        has_liked: newLikedState,
        likes_count: newLikedState
          ? contentData?.likes_count + 1
          : contentData?.likes_count - 1,
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
      const imageUrl = contentData?.image || contentData?.image_url;

      // جلب الصورة كـ blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // إنشاء URL للـ blob
      const blobUrl = window.URL.createObjectURL(blob);

      // إنشاء رابط التحميل
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${contentData?.title.replace(/\s+/g, "_")}.jpg`;
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
      const res = await GetContentById(paramId);
      setContentData(res.data);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, [paramId]);

  useEffect(() => {
    getContentData();
  }, []);

  // Sanitize summary HTML from CKEditor (basic client-side approach)
  const sanitizedSummary = useMemo(() => {
    if (!contentData?.summary) return "";
    try {
      const temp = document.createElement("div");
      temp.innerHTML = contentData.summary;
      // Remove script tags
      temp.querySelectorAll("script").forEach((el) => el.remove());
      // Remove on* content handlers
      temp.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (/^on/i.test(attr.name)) {
            el.removeAttribute(attr.name);
          }
        });
      });
      return temp.innerHTML;
    } catch {
      return "";
    }
  }, [contentData?.summary]);

  return (
    <div
      className={`lg:flex gap-4 lg:gap-4 items-start w-full  p-4 lg:p-6 news-hero-container  `}
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      {/* Start Main Article */}
      <div className="flex flex-col gap-6 flex-1 max-w-4xl news-hero-main">
        {/* Start TItle */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-text leading-tight tracking-tight">
          {contentData?.title}
        </h1>
        {/* End Title */}
        {/* Start Image */}
        <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
          {contentData?.images?.length > 0 && (
            <img
              src={
                contentData?.images[0]?.image ||
                contentData?.images[0]?.image_url
              }
              alt={contentData?.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          )}
        </div>
        {/* ENd Image */}
        {/* Start Article Info */}
        <div className="w-full flex items-center justify-between text-text border-b-2 border-blue-600/60 pb-3">
          {/* left: writer & date */}
          <div className="flex items-center gap-4">
            <span className="text-base md:text-lg">
              {t("By")} {contentData?.writer}
            </span>
            <div className="w-px h-6 bg-white opacity-50" />
            <span className="text-base md:text-lg">{contentData?.date}</span>
          </div>

          {/* right: country pill + image controls */}
          <div className="flex items-center gap-3">
            <span className="lg:px-3 py-1 border border-white/50 rounded-full text-text/80 backdrop-blur-sm text-sm">
              {t(contentData?.country)}
            </span>

            <ImageControls
              hasLiked={contentData?.has_liked}
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
        {/* Start Description / Summary (render HTML from CKEditor) */}
        <div className="text-base md:text-lg text-text leading-relaxed prose max-w-none">
          {contentData?.description ? (
            <span>{contentData.description}</span>
          ) : (
            <HtmlContent html={sanitizedSummary} />
          )}
        </div>
        {/* End Description */}
      </div>
      {/* End Main Article */}

      {/* Start Side Articles */}
      <div className="flex flex-col gap-1 w-full lg:w-80 flex-shrink-0 news-hero-sidebar news-sidebar max-h-screen overflow-y-auto">
        {sideContentData?.map((sideArticle) => (
          <NewsCard
            key={sideArticle.id}
            t={t}
            article={sideArticle}
            onClick={handleArticleClick}
            imgClassName="w-20 h-20"
            section="contents"
          />
        ))}
      </div>
      {/* End Side Articles */}
      {/* Start Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={window.location.href}
        title={contentData?.title}
      />
      {/* End Share Modal */}

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageData={{
          image: contentData?.image,
          title: contentData?.title,
          subtitle: contentData?.category,
          writer: contentData?.writer,
          details: `${contentData?.date} • ${contentData?.country}`,
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

export default ContentHeroEnhanced;
