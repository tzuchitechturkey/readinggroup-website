import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import { GetBook } from "@/api/books";

function BookContent() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [book, bookData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await GetBook();
      bookData(res.data[0]);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % book?.reviews?.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + book?.reviews?.length) % book?.reviews?.length,
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [book?.reviews]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full bg-[#e6effb] min-h-screen py-16 lg:py-[120px] px-4 sm:px-8 xl:px-0 flex justify-center">
      {isLoading && <Loader />}
      <div className="w-full max-w-[1200px] flex flex-col gap-16 lg:gap-[64px]">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-[84px] items-start">
          <div className="flex-1 flex flex-col justify-start">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#112344] mb-2 leading-tight">
              {t(book?.title)}
            </h1>

            <div
              className="text-[#4a6288] leading-relaxed text-sm sm:text-base mb-8 font-medium"
              dangerouslySetInnerHTML={{ __html: book?.description }}
            />

            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative w-full">
                <img
                  src={book?.image}
                  alt={book?.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Carousel Section */}
        <div className="w-full flex flex-col gap-[12px]">
          <h2 className="text-2xl md:text-3xl font-bold text-[#112344]">
            {t("See what people are saying about our book!")}
          </h2>
          <div className="relative bg-[#5a6a7e] overflow-hidden w-full aspect-[16/9] xl:aspect-[1200/700]">
            <div
              className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {book?.reviews?.map((slide) => (
                <div key={slide.id} className="min-w-full h-full relative">
                  <img
                    src={slide.contentImage}
                    alt={`Slide ${slide.id}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle overlay to ensure controls remain visible if image is bright */}
                  <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>

          {/* External Dots (similar to screenshot layout) */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={prevSlide}
              className="text-[#a0afc0] hover:text-[#5e82ab]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {book?.reviews?.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "bg-[#5e82ab] w-4" : "bg-[#c0cfdf]"
                }`}
              />
            ))}
            <button
              onClick={nextSlide}
              className="text-[#a0afc0] hover:text-[#5e82ab]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Outer Cover Preview Section */}
        <div className="w-full flex flex-col gap-[16px] pb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#112344]">
            {t("Outer Cover Preview")}
          </h2>
          <div className="w-full overflow-hidden bg-white">
            <img
              src={book?.cover_image}
              alt={book?.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookContent;
