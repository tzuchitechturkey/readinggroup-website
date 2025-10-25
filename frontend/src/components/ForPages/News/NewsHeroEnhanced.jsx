import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { Download, Share2 } from "lucide-react";
import { toast } from "react-toastify";

import ShareModal from "@/components/Global/ShareModal/ShareModal";
import ImageControls from "@/components/Global/ImageControls/ImageControls";
import ImageModal from "@/components/Global/ImageModal/ImageModal";
import NewsCard from "@/components/ForPages/Events/NewsCard/NewsCard";
import { LikeEvent, UnlikeEvent } from "@/api/events";

const NewsHero = ({
  mainArticle = null,
  sideArticles = [],
  className = "",
}) => {
  const { t, i18n } = useTranslation();
  const [isLiked, setIsLiked] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [userId, setUserId] = useState();

  // Default data if no props are provided
  const defaultMainArticle = {
    id: 1,
    title: "Supporting Kiran's Path to Healing and Independence",
    description:
      "A young Nepali girl overcomes disability with community support, medical care, and encouragement on her journey to walk again.",
    writer: "Ai Ping Teoh",
    date: "Jan 23, 2025",
    country: "Nepal",
    image: "/testCard.png",
    category: "Health",
  };

  const defaultSideArticles = [
    {
      id: 2,
      title: "AI Breakthrough: Machines Now Write Poetry?",
      writer: "Alex Johnson",
      date: "Jan 13, 2025",
      image: "/1-top5.jpg",
    },
    {
      id: 3,
      title: "The Future of Remote Work in 2025",
      writer: "Emily Carter",
      date: "Jan 10, 2025",
      image: "/2-top5.jpg",
    },
    {
      id: 4,
      title: "The Truth About Social Media Algorithms",
      writer: "John Doe",
      date: "Jan 13, 2025",
      image: "/3-top5.jpg",
    },
    {
      id: 5,
      title: "The Truth About Social Media Algorithms",
      writer: "John Doe",
      date: "Jan 13, 2025",
      image: "/4-top5.jpg",
    },
    {
      id: 6,
      title: "The Future of Work: Are Offices a Thing of the Past?",
      writer: "Michael Torres",
      date: "Jan 13, 2025",
      image: "/testCard.png",
    },
  ];

  // Event handlers - يمكن تخصيصها حسب الحاجة
  const handleArticleClick = () => {
    // يمكن إضافة منطق التنقل هنا
  };
  // دالة الإعجاب
  const handleLike = async () => {
    try {
      if (!isLiked) {
        await LikeEvent({ user: userId, event: mainArticle?.id });
        toast.success(t("Added to favorites!"));
      } else {
        await UnlikeEvent({ user: userId, event: mainArticle?.id });
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
  // دالة تحميل الصورة
  const handleDownloadImage = () => {
    try {
      const imageUrl = article.image;
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${article.title.replace(/\s+/g, "_")}.jpg`;
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
  const article = mainArticle || defaultMainArticle;
  const articles = sideArticles.length > 0 ? sideArticles : defaultSideArticles;
  const [isShareOpen, setIsShareOpen] = useState(false);
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);
  return (
    <div
      className={`lg:flex gap-4 lg:gap-4 items-start w-full  p-4 lg:p-6 news-hero-container ${className}`}
    >
      {/* Start Main Article */}
      <div className="flex flex-col gap-6 flex-1 max-w-4xl news-hero-main">
        {/* Start TItle */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-text leading-tight tracking-tight">
          {article.title}
        </h1>
        {/* End Title */}
        {/* Start Image */}
        <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        {/* ENd Image */}
        {/* Start Description */}
        <p className="text-base md:text-lg text-text leading-relaxed">
          {article.description}
        </p>
        {/* End description */}
        {/* Start Article Info */}
        <div className="w-full flex items-center justify-between text-text border-b-2 border-blue-600/60 pb-3">
          {/* left: writer & date */}
          <div className="flex items-center gap-4">
            <span className="text-base md:text-lg">
              {t("By")} {article.writer}
            </span>
            <div className="w-px h-6 bg-white opacity-50" />
            <span className="text-base md:text-lg">{article.date}</span>
          </div>

          {/* right: country pill + image controls */}
          <div className="flex items-center gap-3">
            <span className="lg:px-3 py-1 border border-white/50 rounded-full text-text/80 backdrop-blur-sm text-sm">
              {article.country}
            </span>

            <ImageControls
              isLiked={isLiked}
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
        {articles?.map((sideArticle) => (
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
        title={article.title}
      />
      {/* End Share Modal */}

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageData={{
          image: article.image,
          title: article.title,
          subtitle: article.category,
          writer: article.writer,
          details: `${article.date} • ${article.country}`,
        }}
        onDownloadImage={handleDownloadImage}
        isRTL={i18n.language === "ar"}
      />
    </div>
  );
};

export default NewsHero;
