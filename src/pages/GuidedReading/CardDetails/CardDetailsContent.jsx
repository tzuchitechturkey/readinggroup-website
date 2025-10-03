import React, { useState, useEffect } from "react";

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
import { resolveAsset } from "@/utils/assetResolver";

const DEFAULT_CARD_ASSET = resolveAsset("azem.png");
const DEFAULT_AVATAR_ASSET = resolveAsset("icons/User 1.png");

function CardDetailsContent() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [userRating, setUserRating] = useState(0); // تقييم المستخدم
  const [hoveredRating, setHoveredRating] = useState(0); // للتفاعل مع hover
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // تطبيق RTL عند تغيير اللغة
  useEffect(() => {
    const isRTL = i18n.language === "ar";
    document.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.style.direction = isRTL ? "rtl" : "ltr";
  }, [i18n.language]);

  // دالة الإعجاب
  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast.success(t("Added to favorites!"));
    } else {
      toast.info(t("Removed from favorites"));
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
      const imageUrl = DEFAULT_CARD_ASSET;
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${cardData.title.replace(/\s+/g, "_")}.jpg`;
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

  // Mock data - في التطبيق الحقيقي سيتم جلب البيانات من API بناء على id
  // يمكن استخدام id لجلب البيانات: const cardData = await fetchCardDetails(id);
  const cardData = {
    id: id || 1,
    title: "Tzu Chi Visits Syrian Lands",
    badge: "Incredible Card",
    author: "Jenny Wilson",
    rating: 4,
    reviews: "2.1",
    description:
      "Doctors accompanied and Kim examined patient's checkups include a visit to Universal College of Medical Sciences and Teaching Hospital (UCMS) to monitor the administration centre for Likelihood Checklist (UGCS) in Ramage, near Kathmandu. In case the family's transfer, Nurse Briana Shrestha explained the medical process and supported outreach health insurance Meanwhile, volunteers helped social discussions, answering Kiran and her father's questions about volunteering, making sure she remained healthy during her stay at UCMS, the only source of income, which had been damaged in an accident. After five hours of report of injury received, Tzu Chi staff who were staying she received support to survive their journey to support her family.",
    video: resolveAsset("videos/sample-video.mp4"),
    tags: ["Medical", "Volunteer", "Support", "Community"],
  };

  // تنسيق البيانات لتتماشى مع مكون CommentsSection
  const comments = [
    {
      id: "c1",
      author: "Jenny Wilson",
      avatar: DEFAULT_AVATAR_ASSET,
      timeAgo: "3 days ago",
      edited: true,
      text: "Tzu Chi Foundation visits Syrian lands to provide humanitarian aid and relief to communities affected by conflict",
      likes: 124,
      repliesCount: 18,
      replies: [
        {
          id: 1,
          avatar: DEFAULT_AVATAR_ASSET,
          author: "Ali Ahmed",
          timeAgo: "2h ago",
          edited: false,
          text: "This is really inspiring work by Tzu Chi Foundation.",
          likes: 4,
        },
        {
          id: 2,
          avatar: DEFAULT_AVATAR_ASSET,
          author: "Sara Mohamed",
          timeAgo: "30m ago",
          edited: true,
          text: "Thank you for sharing this meaningful content 🙂",
          likes: 2,
        },
      ],
    },
    {
      id: "c2",
      author: "Jenny Wilson",
      avatar: DEFAULT_AVATAR_ASSET,
      timeAgo: "3 days ago",
      edited: true,
      text: "Tzu Chi Foundation visits Syrian lands to provide humanitarian aid and relief to communities affected by conflict",
      likes: 124,
      repliesCount: 18,
    },
    {
      id: "c3",
      author: "Jenny Wilson",
      avatar: DEFAULT_AVATAR_ASSET,
      timeAgo: "3 days ago",
      edited: true,
      text: "Tzu Chi Foundation visits Syrian lands to provide humanitarian aid and relief to communities affected by conflict",
      likes: 174,
      repliesCount: 18,
    },
    {
      id: "c4",
      author: "Jenny Wilson",
      avatar: DEFAULT_AVATAR_ASSET,
      timeAgo: "3 days ago",
      edited: true,
      text: "Tzu Chi Foundation visits Syrian lands to provide humanitarian aid and relief to communities affected by conflict",
      likes: 124,
      repliesCount: 18,
    },
  ];

  const thisWeekCards = Array(3)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      title: "Report - Community Gathering",
      badge: "STARTING 16:00 PM",
      author: "Source",
      rating: 4.8,
      reviews: "2.1",
      type: "Community",
      date: "Apr 18",
    }));

  const isRTL = i18n.language === "ar";

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
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
                      src={DEFAULT_CARD_ASSET}
                      alt="Video Thumbnail"
                      className="w-full h-full object-cover"
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
        title={cardData.title}
      />

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageData={{
          image: DEFAULT_CARD_ASSET,
          title: cardData.title,
          subtitle: cardData.badge,
          author: cardData.author,
          details: `★ ${cardData.rating} (${cardData.reviews}k)`,
        }}
        onDownloadImage={handleDownloadImage}
        isRTL={isRTL}
      />
    </div>
  );
}

export default CardDetailsContent;
