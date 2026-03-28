import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  GetHistory,
  AddHistoryImage,
  DeleteHistoryImageById,
} from "@/api/history";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import AutoComplete from "@/components/Global/AutoComplete/AutoComplete";
import ImageSection from "@/components/ForPages/Dashboard/Events/PhotoCollection/CreateOrEditPhotoCollection/PhotoCollectionForm/ImageSection";
import FormActionsSection from "../../Events/News/CreateOrEditNews/NewsForm/FormActionsSection";

const UploadImagesToHistory = ({ onSectionChange, history }) => {
  const { t } = useTranslation();
  console.log(history);
  // Images state
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedPhotoIds, setDeletedPhotoIds] = useState([]);
  const [errors, setErrors] = useState({});
  const [historyList, setHistoryList] = useState([]);
  // History selection state
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);

  // Fetch history list
  useEffect(() => {
    handleGetHistoryList();
  }, []);

  // Initialize edit mode with history data
  useEffect(() => {
    if (history && history.id) {
      // Set selected history item
      setSelectedHistoryItem({
        id: history.id,
        title: history.title,
      });

      // Set existing images - احتفظ بالكائن الكامل مع id
      if (history.images && history.images.length > 0) {
        setImages(history.images);
      }
    }
  }, [history]);

  // Handler functions
  const handleNewImagesChange = (files) => {
    const MAX_IMAGES = history?.id ? 28 : 6; // 28 for edit mode, 6 for create mode
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

    // If it's an existing photo with an ID, track it for deletion
    if (imageToRemove?.id) {
      setDeletedPhotoIds((prev) => [...prev, imageToRemove.id]);
    }

    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGetHistoryList = async (search = "") => {
    try {
      const res = await GetHistory(10, 0, search);
      const historyData = res?.data?.map((history) => ({
        id: history.id,
        title: history.title,
      }));
      setHistoryList(historyData);
    } catch (err) {
      console.error("Error fetching history:", err);
      setErrorFn(err, t);
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!selectedHistoryItem?.id) {
      newErrors.history = t("History event is required");
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
          deletedPhotoIds.map((photoId) => DeleteHistoryImageById(photoId)),
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

        await AddHistoryImage(selectedHistoryItem.id, imageFormData);
      }

      toast.success(t("Images added successfully"));
      setDeletedPhotoIds([]);
      onSectionChange("history");
    } catch (error) {
      console.error("Error adding images to history:", error);

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
    onSectionChange("history");
  };

  const MAX_IMAGES = history?.id ? 28 : 6;
  const isEditMode = Boolean(history?.id);

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

        {/* History Event Selection */}
        <div className="px-4 py-3">
          <AutoComplete
            label={t("History Event")}
            placeholder={t("Select a history event")}
            selectedItem={selectedHistoryItem}
            onSelect={(item) => {
              setSelectedHistoryItem(item);
              setErrors((prev) => ({ ...prev, history: null }));
            }}
            onClear={() => !isEditMode && setSelectedHistoryItem(null)}
            list={historyList}
            searchMethod={handleGetHistoryList}
            searchApi={!isEditMode}
            searchPlaceholder={t("Search history events...")}
            error={errors.history}
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

export default UploadImagesToHistory;
