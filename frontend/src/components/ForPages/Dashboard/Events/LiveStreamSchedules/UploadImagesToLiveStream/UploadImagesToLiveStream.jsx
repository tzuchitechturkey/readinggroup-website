import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { GetEvents, UploadEventImage, DeleteEventImage } from "@/api/events";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import AutoComplete from "@/components/Global/AutoComplete/AutoComplete";
import ImageSection from "@/components/ForPages/Dashboard/Events/PhotoCollection/CreateOrEditPhotoCollection/PhotoCollectionForm/ImageSection";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";

const UploadImagesToLiveStream = ({ onSectionChange, liveStream }) => {
  const { t } = useTranslation();

  // Images state
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [errors, setErrors] = useState({});

  // LiveStream selection state
  const [eventsList, setEventsList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = Boolean(liveStream?.id);

  // Fetch events list
  useEffect(() => {
    handleGetEventsList();
  }, []);

  // Initialize edit mode with liveStream data
  useEffect(() => {
    if (liveStream && liveStream.id) {
      setSelectedEvent({
        id: liveStream.id,
        title: liveStream.title,
      });

      if (liveStream.images && liveStream.images.length > 0) {
        setImages(liveStream.images);
      }
    }
  }, [liveStream]);

  const handleGetEventsList = async (search = "") => {
    try {
      const res = await GetEvents(10, 0, search ? { search } : {});
      const data = res.data.results.map((event) => ({
        id: event.id,
        title: event.title,
      }));
      setEventsList(data);
    } catch (err) {
      setErrorFn(err, t);
    }
  };

  const handleNewImagesChange = (files) => {
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

    if (imageToRemove?.id) {
      setDeletedImageIds((prev) => [...prev, imageToRemove.id]);
    }

    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedEvent?.id) {
      newErrors.event = t("Live Stream Schedule is required");
    }

    if (images.length === 0 && newImages.length === 0) {
      newErrors.images = t("At least one image is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("Please fix the errors in the form"));
      return;
    }

    setIsLoading(true);

    try {
      // Delete removed images
      if (deletedImageIds.length > 0) {
        await Promise.all(deletedImageIds.map((id) => DeleteEventImage(id)));
      }

      // Upload new images one by one
      if (newImages.length > 0) {
        for (const file of newImages) {
          const formData = new FormData();
          formData.append("image", file);
          formData.append("event", selectedEvent.id);
          await UploadEventImage(formData);
        }
      }

      toast.success(t("Images updated successfully"));
      setDeletedImageIds([]);
      setNewImages([]);
      onSectionChange("liveStreamSchedules");
    } catch (error) {
      console.error("Error managing event images:", error);
      toast.error(t("Failed to update images"));
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onSectionChange("liveStreamSchedules");
  };

  return (
    <div className="bg-white rounded-lg pt-3">
      {isLoading && <Loader />}

      {/* Breadcrumb */}
      <div className="px-4">
        <CustomBreadcrumb
          backTitle={t("Back to Live Stream Schedules List")}
          onBack={handleCancel}
          page={
            isEditMode
              ? t("Edit Live Stream Images")
              : t("Upload Live Stream Images")
          }
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        {/* Images Section */}
        <div className="px-4 py-3">
          <ImageSection
            images={images}
            onNewImagesChange={handleNewImagesChange}
            onAddImageUrl={handleAddImageUrl}
            onRemoveImage={handleRemoveImage}
            errors={errors}
            currentImageCount={images.length}
            isEditMode={isEditMode}
          />
        </div>

        {/* LiveStream Selection */}
        <div className="px-4 py-3">
          <AutoComplete
            label={t("Live Stream Schedule")}
            placeholder={t("Select a live stream schedule")}
            selectedItem={selectedEvent}
            onSelect={(item) => {
              setSelectedEvent(item);
              setErrors((prev) => ({ ...prev, event: null }));
            }}
            onClear={() => !isEditMode && setSelectedEvent(null)}
            list={eventsList}
            searchMethod={handleGetEventsList}
            searchApi={!isEditMode}
            searchPlaceholder={t("Search live stream schedules...")}
            error={errors.event}
            required={true}
            renderItemLabel={(item) => item.title || ""}
            disabled={isEditMode}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-4 pt-2 pb-4 border-t">
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
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? t("Saving...")
              : isEditMode
                ? t("Update Images")
                : t("Upload Images")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadImagesToLiveStream;
