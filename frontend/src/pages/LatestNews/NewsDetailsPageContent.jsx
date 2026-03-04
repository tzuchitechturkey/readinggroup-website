import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ChevronRight } from "lucide-react";

import { GetLatestNewsById, GetLatestNews } from "@/api/latestNews";
import NewsCard from "@/components/ForPages/LatestNews/NewsCard";
import ImageViewerModal from "@/components/Global/ImageViewerModal/ImageViewerModal";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

const NewsDetailsPageContent = () => {
  const { newsId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [news, setNews] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Image Viewer State
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  // Fetch news details and other news
  useEffect(() => {
    const fetchNewsData = async () => {
      setIsLoading(true);
      try {
        // Fetch news details
        const newsRes = await GetLatestNewsById(newsId);
        setNews(newsRes.data);

        // Extract images for viewer
        const newsImages = (newsRes.data.images || []).map((img) => ({
          ...img,
          image_url: img.image,
        }));
        setImages(newsImages);

        // Fetch other news (exclude current)
        const otherRes = await GetLatestNews(6, 0, "", "-happened_at");
        const filtered = (otherRes.data.results || [])
          .filter((n) => n.id !== newsId)
          .slice(0, 5);
        setOtherNews(filtered);
      } catch (err) {
        setErrorFn(err, t);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsData();
  }, [newsId, t]);

  // Image Viewer Handlers
  const openViewer = (index) => {
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  if (isLoading) return <Loader />;

  if (!news) {
    return (
      <div className="min-h-screen bg-[#D7EAFF] flex items-center justify-center">
        <p className="text-[#285688] text-lg">{t("News not found")}</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#D7EAFF] py-8 md:py-12"
      dir={i18n.dir()}
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#285688] hover:text-[#081945] transition-colors mb-6 md:mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          {t("Back to Latest News")}
        </button>

        {/* News Details Card */}
        <div className="bg-white rounded-lg p-6 md:p-8 mb-10 md:mb-14">
          {/* Date Tag */}
          {news.happened_at && (
            <span className="inline-block bg-[#E8F1F7] text-[#285688] text-xs px-3 py-1 rounded-full mb-4">
              {new Date(news.happened_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}

          {/* Title */}
          <h1 className="font-['Noto_Sans_TC:Black',sans-serif] font-black text-3xl md:text-4xl lg:text-5xl text-[#081945] mb-6">
            {news.title}
          </h1>

          {/* Description */}
          <div className="prose prose-sm md:prose max-w-none mb-8">
            <p className="text-[#285688] text-base md:text-lg leading-relaxed whitespace-pre-line">
              {news.description}
            </p>
          </div>

          {/* Images Gallery */}
          {images.length > 0 && (
            <div className="space-y-4">
              {images.map((img, index) => (
                <div
                  key={img.id || index}
                  onClick={() => openViewer(index)}
                  className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-gray-200 cursor-pointer group"
                >
                  <img
                    src={img.image}
                    alt={`${news.title} - ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="hidden group-hover:block bg-white/90 text-black px-4 py-2 rounded-lg font-semibold">
                      {t("View Details")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Other News Section */}
        {otherNews.length > 0 && (
          <div>
            <h2 className="font-['Noto_Sans_TC:Black',sans-serif] font-black text-2xl md:text-3xl text-[#081945] mb-6 uppercase">
              {t("OTHER NEWS")}
            </h2>

            <div className="flex flex-col gap-3 md:gap-4">
              {otherNews.map((n) => (
                <NewsCard key={n.id} news={n} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      <ImageViewerModal
        isOpen={isViewerOpen}
        onClose={closeViewer}
        images={images}
        currentIndex={currentImageIndex}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  );
};

export default NewsDetailsPageContent;
