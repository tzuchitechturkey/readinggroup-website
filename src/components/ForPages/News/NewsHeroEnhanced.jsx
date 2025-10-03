import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { Download, Share2 } from "lucide-react";

import ShareModal from "@/components/Global/ShareModal/ShareModal";

import NewsCard from "../Connect/NewsCard/NewsCard";

const NewsHero = ({
  mainArticle = null,
  sideArticles = [],
  className = "",
}) => {
  const { t } = useTranslation();
  // Default data if no props are provided
  const defaultMainArticle = {
    id: 1,
    title: "Supporting Kiran's Path to Healing and Independence",
    description:
      "A young Nepali girl overcomes disability with community support, medical care, and encouragement on her journey to walk again.",
    author: "Ai Ping Teoh",
    date: "Jan 23, 2025",
    country: "Nepal",
    image: "/src/assets/testCard.png",
    category: "Health",
  };

  const defaultSideArticles = [
    {
      id: 2,
      title: "AI Breakthrough: Machines Now Write Poetry?",
      author: "Alex Johnson",
      date: "Jan 13, 2025",
      image: "/src/assets/1-top5.jpg",
    },
    {
      id: 3,
      title: "The Future of Remote Work in 2025",
      author: "Emily Carter",
      date: "Jan 10, 2025",
      image: "/src/assets/2-top5.jpg",
    },
    {
      id: 4,
      title: "The Truth About Social Media Algorithms",
      author: "John Doe",
      date: "Jan 13, 2025",
      image: "/src/assets/3-top5.jpg",
    },
    {
      id: 5,
      title: "The Truth About Social Media Algorithms",
      author: "John Doe",
      date: "Jan 13, 2025",
      image: "/src/assets/4-top5.jpg",
    },
    {
      id: 6,
      title: "The Future of Work: Are Offices a Thing of the Past?",
      author: "Michael Torres",
      date: "Jan 13, 2025",
      image: "/src/assets/testCard.png",
    },
  ];

  // Event handlers - يمكن تخصيصها حسب الحاجة
  const handleArticleClick = () => {
    // يمكن إضافة منطق التنقل هنا
  };

  const article = mainArticle || defaultMainArticle;
  const articles = sideArticles.length > 0 ? sideArticles : defaultSideArticles;
  const [isShareOpen, setIsShareOpen] = useState(false);

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
        <div className="flex flex-wrap items-center gap-4 text-text">
          <span className="text-base md:text-lg">
            {t("By")} {article.author}
          </span>
          <div className="w-px h-6 bg-white opacity-50" />
          <span className="text-base md:text-lg">{article.date}</span>
          <div className="w-px h-6 bg-white opacity-50" />

          <div className="flex items-center gap-3">
            {/* Start Country */}
            <span className="px-3 py-1 border border-white/50 rounded-full text-text/80 backdrop-blur-sm text-sm">
              {article.country}
            </span>
            {/* End Country */}
            {/* Start Icons */}
            <div className="flex items-center gap-2">
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
                  src="../../../src/assets/icons/verifyAcoount.png"
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
            </div>
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
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={article.title}
        title={article.title}
      />
      {/* Start Share Modal */}
    </div>
  );
};

export default NewsHero;
