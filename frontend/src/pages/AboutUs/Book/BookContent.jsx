import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BOOK_METADATA = {
  hero: {
    titleEn: "Check out our Special Book of 10 years!",
    titleZh: "閱上雲端",
    description:
      "To commemorate a decade of shared learning and spiritual growth, our study group created this special publication marking our 10th anniversary. This book captures the essence of our journey together—the teachings we've explored, the insights we've gained, and the community we've built. Each page reflects the dedication of our members and the transformative power of coming together to study Buddhist wisdom. More than a milestone marker, this book serves as a testament to ten years of compassionate learning and collective growth.",
    linkText: "Check out this link to further explore our special book!",
    linkUrl: "https://nanicechen.wixsite.com/bookclubonline",
    image: "https://placehold.co/600x800/e0f2fe/0369a1?text=Special+Book+Cover",
  },
  testimonials: {
    title: "See what people are saying about our book!",
    slides: [
      {
        id: 1,
        contentImage:
          "https://placehold.co/1200x600/334155/f8fafc?text=Testimonial+Slide+1",
      },
      {
        id: 2,
        contentImage:
          "https://placehold.co/1200x600/334155/f8fafc?text=Testimonial+Slide+2",
      },
      {
        id: 3,
        contentImage:
          "https://placehold.co/1200x600/334155/f8fafc?text=Testimonial+Slide+3",
      },
      {
        id: 4,
        contentImage:
          "https://placehold.co/1200x600/334155/f8fafc?text=Testimonial+Slide+4",
      },
      {
        id: 5,
        contentImage:
          "https://placehold.co/1200x600/334155/f8fafc?text=Testimonial+Slide+5",
      },
    ],
  },
  preview: {
    title: "Outer Cover Preview",
    image:
      "https://placehold.co/1200x800/f8fafc/334155?text=Outer+Cover+Layout",
  },
};

function BookContent() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const { hero, testimonials, preview } = BOOK_METADATA;
  const slides = testimonials.slides;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full bg-[#e6effb] min-h-screen py-16 lg:py-[120px] px-4 sm:px-8 xl:px-0 flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col gap-16 lg:gap-[64px]">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-[84px] items-start">
          <div className="flex-1 flex flex-col justify-start">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#112344] mb-2 leading-tight">
              {t(hero.titleEn)}
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-[#112344] mb-6">
              {t(hero.titleZh)}
            </h2>
            <p className="text-[#4a6288] leading-relaxed text-sm sm:text-base mb-8 font-medium">
              {t(hero.description)}
            </p>
            <div>
              <p className="text-[#4a6288] font-semibold mb-2">
                {t(hero.linkText)}
              </p>
              <a
                href={hero.linkUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 underline break-all font-medium transition-colors"
              >
                {hero.linkUrl}
              </a>
            </div>
          </div>
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative w-full">
              <img
                src={hero.image}
                alt={hero.titleEn}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Testimonials Carousel Section */}
        <div className="w-full flex flex-col gap-[12px]">
          <h2 className="text-2xl md:text-3xl font-bold text-[#112344]">
            {t(testimonials.title)}
          </h2>
          <div className="relative bg-[#5a6a7e] overflow-hidden w-full aspect-[16/9] xl:aspect-[1200/700]">
            <div
              className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
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
            <button onClick={prevSlide} className="text-[#a0afc0] hover:text-[#5e82ab]">
              <ChevronLeft className="w-5 h-5" />
            </button>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-[#5e82ab] w-4" : "bg-[#c0cfdf]"
                  }`}
              />
            ))}
            <button onClick={nextSlide} className="text-[#a0afc0] hover:text-[#5e82ab]">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Outer Cover Preview Section */}
        <div className="w-full flex flex-col gap-[16px] pb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#112344]">
            {t(preview.title)}
          </h2>
          <div className="w-full overflow-hidden bg-white">
            <img
              src={preview.image}
              alt={preview.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookContent;
