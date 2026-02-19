import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import {
  HiX,
  HiChevronLeft,
  HiChevronRight,
  HiPlus,
  HiMinus,
} from "react-icons/hi";

const ImageViewerModal = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNext,
  onPrev,
}) => {
  const { t } = useTranslation();
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle body scroll lock and custom class
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  // Reset zoom and position when image changes
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  // Handle scroll to zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const scaleAmount = -e.deltaY * 0.001;
    const newZoom = Math.min(Math.max(1, zoom + scaleAmount), 3);
    setZoom(newZoom);
  };

  // Dragging logic
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      e.preventDefault();
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen || !mounted) return null;

  const currentImage = images[currentIndex];

  const modalContent = (
    <div className="fixed inset-0 z-[100000] bg-white flex flex-col">
      {/* Navbar / Header Area - Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-black hover:bg-gray-100 rounded-full transition-colors z-[100001]"
      >
        <HiX className="w-8 h-8" />
      </button>

      {/* Main Content Area */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Previous Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 md:left-[60px] p-3 rounded-full hover:bg-gray-100 text-black transition-all z-40 disabled:opacity-30"
          disabled={images.length <= 1}
        >
          <HiChevronLeft className="w-8 h-8" />
        </button>

        {/* Image Container */}
        <div
          className="relative flex items-center justify-center w-full h-full p-4 md:p-10 select-none"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imageRef}
            src={currentImage.image}
            alt={currentImage.title}
            className={`max-w-full max-h-full object-contain transition-transform duration-100 ease-out ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            }}
            draggable={false}
          />
        </div>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 md:right-[60px] p-3 rounded-full hover:bg-gray-100 text-black transition-all z-40 disabled:opacity-30"
          disabled={images.length <= 1}
        >
          <HiChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Right Side Zoom Controls */}
      <div className="absolute right-10 bottom-10 flex flex-col items-center gap-3 z-[100001]">
        {/* Plus Button */}
        <button
          onClick={() => setZoom(Math.min(zoom + 0.5, 3))}
          className="w-[36px] h-[36px] flex items-center justify-center rounded-full border border-black bg-white hover:bg-gray-50 transition-all shadow-sm"
          aria-label="Zoom In"
        >
          <HiPlus className="w-5 h-5 text-black" />
        </button>

        {/* Vertical Slider Track */}
        <div className="h-32 w-4 flex justify-center relative py-2">
          {/* Track Line */}
          <div className="h-full w-[1px] bg-black"></div>

          {/* Handle/Thumb */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white border border-black rounded-full shadow-sm transition-all duration-200"
            style={{
              bottom: `${((zoom - 1) / 2) * 80 + 10}%`,
            }}
          />
        </div>

        {/* Minus Button */}
        <button
          onClick={() => setZoom(Math.max(1, zoom - 0.5))}
          className="w-[36px] h-[36px] flex items-center justify-center rounded-full border border-black bg-white hover:bg-gray-50 transition-all shadow-sm"
          aria-label="Zoom Out"
        >
          <HiMinus className="w-5 h-5 text-black" />
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ImageViewerModal;
