import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  GetCollectionById,
  CreateCollection,
  EditCollectionById,
} from "@/api/photoCollections";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";
import Loader from "@/components/Global/Loader/Loader";

import FormActionsSection from "./PhotoCollectionForm/FormActionsSection";
import ImageSection from "./PhotoCollectionForm/ImageSection";

const CreateOrEditPhotoCollection = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [errors, setErrors] = useState({});

  // Load data for edit mode
  useEffect(() => {
    if (isEditMode) {
      loadPhotoCollection();
    }
  }, [id, isEditMode]);

  const loadPhotoCollection = async () => {
    setIsLoading(true);
    try {
      const response = await GetCollectionById(id);
      const collection = response.data;

      setImages(collection.images || []);
    } catch (error) {
      console.error("Error loading photo collection:", error);
      toast.error(t("Failed to load collection data"));
      navigate("/admin/photo-collections");
    } finally {
      setIsLoading(false);
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!isEditMode && newImages.length === 0 && images.length === 0) {
      newErrors.images = t("At least one image is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("Please fix the errors in the form"));
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      // Add new files if any
      newImages.forEach((file) => {
        submitData.append("images", file);
      });

      // Add existing image URLs if any (for create mode with URL images)
      if (!isEditMode && images.length > 0) {
        images.forEach((url, index) => {
          if (typeof url === "string") {
            submitData.append(`image_urls[${index}]`, url);
          }
        });
      }

      if (isEditMode) {
        await EditCollectionById(id, submitData);
      } else {
        await CreateCollection(submitData);
      }

      toast.success(
        t(
          isEditMode
            ? "Collection updated successfully"
            : "Collection created successfully",
        ),
      );

      navigate("/admin/photo-collections");
    } catch (error) {
      console.error("Error saving photo collection:", error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      toast.error(
        t(
          isEditMode
            ? "Failed to update collection"
            : "Failed to create collection",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 mx-4 min-h-screen pb-10 overflow-y-auto">
      {isLoading && <Loader />}
      {/* Breadcrumb */}
      <CustomBreadcrumb
        backTitle="Back to Learn List"
        onBack={() => {
          onSectionChange("learn");
        }}
        page={isEditMode ? "Edit Learn" : "Create New Learn"}
      />
      <div className="">
        <form onSubmit={handleSubmit} className="  space-y-6">
          {/* Images */}
          <ImageSection
            images={images}
            onNewImagesChange={handleNewImagesChange}
            onAddImageUrl={handleAddImageUrl}
            onRemoveImage={handleRemoveImage}
            errors={errors}
          />
          {/* Basic Details */}

          {/* Form Actions */}
          <FormActionsSection
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            isEditMode={isEditMode}
          />
        </form>
      </div>
    </div>
  );
};

export default CreateOrEditPhotoCollection;
