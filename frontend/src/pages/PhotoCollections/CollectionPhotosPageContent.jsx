import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

import {
  GetCollectionById,
  GetPhotosByCollectionId,
} from "@/api/photoCollections";
import PhotoCard from "@/components/ForPages/PhotoCollections/PhotoCard";
import ImageViewerModal from "@/components/Global/ImageViewerModal/ImageViewerModal";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

const CollectionPhotosPageContent = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [collection, setCollection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Image Viewer State
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch collection and photos
  useEffect(() => {
    const fetchCollectionData = async () => {
      setIsLoading(true);
      try {
        // Fetch collection details
        const collectionRes = await GetCollectionById(collectionId);
        setCollection(collectionRes.data);

        // Fetch photos for this collection - no limit since max 28 photos
        // const photosRes = await GetPhotosByCollectionId(collectionId, {});
      } catch (err) {
        setErrorFn(err, t);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectionData();
  }, [collectionId, t]);

  // Image Viewer Handlers
  const openViewer = (index) => {
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === collection?.photos.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? collection?.photos.length - 1 : prev - 1,
    );
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month}. ${day}, ${year}`;
  };
  return (
    <div className="min-h-screen bg-[#D7EAFF] py-8 md:py-12" dir={i18n.dir()}>
      {isLoading && <Loader />}

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#285688] hover:text-[#081945] text-base lg:text-xl transition-colors mb-6 md:mb-8 font-semibold"
        >
          <ArrowLeft className="w-6 h-6" />
          {t("Back to Photo Collections")}
        </button>

        {/* Collection Header */}
        {collection && (
          <div className="mb-10 md:mb-14">
            <h1 className="font-['Noto_Sans_TC:Black',sans-serif] font-black text-3xl md:text-4xl  text-[#081945] mb-3">
              {formatDate(collection.happened_at)}
            </h1>
          </div>
        )}

        {/* Photos Grid */}
        {collection?.photos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
            {collection.photos.map((photo, index) => (
              <PhotoCard
                key={photo.id || index}
                photo={photo}
                onClick={() => openViewer(index)}
                t={t}
              />
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-20">
              <p className="text-[#285688] text-lg">{t("No photos found")}</p>
            </div>
          )
        )}
      </div>

      {/* Image Viewer Modal */}
      <ImageViewerModal
        isOpen={isViewerOpen}
        onClose={closeViewer}
        images={collection?.photos || []}
        currentIndex={currentImageIndex}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  );
};

export default CollectionPhotosPageContent;
