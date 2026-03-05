import React from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CollectionCard = ({ collection }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigateToPhotos = () => {
    navigate(`/photo-collections/${collection.id}`, {
      state: { collectionTitle: collection.title },
    });
  };

  return (
    <div
      onClick={handleNavigateToPhotos}
      className="group cursor-pointer rounded-lg overflow-hidden bg-gray-200 hover:shadow-lg transition-shadow"
    >
      {/* Collection Image */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-300">
        <img
          src={collection?.image || collection?.image_url}
          alt={collection.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Collection Info */}
      <div className="p-4 bg-white">
        <h3 className="font-bold text-[#081945] text-base line-clamp-2">
          {collection.title}
        </h3>
        {collection.description && (
          <p className="text-sm text-[#285688] text-gray-600 mt-1 line-clamp-2">
            {collection.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default CollectionCard;
