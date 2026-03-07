import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, ChevronLeft, ArrowLeft, ChevronRight } from "lucide-react";

import { GetLatestNewsById } from "@/api/latestNews";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import OtherNewsSection from "@/components/ForPages/LatestNews/OtherNewsSection/OtherNewsSection";

const NewsDetailsPageContent = () => {
  const { newsId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [news, setNews] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [imageCarouselApi, setImageCarouselApi] = useState(null);
  const [count, setCount] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [current, setCurrent] = useState(0);
  // Update count when data changes and ensure buttons are enabled
  useEffect(() => {
    setCount(news?.images?.length || 0);
  }, [news?.images]);

  // Listen to carousel changes and update UI state
  useEffect(() => {
    if (!imageCarouselApi) {
      return;
    }

    const updateCarouselState = () => {
      setCurrent(imageCarouselApi.selectedScrollSnap());
      setCanPrev(imageCarouselApi.canScrollPrev());
      setCanNext(imageCarouselApi.canScrollNext());
    };

    // Set initial state
    updateCarouselState();

    // Add listener for when carousel selection changes
    imageCarouselApi.on("select", updateCarouselState);

    return () => {
      // Cleanup: remove listener when component unmounts or API changes
      imageCarouselApi.off("select", updateCarouselState);
    };
  }, [imageCarouselApi]);

  // Fetch news details and other news
  useEffect(() => {
    const fetchNewsData = async () => {
      setIsLoading(true);
      try {
        // Fetch news details
        const newsRes = await GetLatestNewsById(newsId);
        setNews(newsRes.data);
      } catch (err) {
        setErrorFn(err, t);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsData();
  }, [newsId, t]);

  if (!news) {
    return (
      <div className="min-h-screen bg-[#D7EAFF] flex items-center justify-center">
        <p className="text-[#285688] text-lg">{t("News not found")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D7EAFF] py-8 md:py-12" dir={i18n.dir()}>
      {isLoading && <Loader />}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#285688] hover:text-[#081945] transition-colors mb-6 md:mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          {t("Back to Latest News")}
        </button>

        {/* News Details Card */}
        <div className="rounded-lg px-1 md:px-0 md:py-8 mb-10 md:mb-14 flex flex-col gap-2.5 md:gap-3">
          {/* Start Is New */}
          <div className="px-4 py-[3px] w-fit rounded-full border-[1px] border-[#081945]">
            <p className="text-[#081945]">{t("NEW")}</p>
          </div>
          {/* End Is New */}
          {/* Date Tag */}
          {news.happened_at && (
            <span className="inline-block  text-[#081945] font-bold  rounded-full">
              {new Date(news.happened_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}

          {/* Title */}
          <h1 className="font-['Noto_Sans_TC:Black',sans-serif] font-black text-2xl md:text-3xl lg:text-5xl text-[#081945] md:mb-6">
            {news.title}
          </h1>

          {/* Description */}
          <div className="prose prose-sm md:prose max-w-none mb-4 md:my-6">
            <p className="text-[#285688] text-base md:text-lg leading-relaxed whitespace-pre-line">
              {news.description}
            </p>
          </div>

          <Carousel
            className="mt-20 md:mt-10 lg:mt-0"
            opts={{
              align: "center",
              loop: false,
            }}
            setApi={setImageCarouselApi}
          >
            <CarouselContent>
              {news?.images?.map((imageItem, index) => (
                <CarouselItem key={index}>
                  <div className="lg:h-[550px]  bg-gray-200 overflow-hidden  cursor-pointer relative">
                    <img
                      src={imageItem?.image}
                      alt={`${imageItem?.title} - ${index + 1}`}
                      className="w-full h-[221px] lg:h-full object-cover object-top  transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="flex items-center   justify-center gap-3 sm:gap-3 md:gap-4 lg:gap-4 mt-3 sm:mt-3 md:mt-4 lg:mt-4">
            {/* السابق */}
            <button
              onClick={() => imageCarouselApi?.scrollPrev()}
              disabled={!canPrev}
              className={`p-0.5 sm:p-0.5 md:p-1 lg:p-1 rounded-full ${
                canPrev ? "hover:scale-110" : "opacity-40 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="text-[#5E82AB] w-4 md:w-5 lg:w-5 h-4 md:h-5 lg:h-5" />
            </button>

            {/* dots */}
            {count > 0 && (
              <div className="flex gap-2 sm:gap-2 md:gap-2.5 lg:gap-3 items-center min-h-[12px] px-2">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => imageCarouselApi?.scrollTo(index)}
                    className={`transition-all duration-300 rounded-full flex-shrink-0 ${
                      current === index
                        ? "bg-[#5E82AB] w-8 h-2.5 sm:w-4 sm:h-3 md:w-6 lg:w-8 "
                        : "w-2 h-2 sm:w-2 sm:h-2 md:w-2 md:h-2 lg:w-2 lg:h-2 bg-[#92A9C3] hover:bg-white/70"
                    }`}
                    aria-label={`Go to item ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* التالي */}
            <button
              onClick={() => imageCarouselApi?.scrollNext()}
              disabled={!canNext}
              className={`p-0.5 sm:p-0.5 md:p-1 lg:p-1 rounded-full ${
                canNext ? "hover:scale-110" : "opacity-40 cursor-not-allowed"
              }`}
            >
              <ChevronRight className="text-[#5E82AB] w-4 sm:w-4 md:w-5 lg:w-5 h-4 sm:h-4 md:h-5 lg:h-5" />
            </button>
          </div>
        </div>

        {/* Start Other New Section */}
        <OtherNewsSection t={t} newsId={newsId} />
        {/* End Other New Section */}
      </div>
    </div>
  );
};

export default NewsDetailsPageContent;
