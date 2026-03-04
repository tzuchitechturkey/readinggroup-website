import React from "react";

const PhotoCard = ({ photo, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative w-full h-40 md:h-48 lg:h-56 rounded-lg overflow-hidden bg-gray-200 cursor-pointer"
    >
      <img
        src={photo?.image || photo?.image_url}
        alt="Photo"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
        <div className="hidden group-hover:block bg-white/90 text-black px-3 py-1 rounded text-sm font-semibold">
          View
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
