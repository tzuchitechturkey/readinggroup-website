import React, { useState, useEffect, useRef } from "react";

import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";

import ZoomControls from "./ZoomControls";

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

  // Touch tracking states
  const [touchStartX, setTouchStartX] = useState(null);
  const [lastTouchDistance, setLastTouchDistance] = useState(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleClose = () => {
    if (zoom === 1) {
      onClose();
    }
  };

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
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose, onPrev, onNext]);

  // Handle scroll to zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const scaleAmount = -e.deltaY * 0.001;
    const newZoom = Math.min(Math.max(1, zoom + scaleAmount), 3);
    setZoom(newZoom);
  };

  // Dragging and Panning logic
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
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

  // Mobile Touch Logic
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      // Single touch for swiping or panning
      setTouchStartX(e.touches[0].clientX);
      if (zoom > 1) {
        setIsDragging(true);
        setStartPos({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y,
        });
      }
    } else if (e.touches.length === 2) {
      // Two fingers for pinch to zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      setLastTouchDistance(distance);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging && zoom > 1) {
      // Panning while zoomed in
      setPosition({
        x: e.touches[0].clientX - startPos.x,
        y: e.touches[0].clientY - startPos.y,
      });
    } else if (e.touches.length === 2 && lastTouchDistance) {
      // Pinch to zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      const delta = distance - lastTouchDistance;
      const scaleAmount = delta * 0.01;
      const newZoom = Math.min(Math.max(1, zoom + scaleAmount), 3);
      setZoom(newZoom);
      setLastTouchDistance(distance);
    }
  };

  const handleTouchEnd = (e) => {
    setIsDragging(false);
    setLastTouchDistance(null);

    // Only handle swipe if at 1x zoom
    if (zoom === 1 && touchStartX !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchStartX - touchEndX;

      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          onNext(); // swipe left -> next
        } else {
          onPrev(); // swipe right -> prev
        }
      }
    }
    setTouchStartX(null);
  };

  if (!isOpen || !mounted) return null;

  const currentImage = images[currentIndex];

  // Robustly handle if currentImage is a string or an object with an image property
  const imgSrc =
    typeof currentImage === "string" ? currentImage : currentImage?.image;
  const imgAlt =
    typeof currentImage === "string" ? "Tzu Chi Content" : currentImage?.title;

  const modalContent = (
    <div className="fixed inset-0 z-[100000] bg-[rgba(22,33,58,0.95)] backdrop-blur-[3px] flex items-center justify-center">
      {/* Container for Arrows and Image */}
      <div className="relative max-w-[1200px] w-full h-full flex items-center justify-between px-4 md:px-10">
        {/* Previous Button - hidden on small mobile screen when not zoomed to allow swiping */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="hidden md:flex p-3 rounded-full hover:bg-white/10 text-white transition-all z-40 disabled:opacity-30"
          disabled={images.length <= 1}
        >
          <HiChevronLeft className="w-12 h-12" />
        </button>

        {/* Image Container */}
        <div
          className="relative flex-1 flex items-center justify-center h-full p-0 md:p-10 select-none overflow-hidden touch-none"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            ref={imageRef}
            src={imgSrc}
            alt={imgAlt}
            className={`max-w-full max-h-full object-contain transition-transform duration-100 ease-out select-none ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              WebkitTouchCallout: "none",
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
          className="hidden md:flex p-3 rounded-full hover:bg-white/10 text-white transition-all z-40 disabled:opacity-30"
          disabled={images.length <= 1}
        >
          <HiChevronRight className="w-12 h-12" />
        </button>
      </div>

      {/* Close and Zoom Controls Side Column */}
      <div className="absolute top-[29px] right-4 md:right-[68px] h-[calc(100vh-58px)] flex flex-col items-center pointer-events-none z-[100001] w-9 md:w-[37px]">
        {/* Close Button - needs pointer-events-auto */}
        <button
          onClick={handleClose}
          disabled={zoom > 1}
          className={`p-1 text-white hover:bg-white/10 rounded-full transition-all pointer-events-auto mb-auto ${
            zoom > 1 ? "opacity-20 cursor-not-allowed scale-75" : "opacity-100"
          }`}
        >
          <HiX className="w-8 h-8 md:w-[32px] md:h-[32px]" />
        </button>

        {/* Zoom Controls Area - only visible on desktop or larger screens */}
        <div className="hidden md:block pb-0 pointer-events-auto">
          <ZoomControls zoom={zoom} setZoom={setZoom} />
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ImageViewerModal;
