import React from "react";

import { useNavigate } from "react-router-dom";

import CollectionCard from "@/components/ForPages/Home/shared/CollectionCard";

import SectionHeader from "../shared/SectionHeader";

const PhotoCollections = ({ t, data }) => {
  const navigate = useNavigate();

  const handleMoreCollectionsClick = (collectionId) => {
    navigate(`/photo-collections/${collectionId}`);
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-[24px] items-stretch w-full">
        {data.map((photo) => (
          <CollectionCard
            key={photo.id}
            photo={photo}
            isNew={photo.isNew}
            handleNavigate={handleMoreCollectionsClick}
            t={t}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoCollections;
