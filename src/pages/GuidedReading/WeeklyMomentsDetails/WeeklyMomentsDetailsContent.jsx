import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Star, Play, Pause } from "lucide-react";

// Import components
import WeeklyMomentsCard from "@/components/Global/WeeklyMomentsCard/WeeklyMomentsCard";
import CommentsSection from "@/components/ForPages/Videos/VideoPage/CommentsSection/CommentsSection";
import ShareModal from "@/components/Global/ShareModal/ShareModal";
import ImageControls from "@/components/Global/ImageControls/ImageControls";
import ImageModal from "@/components/Global/ImageModal/ImageModal";
import ContentInfoCard from "@/components/Global/ContentInfoCard/ContentInfoCard";
import RatingSection from "@/components/Global/RatingSection/RatingSection";

function WeeklyMomentsDetailsContent() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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

  // دالة تحميل المحتوى
  const handleDownloadContent = () => {
    try {
      const contentUrl = weeklyMomentData.image;
      const link = document.createElement("a");
      link.href = contentUrl;
      link.download = `${weeklyMomentData.title.replace(/\s+/g, "_")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(t("Content downloaded successfully!"));
    } catch (error) {
      console.error("خطأ في تحميل المحتوى:", error);
      toast.error(t("Failed to download content"));
    }
  };

  // دالة تشغيل/إيقاف المحتوى (إذا كان فيديو)
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.info(t("Playing content"));
    } else {
      toast.info(t("Content paused"));
    }
  };

  // Mock data للـ Weekly Moment
  const weeklyMomentData = {
    id: id || 1,
    title: "Report - Community Gathering",
    subtitle: "This Week's Special Moment",
    author: "Community Team",
    location: "Damascus, Syria",
    date: "Oct 15, 2024",
    startTime: "6:00 AM",
    views: 1842,
    rating: 4.8,
    reviews: "4.1",
    image: "/src/assets/authback.jpg",
    statusLabel: "147",
    statusColor: "bg-purple-600",
    type: "News",
    source: "Community",
    language: "AR / EN",
    description:
      "This week's special moment captures the essence of our community gathering. A heartwarming report showcasing the unity, compassion, and shared values that bring us together every week. Experience the stories, faces, and emotions that make our community strong and vibrant.",
    tags: ["Community", "Weekly", "Report", "Gathering", "Unity"],
    category: "Community Report",
    duration: "5:30",
    hasVideo: true,
  };

  // بيانات التعليقات
  const comments = [
    {
      id: "c1",
      author: "Ahmed Hassan",
      avatar: "/src/assets/icons/User 1.png",
      timeAgo: "2 days ago",
      edited: false,
      text: "Such an inspiring weekly moment! The community spirit really shines through.",
      likes: 124,
      repliesCount: 18,
      replies: [
        {
          id: 1,
          avatar: "/src/assets/icons/User 1.png",
          author: "Maya Al-Zahra",
          timeAgo: "1 day ago",
          edited: false,
          text: "I completely agree! These weekly reports always brighten my day.",
          likes: 22,
        },
        {
          id: 2,
          avatar: "/src/assets/icons/User 1.png",
          author: "Omar Khalil",
          timeAgo: "18h ago",
          edited: true,
          text: "Looking forward to participating in next week's gathering! 🌟",
          likes: 15,
        },
      ],
    },
    {
      id: "c2",
      author: "Layla Ibrahim",
      avatar: "/src/assets/icons/User 1.png",
      timeAgo: "1 day ago",
      edited: false,
      text: "What a beautiful representation of our community values. Thank you for sharing!",
      likes: 189,
      repliesCount: 31,
    },
    {
      id: "c3",
      author: "Khalid Mansour",
      avatar: "/src/assets/icons/User 1.png",
      timeAgo: "1 day ago",
      edited: true,
      text: "The production quality keeps getting better each week. Great work team!",
      likes: 98,
      repliesCount: 12,
    },
  ];

  // محتوى مشابه
  const similarMoments = [
    {
      id: 1,
      title: "Charity Drive Report",
      image: "/src/assets/1-top5.jpg",
      author: "Volunteer Team",
      views: 1156,
      category: "Community Service",
      statusLabel: "SEPT 30",
      statusColor: "bg-red-600",
    },
    {
      id: 2,
      title: "Educational Workshop",
      image: "/src/assets/2-top5.jpg",
      author: "Learning Team",
      views: 890,
      category: "Education",
      statusLabel: "SEPT 28",
      statusColor: "bg-green-600",
    },
    {
      id: 3,
      title: "Cultural Exchange Event",
      image: "/src/assets/3-top5.jpg",
      author: "Cultural Team",
      views: 1234,
      category: "Cultural",
      statusLabel: "SEPT 25",
      statusColor: "bg-blue-600",
    },
    {
      id: 4,
      title: "Youth Activity Day",
      image: "/src/assets/4-top5.jpg",
      author: "Youth Team",
      views: 1567,
      category: "Youth",
      statusLabel: "SEPT 22",
      statusColor: "bg-yellow-600",
    },
  ];

  // لحظات هذا الأسبوع
  const thisWeekMoments = Array(3)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      title: `Weekly Report ${index + 1}`,
      subtitle: "Community Highlights",
      image: `/src/assets/${index + 1}-top5.jpg`,
      author: "Community Team",
      views: Math.floor(Math.random() * 1000) + 500,
      startTime: `${6 + index}:00 AM`,
      statusLabel: index === 0 ? "LIVE" : `SEPT ${28 - index}`,
      statusColor: index === 0 ? "bg-red-600" : "bg-green-600",
      type: "News",
      source: "Community",
      language: "AR / EN",
    }));

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            {/* Content Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="relative">
                <div className="aspect-video bg-black rounded-t-xl flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <img
                      src={weeklyMomentData.image}
                      alt={weeklyMomentData.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Play/Pause Button for Video Content */}
                    {weeklyMomentData.hasVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={handlePlayPause}
                          className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-4 transition-all duration-300"
                        >
                          {isPlaying ? (
                            <Pause className="w-12 h-12 text-white" />
                          ) : (
                            <Play className="w-12 h-12 text-white" />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`${weeklyMomentData.statusColor} text-white px-3 py-1 rounded-full text-sm font-medium`}
                      >
                        {weeklyMomentData.statusLabel}
                      </span>
                    </div>

                    {/* Duration Badge */}
                    {weeklyMomentData.duration && (
                      <div className="absolute bottom-4 right-4">
                        <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                          {weeklyMomentData.duration}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Controls */}
                <ImageControls
                  isLiked={isLiked}
                  onLike={handleLike}
                  onExpandImage={handleOpenImage}
                  onDownloadImage={handleDownloadContent}
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
              contentData={weeklyMomentData}
              isRTL={isRTL}
            />

            {/* Similar Moments Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("Similar Weekly Moments")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {similarMoments.slice(0, 4).map((item) => (
                  <div key={item.id} className="relative group cursor-pointer">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg" />
                    <div className="absolute top-2 left-2">
                      <span
                        className={`${item.statusColor} text-white px-2 py-1 rounded text-xs font-medium`}
                      >
                        {item.statusLabel}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <button className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                  {t("Community Report")}
                </button>
                <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {t("Weekly Moments")}
                </button>
                <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {t("Community")}
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <CommentsSection comments={comments} />
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            {/* Content Info */}
            <ContentInfoCard
              contentData={weeklyMomentData}
              contentType="weekly-moment"
              isRTL={isRTL}
            />

            {/* This Week's Moments */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("This Week's Moments")}
              </h3>
              <div className="space-y-4">
                {thisWeekMoments.map((moment) => (
                  <div key={moment.id} className="bg-gray-50 rounded-lg p-3">
                    <WeeklyMomentsCard item={moment} />
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
        title={weeklyMomentData.title}
      />

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageData={{
          image: weeklyMomentData.image,
          title: weeklyMomentData.title,
          subtitle: weeklyMomentData.subtitle,
          author: weeklyMomentData.author,
          details: `${weeklyMomentData.location} • ${weeklyMomentData.date} • ${weeklyMomentData.startTime}`,
        }}
        onDownloadImage={handleDownloadContent}
        isRTL={isRTL}
      />
    </div>
  );
}

export default WeeklyMomentsDetailsContent;
