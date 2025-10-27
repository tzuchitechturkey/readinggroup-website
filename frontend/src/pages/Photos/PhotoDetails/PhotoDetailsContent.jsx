import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";

// Import components
import WeekPhotosCard from "@/components/Global/WeekPhotosCard/WeekPhotosCard";
import ShareModal from "@/components/Global/ShareModal/ShareModal";
import ImageControls from "@/components/Global/ImageControls/ImageControls";
import ImageModal from "@/components/Global/ImageModal/ImageModal";
import ContentInfoCard from "@/components/Global/ContentInfoCard/ContentInfoCard";
import RatingSection from "@/components/Global/RatingSection/RatingSection";
import PostCommentsSection from "@/components/ForPages/GuidedReading/PostCommentsSection/PostCommentsSection";

function PhotoDetailsContent() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const isRTL = i18n.language === "ar";
    document.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.style.direction = isRTL ? "rtl" : "ltr";
  }, [i18n.language]);

  const isRTL = i18n.language === "ar";

  // دالة الإعجاب
  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast.success(t("Added to favorites!"));
    } else {
      toast.info(t("Removed from favorites"));
    }
  };

  // دالة تقييم النجوم
  const handleStarRating = (rating) => {
    setUserRating(rating);
    toast.success(t(`You rated this content ${rating} stars!`));
  };

  // دالة فتح الصورة في عرض مكبر
  const handleOpenImage = () => {
    setIsImageModalOpen(true);
  };

  // دالة تحميل الصورة
  const handleDownloadImage = () => {
    try {
      const imageUrl = photoData.image;
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${photoData.title.replace(/\s+/g, "_")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(t("Image downloaded successfully!"));
    } catch (error) {
      console.error("خطأ في تحميل الصورة:", error);
      toast.error(t("Failed to download image"));
    }
  };

  // Mock data للصورة
  const photoData = {
    id: id || 1,
    title: "Community Gathering Moments",
    subtitle: "Weekly Photo Collection",
    photographer: "Sarah Johnson",
    location: "Damascus, Syria",
    date: "Oct 15, 2024",
    views: 1240,
    rating: 4.7,
    reviews: "3.2",
    image: "/weekly-images.jpg",
    description:
      "A beautiful collection of moments captured during our weekly community gathering. These photos showcase the spirit of unity, compassion, and shared purpose that defines our community. From heartfelt conversations to collaborative activities, each image tells a story of human connection and positive impact.",
    tags: ["Community", "Photography", "Humanitarian", "Social", "Cultural"],
    camera: "Canon EOS R5",
    settings: "f/2.8, 1/125s, ISO 400",
    category: "Event Photography",
  };

  // بيانات التعليقات
  const comments = [
    {
      id: "c1",
      writer: "Ahmed Hassan",
      avatar: "/icons/User 1.png",
      timeAgo: "2 days ago",
      edited: false,
      text: "Beautiful capture of the community spirit! The lighting and composition are perfect.",
      likes: 89,
      repliesCount: 12,
      replies: [
        {
          id: 1,
          avatar: "/icons/User 1.png",
          writer: "Maya Al-Zahra",
          timeAgo: "1 day ago",
          edited: false,
          text: "I completely agree! The photographer really captured the essence of our community.",
          likes: 15,
        },
        {
          id: 2,
          avatar: "/icons/User 1.png",
          writer: "Omar Khalil",
          timeAgo: "18h ago",
          edited: true,
          text: "These photos bring back such wonderful memories from that day 📸",
          likes: 8,
        },
      ],
    },
    {
      id: "c2",
      writer: "Layla Ibrahim",
      avatar: "/icons/User 1.png",
      timeAgo: "1 day ago",
      edited: false,
      text: "What an amazing collection! Each photo tells a unique story of hope and togetherness.",
      likes: 156,
      repliesCount: 24,
    },
    {
      id: "c3",
      writer: "Khalid Mansour",
      avatar: "/icons/User 1.png",
      timeAgo: "1 day ago",
      edited: true,
      text: "The technical quality is outstanding. Love the depth of field and color grading.",
      likes: 73,
      repliesCount: 8,
    },
  ];

  // صور مشابهة
  const similarPhotos = [
    {
      id: 1,
      title: "Morning Assembly",
      image: "/1-top5.jpg",
      photographer: "Alex Chen",
      views: 890,
      category: "Event Photography",
    },
    {
      id: 2,
      title: "Volunteer Activities",
      image: "/2-top5.jpg",
      photographer: "Maria Garcia",
      views: 1150,
      category: "Documentary",
    },
    {
      id: 3,
      title: "Cultural Exchange",
      image: "/3-top5.jpg",
      photographer: "David Kim",
      views: 967,
      category: "Cultural",
    },
    {
      id: 4,
      title: "Youth Workshop",
      image: "/4-top5.jpg",
      photographer: "Emma Wilson",
      views: 1340,
      category: "Educational",
    },
  ];

  // صور هذا الأسبوع
  const thisWeekPhotos = Array(3)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      title: `Weekly Collection ${index + 1}`,
      subtitle: "Community Moments",
      image: `/${index + 1}-top5.jpg`,
      photographer: "Community Team",
      views: Math.floor(Math.random() * 1000) + 500,
      date: "Oct 2024",
    }));

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            {/* Photo Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="relative">
                <div className="aspect-video bg-black rounded-t-xl flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <img
                      src={photoData.image}
                      alt={photoData.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Photo Controls */}
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
              contentData={photoData}
              isRTL={isRTL}
            />

            {/* Similar Photos Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("Similar Photos")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {similarPhotos.slice(0, 4).map((item) => (
                  <div key={item.id} className="relative group cursor-pointer">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg" />
                    <div className="absolute bottom-2 left-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <button className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                  {t("Event Photography")}
                </button>
                <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {t("Documentary")}
                </button>
                <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {t("Cultural")}
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <PostCommentsSection postId={photoData.id} />
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            {/* Photo Info */}
            <ContentInfoCard
              contentData={photoData}
              contentType="photo"
              isRTL={isRTL}
            />

            {/* This Week's Photos */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("This Week's Photos")}
              </h3>
              <div className="space-y-4">
                {thisWeekPhotos.map((photo) => (
                  <div key={photo.id} className="bg-gray-50 rounded-lg p-3">
                    <WeekPhotosCard item={photo} />
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
        title={photoData.title}
      />

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageData={{
          image: photoData.image,
          title: photoData.title,
          subtitle: photoData.subtitle,
          writer: photoData.photographer,
          details: `${photoData.location} • ${photoData.date}`,
        }}
        onDownloadImage={handleDownloadImage}
        isRTL={isRTL}
      />
    </div>
  );
}

export default PhotoDetailsContent;
