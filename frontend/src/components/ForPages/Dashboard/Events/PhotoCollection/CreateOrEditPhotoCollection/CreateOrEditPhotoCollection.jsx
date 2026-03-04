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

import {
  BasicDetailsSection,
  ImageSection,
  FormActionsSection,
} from "./PhotoCollectionForm";

const CreateOrEditPhotoCollection = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    happened_at: "",
  });
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [errors, setErrors] = useState({});

  // Breadcrumb items
  const breadcrumbItems = [
    { label: t("Dashboard"), href: "/admin" },
    { label: t("Photo Collections"), href: "/admin/photo-collections" },
    { label: isEditMode ? t("Edit Collection") : t("Create Collection") },
  ];

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

      setFormData({
        title: collection.title || "",
        description: collection.description || "",
        happened_at: collection.happened_at || "",
      });

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

    if (!formData.title.trim()) {
      newErrors.title = t("Title is required");
    }

    if (!formData.description.trim()) {
      newErrors.description = t("Description is required");
    }

    if (!formData.happened_at) {
      newErrors.happened_at = t("Event date is required");
    }

    if (!isEditMode && newImages.length === 0 && images.length === 0) {
      newErrors.images = t("At least one image is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form handlers
  const handleTitleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      title: e.target.value,
    }));
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: null }));
    }
  };

  const handleDescriptionChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      description: e.target.value,
    }));
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: null }));
    }
  };

  const handleDateChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      happened_at: e.target.value,
    }));
    if (errors.happened_at) {
      setErrors((prev) => ({ ...prev, happened_at: null }));
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

      // Add basic data
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("happened_at", formData.happened_at);

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

      let response;
      if (isEditMode) {
        response = await EditCollectionById(id, submitData);
      } else {
        response = await CreateCollection(submitData);
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
      <div className="mt-6">
        <form
          onSubmit={handleSubmit}
          className=" p-6 space-y-8"
        >
          {/* Images */}
          <ImageSection
            images={images}
            onNewImagesChange={handleNewImagesChange}
            onAddImageUrl={handleAddImageUrl}
            onRemoveImage={handleRemoveImage}
            errors={errors}
          />
          {/* Basic Details */}
          <BasicDetailsSection
            title={formData.title}
            onTitleChange={handleTitleChange}
            description={formData.description}
            onDescriptionChange={handleDescriptionChange}
            happenedAt={formData.happened_at}
            onHappenedAtChange={handleDateChange}
            errors={errors}
          />

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
