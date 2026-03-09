import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { GetLatestNews, AddImagesToLatestNews ,DeletePhotoFromNews} from "@/api/latestNews";
 import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import AutoComplete from "@/components/Global/AutoComplete/AutoComplete";
import ImageSection from "@/components/ForPages/Dashboard/Events/PhotoCollection/CreateOrEditPhotoCollection/PhotoCollectionForm/ImageSection";

import FormActionsSection from "../CreateOrEditNews/NewsForm/FormActionsSection";

const UploadImagesToNews = ({ onSectionChange, news }) => {
  const { t } = useTranslation();

  // Images state
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedPhotoIds, setDeletedPhotoIds] = useState([]);
  const [errors, setErrors] = useState({});

  // News selection state
  const [newsList, setNewsList] = useState([]);
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);

  // Fetch news list
  useEffect(() => {
    handleGetNewsList();
  }, []);

  // Initialize edit mode with news data
  useEffect(() => {
    if (news && news.id) {
      // Set selected news item
      setSelectedNewsItem({
        id: news.id,
        title: news.title,
      });

      // Set existing images - احتفظ بالكائن الكامل مع id
      if (news.images && news.images.length > 0) {
        setImages(news.images);
      }
    }
  }, [news]);

  // Handler functions
  const handleNewImagesChange = (files) => {
    const MAX_IMAGES = news?.id ? 28 : 6; // 28 for edit mode, 6 for create mode
    const totalImages = images.length + files.length;

    if (totalImages > MAX_IMAGES) {
      toast.error(
        t("Maximum {{max}} images allowed. You can only add {{count}} more images", {
          max: MAX_IMAGES,
          count: MAX_IMAGES - images.length,
        }),
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
    
    // If it's an existing photo with an ID, track it for deletion
    if (imageToRemove?.id) {
      setDeletedPhotoIds((prev) => [...prev, imageToRemove.id]);
    }
    
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGetNewsList = async (search = "") => {
    try {
      const res = await GetLatestNews(10, 0, search);
      const newsData = res.data.results.map((news) => ({
        id: news.id,
        title: news.title,
      }));
      setNewsList(newsData);
    } catch (err) {
      console.error("Error fetching news:", err);
      setErrorFn(err, t);
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!selectedNewsItem?.id) {
      newErrors.news = t("News is required");
    }

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
      // First, delete any removed photos
      if (deletedPhotoIds.length > 0) {
        await Promise.all(
          deletedPhotoIds.map((photoId) => DeletePhotoFromNews(photoId))
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

        await AddImagesToLatestNews(selectedNewsItem.id, imageFormData);
      }

      toast.success(t("Images added successfully"));
      setDeletedPhotoIds([]);
      onSectionChange("news");
    } catch (error) {
      console.error("Error adding images to news:", error);

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
    onSectionChange("news");
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

        {/* News Selection */}
        <div className="px-4 py-3">
          <AutoComplete
            label={t("News")}
            placeholder={t("Select a news item")}
            selectedItem={selectedNewsItem}
            onSelect={(item) => {
              setSelectedNewsItem(item);
              setErrors((prev) => ({ ...prev, news: null }));
            }}
            onClear={() => !isEditMode && setSelectedNewsItem(null)}
            list={newsList}
            searchMethod={handleGetNewsList}
            searchApi={!isEditMode}
            searchPlaceholder={t("Search news...")}
            error={errors.news}
            required={true}
            renderItemLabel={(item) => item.title || item.name || ""}
            disabled={isEditMode}
          />
        </div>

        {/* Actions */}
        <FormActionsSection
          onSave={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          isEdit={isEditMode}
        />
      </form>
    </div>
  );
};

export default UploadImagesToNews;
