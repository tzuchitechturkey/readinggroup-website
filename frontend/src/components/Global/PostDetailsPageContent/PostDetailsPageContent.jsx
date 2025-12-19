import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Import components
import Contentcard from "@/components/Global/GlobalCard/GlobalCard";
import ShareModal from "@/components/Global/ShareModal/ShareModal";
import ImageControls from "@/components/Global/ImageControls/ImageControls";
import ImageModal from "@/components/Global/ImageModal/ImageModal";
import ContentInfoCard from "@/components/Global/ContentInfoCard/ContentInfoCard";
import RatingSection from "@/components/Global/RatingSection/RatingSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ArrowButton from "@/components/Global/ArrowButton/ArrowButton";
import {
  GetPostById,
  PatchPostById,
  RatingPosts,
  TopCommentedPosts,
} from "@/api/posts";
import {
  GetContentById,
  PatchContentById,
  RatingContent,
  TopLikedContents,
} from "@/api/contents";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import CommentsSection from "@/components/Global/CommentsSection/CommentsSection";

function PostDetailsPageContent() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { id: paramId } = useParams();
  const location = useLocation();
  const fromContent = location.pathname.includes("contents/content");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0); // للتفاعل مع hover
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [cardData, setCardData] = useState();
  const [topCommentedData, setTopCommentedData] = useState();
  const [update, setUpdate] = useState(false);
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const getCardData = async () => {
    setIsLoading(true);
    try {
      const res = fromContent
        ? await GetContentById(paramId)
        : await GetPostById(paramId);
      setCardData(res.data);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  const getTopCommentedPosts = async () => {
    try {
      const res = fromContent
        ? await TopLikedContents()
        : await TopCommentedPosts();
      setTopCommentedData(res?.data);
    } catch (err) {
      setErrorFn(err, t);
    }
  };
  // تطبيق RTL عند تغيير اللغة
  useEffect(() => {
    const isRTL = i18n.language === "ar";
    document.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.style.direction = isRTL ? "rtl" : "ltr";
  }, [i18n.language]);

  // دالة الإعجاب
  const handleLike = async () => {
    try {
      const newLikedState = !cardData?.has_liked;

      const patchFn = fromContent ? PatchContentById : PatchPostById;
      await patchFn(cardData.id, {
        has_liked: newLikedState,
      });

      setCardData({
        ...cardData,
        has_liked: newLikedState,
      });

      // toast.success(newLikedState ? t("Like Added") : t("Like removed"));
    } catch (error) {
      setErrorFn(error, t);
      toast.error(t("Failed to update like status"));
    }
  };

  // دالة فتح الصورة في عرض مكبر
  const handleOpenImage = () => {
    setIsImageModalOpen(true);
  };

  // دالة تقييم النجوم
  const handleStarRating = async (rating) => {
    try {
      const ratingFn = fromContent ? RatingContent : RatingPosts;
      await ratingFn(cardData.id, { rating });
      setUpdate(!update);
    } catch (error) {
      setErrorFn(error, t);
    }
  };

  // دالة تحميل الصورة
  const handleDownloadImage = () => {
    try {
      const imageUrl = "/azem.png";
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${cardData?.title.replace(/\s+/g, "_")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // إظهار رسالة نجاح التحميل
      toast.success(t("Image downloaded successfully!"));
    } catch (error) {
      console.error("خطأ في تحميل الصورة:", error);
      toast.error(t("Failed to download image"));
    }
  };

  useEffect(() => {
    getCardData();
    getTopCommentedPosts();
  }, [paramId, update]);

  // Track carousel slide changes
  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    // eslint-disable-next-line consistent-return
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);
  return (
    <div
      className={`min-h-screen bg-gray-50 ${
        i18n.language === "ar" ? "rtl" : "ltr"
      }`}
    >
      {isLoading && <Loader />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            {/* Cart Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="relative group" dir={"ltr"}>
                {fromContent &&
                Array.isArray(cardData?.images) &&
                cardData?.images.length > 0 ? (
                  // Carousel for multiple images (Content)
                  <Carousel
                    className="w-full"
                    opts={{ align: "center", loop: true }}
                    setApi={setApi}
                  >
                    <div className="relative    rounded-t-xl">
                      <CarouselContent className="-ml-0 h-full">
                        {cardData?.images.map((imageItem, index) => (
                          <CarouselItem key={index} className="pl-0 basis-full">
                            <div className="h-full w-full flex items-center justify-center ">
                              <img
                                src={imageItem.image}
                                alt={`Image ${index + 1}`}
                                className="w-full max-h-[400px] object-contain"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>

                      {cardData?.images.length > 1 && (
                        <>
                          <ArrowButton
                            side="left"
                            label="Previous image"
                            onClick={() => api?.scrollPrev()}
                          />
                          <ArrowButton
                            side="right"
                            label="Next image"
                            onClick={() => api?.scrollNext()}
                          />
                        </>
                      )}

                      {/* Pagination Dots */}
                      {cardData?.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                          {cardData?.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => api?.scrollTo(index)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === current
                                  ? "bg-white w-6"
                                  : "bg-white/50 hover:bg-white/75"
                              }`}
                              aria-label={`Go to image ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </Carousel>
                ) : (
                  // Single image (Post)
                  <div className="aspect-video bg-black rounded-t-xl flex items-center justify-center overflow-hidden">
                    <div className="relative w-full h-full">
                      <img
                        src={cardData?.image || cardData?.image_url}
                        alt="Thumbnail"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Cart Controls */}
                <ImageControls
                  has_liked={cardData?.has_liked}
                  onLike={handleLike}
                  onExpandImage={handleOpenImage}
                  onDownloadImage={handleDownloadImage}
                  onShareImage={() => setIsShareModalOpen(true)}
                  isRTL={i18n.language === "ar"}
                />
              </div>
            </div>
            {/* Start Body */}
            <div className=" p-4  px-6 rounded-xl mb-2 bg-white  prose prose-sm max-w-none">
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: cardData?.body || "" }}
              />
            </div>
            {/* End Body */}
            {/* Rating Section */}
            <RatingSection
              hoveredRating={hoveredRating}
              onStarRating={handleStarRating}
              onStarHover={setHoveredRating}
              onStarLeave={() => setHoveredRating(0)}
              contentData={cardData}
              isRTL={i18n.language === "ar"}
            />

            {/* Start Comments Section */}
            <CommentsSection itemId={cardData?.id} type={"post"} />
            {/* End Comments Section */}
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            {/* Card Info */}
            <ContentInfoCard
              contentData={cardData}
              contentType="card"
              isRTL={i18n.language === "ar"}
            />

            {/* This Week's Cards */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("This Week's Cards")}
              </h3>
              <div className="space-y-4">
                {topCommentedData?.map((card) => (
                  <div key={card.id} className="bg-gray-50 rounded-lg p-3">
                    <Contentcard item={card} fromContent={fromContent} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={window.location.href}
        title={cardData?.title}
      />

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageData={{
          image: cardData?.image || cardData?.image_url,
          title: cardData?.title,
          subtitle: cardData?.badge,
          writer: cardData?.writer,
          details: `★ ${cardData?.rating} (${cardData?.reviews}k)`,
        }}
        onDownloadImage={handleDownloadImage}
        isRTL={i18n.language === "ar"}
      />
    </div>
  );
}

export default PostDetailsPageContent;
