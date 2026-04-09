import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  GetEvents,
  AddEventImage,
  DeleteEventImageByEventId,
} from "@/api/events";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import AutoComplete from "@/components/Global/AutoComplete/AutoComplete";
import ImageSection from "@/components/ForPages/Dashboard/Events/PhotoCollection/CreateOrEditPhotoCollection/PhotoCollectionForm/ImageSection";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";

// Extract language variants from a parent event object (all keys except "id")
const extractLanguages = (event) => {
  const languages = {};
  Object.keys(event).forEach((key) => {
    if (key !== "id" && event[key] && typeof event[key] === "object") {
      languages[key] = event[key];
    }
  });
  return languages;
};

const UploadImagesToLiveStream = ({ onSectionChange, liveStream }) => {
  const { t } = useTranslation();

  // Images state
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [errors, setErrors] = useState({});

  // Selection state
  const [eventsList, setEventsList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // parent event
  const [selectedLanguage, setSelectedLanguage] = useState(null); // e.g. "ar", "tr"

  // UI state
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = Boolean(liveStream?.id);

  // The language-specific event object (has the real id used for image upload)
  const selectedLangEvent =
    selectedEvent && selectedLanguage
      ? selectedEvent.languages[selectedLanguage]
      : null;

  const availableLanguages = selectedEvent
    ? Object.keys(selectedEvent.languages)
    : [];

  useEffect(() => {
    handleGetEventsList();
  }, []);

  // Initialize edit mode
  useEffect(() => {
    if (liveStream && liveStream.id) {
      setSelectedEvent({
        id: liveStream.id,
        title: liveStream.title,
        languages: {},
      });

      if (liveStream.images && liveStream.images.length > 0) {
        setImages(liveStream.images);
      }
    }
  }, [liveStream]);

  const handleGetEventsList = async (search = "") => {
    try {
      const res = await GetEvents(10, 0, search ? { search } : {});
      const data = res.data.results.map((event) => {
        const languages = extractLanguages(event);
        const firstLang = Object.values(languages)[0];
        return {
          id: event.id,
          title: firstLang?.title || `Event #${event.id}`,
          languages,
        };
      });
      setEventsList(data);
    } catch (err) {
      setErrorFn(err, t);
    }
  };

  const handleSelectEvent = (item) => {
    setSelectedEvent(item);
    setSelectedLanguage(null);
    setImages([]);
    setNewImages([]);
    setDeletedImageIds([]);
    setErrors((prev) => ({ ...prev, event: null, language: null }));
  };

  const handleSelectLanguage = (lang) => {
    setSelectedLanguage(lang);
    setErrors((prev) => ({ ...prev, language: null }));

    // Load existing images for this language variant
    const langEvent = selectedEvent?.languages[lang];
    if (langEvent?.images) {
      setImages(langEvent.images);
    } else {
      setImages([]);
    }
    setNewImages([]);
    setDeletedImageIds([]);
  };

  const handleNewImagesChange = (files) => {
    setNewImages(Array.from(files));
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

    if (!selectedLanguage && !isEditMode) {
      newErrors.language = t("Language is required");
    }

    if (images.length === 0 && newImages.length === 0) {
      newErrors.images = t("At least one image is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT - images:", images, "newImages:", newImages);

    if (!validateForm()) {
      toast.error(t("Please fix the errors in the form"));
      return;
    }

    setIsLoading(true);

    // Use language-specific event id when available, fallback to parent id (edit mode)
    const targetEventId = selectedLangEvent?.id ?? selectedEvent?.id;

    try {
      if (deletedImageIds.length > 0) {
        await Promise.all(
          deletedImageIds.map((id) =>
            DeleteEventImageByEventId(targetEventId, id),
          ),
        );
      }


      if (newImages.length > 0) {
        for (const file of newImages) {
          const formData = new FormData();
          formData.append("image", file);
          await AddEventImage(targetEventId, formData);
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
            key={selectedLanguage ?? "default"}
            images={images}
            onNewImagesChange={handleNewImagesChange}
            onAddImageUrl={handleAddImageUrl}
            onRemoveImage={handleRemoveImage}
            errors={errors}
            currentImageCount={images.length}
            isEditMode={isEditMode}
          />
        </div>

        {/* Event Selection */}
        <div className="px-4 py-3">
          <AutoComplete
            label={t("Live Stream Schedule")}
            placeholder={t("Select a live stream schedule")}
            selectedItem={selectedEvent}
            onSelect={handleSelectEvent}
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

        {/* Language Selection — shown after an event is picked */}
        {!isEditMode && selectedEvent && availableLanguages.length > 0 && (
          <div className="px-4 py-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Language")} <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleSelectLanguage(lang)}
                  className={`px-4 py-2 rounded-lg border font-medium text-sm transition-colors ${
                    selectedLanguage === lang
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            {errors.language && (
              <p className="mt-1 text-sm text-red-500">{errors.language}</p>
            )}
          </div>
        )}

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
