import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { GetTeam, AddImagesToTeam, DeletePhotoFromTeam } from "@/api/team";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import AutoComplete from "@/components/Global/AutoComplete/AutoComplete";
import ImageSection from "@/components/ForPages/Dashboard/Events/PhotoCollection/CreateOrEditPhotoCollection/PhotoCollectionForm/ImageSection";

const UploadImagesToTeam = ({ onSectionChange, team }) => {
  const { t } = useTranslation();
  // Images state
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [deletedPhotoIds, setDeletedPhotoIds] = useState([]);
  const [errors, setErrors] = useState({});

  // Team selection state
  const [teamList, setTeamList] = useState([]);
  const [selectedTeamItem, setSelectedTeamItem] = useState(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);

  // Fetch team list
  useEffect(() => {
    handleGetTeamList();
  }, []);

  // Initialize edit mode with team data
  useEffect(() => {
    if (team && team.id) {
      // Set selected team item
      setSelectedTeamItem({
        id: team.id,
        title: team.title,
      });

      // Set existing images - احتفظ بالكائن الكامل مع id
      if (team.images && team.images.length > 0) {
        setImages(team.images);
      }
    }
  }, [team]);

  // Handler functions
  const handleNewImagesChange = (files) => {
    const MAX_IMAGES = team?.id ? 28 : 6; // 28 for edit mode, 6 for create mode
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

  const handleGetTeamList = async (search = "") => {
    try {
      const res = await GetTeam(10, 0, search);
      const teamData = res.data.results.map((team) => ({
        id: team.id,
        title: team.title,
      }));
      setTeamList(teamData);
    } catch (err) {
      console.error("Error fetching team:", err);
      setErrorFn(err, t);
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!selectedTeamItem?.id) {
      newErrors.team = t("Team is required");
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
          deletedPhotoIds.map((photoId) => DeletePhotoFromTeam(photoId)),
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

        await AddImagesToTeam(selectedTeamItem.id, imageFormData);
      }

      toast.success(t("Images added successfully"));
      setDeletedPhotoIds([]);
      onSectionChange("team");
    } catch (error) {
      console.error("Error adding images to team:", error);

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
    onSectionChange("team");
  };

  const MAX_IMAGES = team?.id ? 28 : 6;
  const isEditMode = Boolean(team?.id);

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

        {/* Team Selection */}
        <div className="px-4 py-3">
          <AutoComplete
            label={t("Team")}
            placeholder={t("Select a team item")}
            selectedItem={selectedTeamItem}
            onSelect={(item) => {
              setSelectedTeamItem(item);
              setErrors((prev) => ({ ...prev, team: null }));
            }}
            onClear={() => !isEditMode && setSelectedTeamItem(null)}
            list={teamList}
            searchMethod={handleGetTeamList}
            searchApi={!isEditMode}
            searchPlaceholder={t("Search team...")}
            error={errors.team}
            required={true}
            renderItemLabel={(item) => item.title || item.name || ""}
            disabled={isEditMode}
          />
        </div>

        {/* Actions */}
        {/* <FormActionsSection
          onSave={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          isEdit={isEditMode}
        /> */}
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
                ? t("Update Team")
                : t("Create Team")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadImagesToTeam;
