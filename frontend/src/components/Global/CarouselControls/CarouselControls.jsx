import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * A reusable component for carousel controls including dots and arrow buttons.
 *
 * @param {boolean} canPrev - Whether the carousel can scroll back.
 * @param {boolean} canNext - Whether the carousel can scroll forward.
 * @param {function} onPrev - Function to call for previous slide.
 * @param {function} onNext - Function to call for next slide.
 * @param {number} count - Total number of slides.
 * @param {number} current - Index of current slide.
 * @param {function} onDotClick - Function to call when a dot is clicked.
 */
const CarouselControls = ({
  canPrev,
  canNext,
  onPrev,
  onNext,
  count,
  current,
  onDotClick,
  activeClass = "bg-white",
  inactiveClass = "bg-[#92A9C3]",
  buttonClass = "text-white",
}) => {
  if (count <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-3 md:gap-4 lg:gap-4 mt-3 sm:mt-3 md:mt-4 lg:mt-4">
      {/* Previous Button */}
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className={`p-0.5 sm:p-0.5 md:p-1 lg:p-1 rounded-full transition-all duration-200 ${
          canPrev
            ? `hover:scale-110 active:scale-95 ${buttonClass}`
            : `opacity-40 cursor-not-allowed ${buttonClass}/50`
        }`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4  h-4" />
      </button>

      {/* Dots/Indicators */}
      <div className="flex gap-2 sm:gap-2 md:gap-2.5 lg:gap-3 items-center min-h-[12px] px-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onDotClick(index)}
            className={`transition-all duration-300 rounded-full flex-shrink-0 ${
              current === index
                ? `${activeClass}  w-2.5 h-2.5`
                : `${inactiveClass} w-2 h-2 hover:opacity-80`
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className={`p-0.5 sm:p-0.5 md:p-1 lg:p-1 rounded-full transition-all duration-200 ${
          canNext
            ? `hover:scale-110 active:scale-95 ${buttonClass}`
            : `opacity-40 cursor-not-allowed ${buttonClass}/50`
        }`}
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 sm:w-4 md:w-5 lg:w-5 h-4 sm:h-4 md:h-5 lg:h-5" />
      </button>
    </div>
  );
};

export default CarouselControls;
