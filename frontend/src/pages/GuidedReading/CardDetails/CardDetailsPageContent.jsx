import React, { useState, useEffect, use } from "react";

import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Download, Bookmark, Star } from "lucide-react";

// Import components
import GuidingReadingcard from "@/components/Global/GuidingReadingcard/GuidingReadingcard";
import CommentsSection from "@/components/ForPages/Videos/VideoPage/CommentsSection/CommentsSection";
import ShareModal from "@/components/Global/ShareModal/ShareModal";
import ImageControls from "@/components/Global/ImageControls/ImageControls";
import ImageModal from "@/components/Global/ImageModal/ImageModal";
import ContentInfoCard from "@/components/Global/ContentInfoCard/ContentInfoCard";
import RatingSection from "@/components/Global/RatingSection/RatingSection";
import { GetPostById, LikePost, UnlikePost } from "@/api/posts";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";

const comments = [
  {
    id: "c1",
    writer: "Jenny Wilson",
    avatar: "/icons/User 1.png",
    timeAgo: "3 days ago",
    edited: true,
    text: "Tzu Chi Foundation visits Syrian lands to provide humanitarian aid and relief to communities affected by conflict",
    likes: 124,
    repliesCount: 18,
    replies: [
      {
        id: 1,
        avatar: "/icons/User 1.png",
        writer: "Ali Ahmed",
        timeAgo: "2h ago",
        edited: false,
        text: "This is really inspiring work by Tzu Chi Foundation.",
        likes: 4,
      },
      {
        id: 2,
        avatar: "/icons/User 1.png",
        writer: "Sara Mohamed",
        timeAgo: "30m ago",
        edited: true,
        text: "Thank you for sharing this meaningful content 🙂",
        likes: 2,
      },
    ],
  },
  {
    id: "c2",
    writer: "Jenny Wilson",
    avatar: "/icons/User 1.png",
    timeAgo: "3 days ago",
    edited: true,
    text: "Tzu Chi Foundation visits Syrian lands to provide humanitarian aid and relief to communities affected by conflict",
    likes: 124,
    repliesCount: 18,
  },
  {
    id: "c3",
    writer: "Jenny Wilson",
    avatar: "/icons/User 1.png",
    timeAgo: "3 days ago",
    edited: true,
    text: "Tzu Chi Foundation visits Syrian lands to provide humanitarian aid and relief to communities affected by conflict",
    likes: 174,
    repliesCount: 18,
  },
  {
    id: "c4",
    writer: "Jenny Wilson",
    avatar: "/icons/User 1.png",
    timeAgo: "3 days ago",
    edited: true,
    text: "Tzu Chi Foundation visits Syrian lands to provide humanitarian aid and relief to communities affected by conflict",
    likes: 124,
    repliesCount: 18,
  },
];

function CardDetailsPageContent() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { id: paramId } = useParams();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [userRating, setUserRating] = useState(0); // تقييم المستخدم
  const [hoveredRating, setHoveredRating] = useState(0); // للتفاعل مع hover
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [cardData, setCardData] = useState();
  const [userId, setUserId] = useState();

  const getCardData = async () => {
    setIsLoading(true);
    try {
      const res = await GetPostById(paramId);
      setCardData(res.data);
      console.log("Card Data:", res.data);
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
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
      if (!isLiked) {
        await LikePost({ user: userId, post: cardData.id });
        toast.success(t("Added to favorites!"));
      } else {
        await UnlikePost({ user: userId, post: cardData.id });
        toast.info(t("Removed from favorites"));
      }
      setIsLiked(!isLiked);
    } catch (error) {
      setErrorFn(error);
    }
  };

  // دالة فتح الصورة في عرض مكبر
  const handleOpenImage = () => {
    setIsImageModalOpen(true);
  };

  // دالة تقييم النجوم
  const handleStarRating = (rating) => {
    setUserRating(rating);
    toast.success(t(`You rated this content ${rating} stars!`));
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

  // تنسيق البيانات لتتماشى مع مكون CommentsSection

  const thisWeekCards = Array(3)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      title: "Report - Community Gathering",
      badge: "STARTING 16:00 PM",
      writer: "Source",
      rating: 4.8,
      reviews: "2.1",
      type: "Community",
      date: "Apr 18",
    }));

  const isRTL = i18n.language === "ar";
  useEffect(() => {
    getCardData();
  }, [paramId]);
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);
  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      {isLoading && <Loader />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            {/* Cart Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="relative">
                <div className="aspect-video bg-black rounded-t-xl flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <img
                      src={cardData?.image}
                      alt="Video Thumbnail"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Cart Controls */}
                <ImageControls
                  isLiked={isLiked}
                  onLike={handleLike}
                  onExpandImage={handleOpenImage}
                  onDownloadImage={handleDownloadImage}
                  onShareImage={() => setIsShareModalOpen(true)}
                  isRTL={isRTL}
                />
              </div>
            </div>

            {/* Rating Section */}
            <RatingSection
              userRating={userRating}
              hoveredRating={hoveredRating}
              onStarRating={handleStarRating}
              onStarHover={setHoveredRating}
              onStarLeave={() => setHoveredRating(0)}
              contentData={cardData}
              isRTL={isRTL}
            />

            {/* Comments Section */}
            <CommentsSection comments={comments} />
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            {/* Card Info */}
            <ContentInfoCard
              contentData={cardData}
              contentType="card"
              isRTL={isRTL}
            />

            {/* This Week's Cards */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("This Week's Cards")}
              </h3>
              <div className="space-y-4">
                {thisWeekCards.map((card) => (
                  <div key={card.id} className="bg-gray-50 rounded-lg p-3">
                    <GuidingReadingcard item={card} />
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
          image: "/azem.png",
          title: cardData?.title,
          subtitle: cardData?.badge,
          writer: cardData?.writer,
          details: `★ ${cardData?.rating} (${cardData?.reviews}k)`,
        }}
        onDownloadImage={handleDownloadImage}
        isRTL={isRTL}
      />
    </div>
  );
}

export default CardDetailsPageContent;
