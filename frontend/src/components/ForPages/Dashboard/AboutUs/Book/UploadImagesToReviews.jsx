import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { GetBook, AddBookReview, DeleteBookReviewById } from "@/api/books";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import ImageSection from "@/components/ForPages/Dashboard/Events/PhotoCollection/CreateOrEditPhotoCollection/PhotoCollectionForm/ImageSection";

const UploadImagesToReviews = ({ onSectionChange, news }) => {
  const { t } = useTranslation();

  // Images state
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedPhotoIds, setDeletedPhotoIds] = useState([]);
  const [errors, setErrors] = useState({});
  const [book, setBook] = useState();

  // UI state
  const [isLoading, setIsLoading] = useState(false);

  // Initialize edit mode with news data
  useEffect(() => {
    const fetchBook = async () => {
      setIsLoading(true);
      try {
        const res = await GetBook();
        setBook(res.data[0]);
        // Set existing images - احتفظ بالكائن الكامل مع id
        if (res.data[0].reviews && res.data[0].reviews.length > 0) {
          setImages(res.data[0].reviews);
        }
      } catch (error) {
        setErrorFn(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, []);

  // Handler functions
  const handleNewImagesChange = (files) => {
    const MAX_IMAGES = book?.id ? 28 : 6; // 28 for edit mode, 6 for create mode
    const totalImages = images.length + files.length;

    if (totalImages > MAX_IMAGES) {
      toast.error(
        t(
          "Maximum {{max}} images allowed. You can only add {{count}} more images",
          {
            max: MAX_IMAGES,
            count: MAX_IMAGES - images.length,
          },
        ),
      );
      return;
    }

    setNewImages(files);
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: null }));
    }
  };

  const handleAddImageUrl = (url) => {
    setImages((prev) => [...prev, url]);
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: null }));
    }
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = images[index];

    // If it's an existing review with an ID, track it for deletion
    if (imageToRemove?.id) {
      setDeletedPhotoIds((prev) => [...prev, imageToRemove.id]);
    }

    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (images.length === 0 && newImages.length === 0) {
      newErrors.images = t("At least one image is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("Please fix the errors in the form"));
      return;
    }

    setIsLoading(true);

    try {
      // First, delete any removed reviews
      if (deletedPhotoIds.length > 0) {
        await Promise.all(
          deletedPhotoIds.map((photoId) => DeleteBookReviewById(photoId)),
        );
      }

      // Then, add images
      if (newImages.length > 0 || images.length > 0) {
        const imageFormData = new FormData();

        // Add new image files
        newImages.forEach((file) => {
          imageFormData.append("images", file);
        });

        // Add image URLs from new images added via URL input (string type)
        images.forEach((img, index) => {
          // Only add if it's a string URL (not an existing photo object)
          if (typeof img === "string") {
            imageFormData.append(`image_urls[${index}]`, img);
          }
        });

        await AddBookReview(book.id, imageFormData);
      }

      toast.success(t("Images added successfully"));
      setDeletedPhotoIds([]);
      onSectionChange("book");
    } catch (error) {
      console.error("Error adding images to book:", error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      toast.error(t("Failed to add images"));
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onSectionChange("book");
  };

  const MAX_IMAGES = news?.id ? 28 : 6;
  const isEditMode = Boolean(news?.id);

  return (
    <div className="bg-white rounded-lg pt-3">
      {isLoading && <Loader />}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images Section */}
        <div className="px-4 py-3">
          <ImageSection
            images={images}
            onNewImagesChange={handleNewImagesChange}
            onAddImageUrl={handleAddImageUrl}
            onRemoveImage={handleRemoveImage}
            errors={errors}
            maxImages={MAX_IMAGES}
            currentImageCount={images.length}
            isEditMode={isEditMode}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? t("Saving...")
              : isEditMode
                ? t("Update Review")
                : t("Create Review")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadImagesToReviews;
