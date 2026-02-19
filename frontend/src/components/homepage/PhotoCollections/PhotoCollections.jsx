import React from "react";

import SectionHeader from "../shared/SectionHeader";
import PhotoCard from "../shared/PhotoCard";
import Image from "../../../assets/photocard.png";
// Mock data for photo collections
const mockPhotosData = [
  {
    id: 1,
    date: "Jan. 21, 2026",
    image: Image,
    isNew: true,
  },
  {
    id: 2,
    date: "Dec. 31, 2025",
    image: Image,
    isNew: false,
  },
  {
    id: 3,
    date: "Dec. 24, 2025",
    image: Image,
    isNew: false,
  },
  {
    id: 4,
    date: "Dec. 17, 2025",
    image: Image,
    isNew: false,
  },
];

const PhotoCollections = ({ t }) => {
  const handleMoreCollectionsClick = () => {
    // Navigate to more collections page - implement navigation logic here
  };

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px] lg:gap-[24px] items-start px-4 sm:px-6 md:px-8 lg:px-0 w-full lg:w-[1200px] mx-auto pb-12 sm:pb-16 md:pb-20 lg:pb-24">
      {/* Section Header */}
      <SectionHeader
        title={t("PHOTO COLLECTIONS")}
        actionText={t("More Collections")}
        onActionClick={handleMoreCollectionsClick}
      />

      {/* Photo Grid */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-[24px] items-stretch flex-wrap w-full">
        {mockPhotosData.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} isNew={photo.isNew} t={t} />
        ))}
      </div>
    </div>
  );
};

export default PhotoCollections;
