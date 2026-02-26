import React from "react";

import { HiPlus, HiMinus } from "react-icons/hi";

const ZoomControls = ({ zoom, setZoom }) => {
  return (
    <div className="flex flex-col items-center gap-[12px] z-[100001]">
      {/* Plus Button */}
      <button
        onClick={() => setZoom(Math.min(zoom + 0.5, 3))}
        className={`w-10 h-10 flex items-center justify-center rounded-[4px] transition-all bg-[#285688] hover:opacity-90 active:scale-95 disabled:opacity-50`}
        aria-label="Zoom In"
        disabled={zoom >= 3}
      >
        <HiPlus className="w-6 h-6 text-white" />
      </button>

      {/* Vertical Slider Track */}
      <div className="h-[82px] w-4 flex flex-col items-center relative">
        {/* Backdrop for the slider track */}
        <div className="h-full w-[6px] bg-[#c2dcf7]/30 rounded-full relative" />

        {/* Progress track (from bottom to current zoom) */}
        <div
          className="absolute bottom-0 w-[6px] bg-white rounded-full transition-all duration-200"
          style={{ height: `${((zoom - 1) / 2) * 100}%` }}
        />

        {/* Handle/Thumb */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg cursor-pointer z-10 flex items-center justify-center transition-all duration-200"
          style={{
            bottom: `calc(${((zoom - 1) / 2) * 100}% - 12px)`,
          }}
        >
          <div className="w-[18px] h-[18px] bg-[#5E82AB] rounded-full" />
        </div>
      </div>

      {/* Minus Button */}
      <button
        onClick={() => setZoom(Math.max(1, zoom - 0.5))}
        className={`w-10 h-10 flex items-center justify-center rounded-[4px] transition-all hover:opacity-90 active:scale-95 ${
          zoom <= 1 ? "bg-[#c2dcf7]" : "bg-[#285688]"
        }`}
        aria-label="Zoom Out"
        disabled={zoom <= 1}
      >
        <HiMinus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default ZoomControls;
