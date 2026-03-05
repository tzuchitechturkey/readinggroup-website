import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { GetCollections, AddPhotoToCollection } from "@/api/photoCollections";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";
import AutoComplete from "@/components/Global/AutoComplete/AutoComplete";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

import FormActionsSection from "./PhotoCollectionForm/FormActionsSection";
import ImageSection from "./PhotoCollectionForm/ImageSection";

const CreateOrEditPhotoCollection = ({ onSectionChange, photoCollection }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // State
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);

  // Initialize data from photoCollection prop in edit mode
  useEffect(() => {
    if (photoCollection?.id && photoCollection?.title) {
      setSelectedCollection({
        id: photoCollection.id,
        title: photoCollection.title,
      });
      // Load existing photos from photoCollection
      if (photoCollection?.photos) {
        setImages(photoCollection.photos);
      }
    }
  }, [photoCollection]);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    const MAX_IMAGES = 28;
    const totalImages = images.length + newImages.length;

    if (!photoCollection?.id && newImages.length === 0 && images.length === 0) {
      newErrors.images = t("At least one image is required");
    }

    // Check maximum images limit
    if (totalImages > MAX_IMAGES) {
      newErrors.images = t("Maximum 28 images allowed");
    }

    // في وضع التعديل، الـ collection يكون من photoCollection
    // في وضع الإنشاء، يجب أن يختار المستخدم
    if (!photoCollection?.id && !selectedCollection?.id) {
      newErrors.collection = t("Collection category is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNewImagesChange = (files) => {
    const MAX_IMAGES = 28;
    const totalImages = images.length + files.length;

    if (totalImages > MAX_IMAGES) {
      toast.error(
        t("Maximum 28 images allowed. You can only add {{count}} more images", {
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
      if (!photoCollection?.id && images.length > 0) {
        images.forEach((url, index) => {
          if (typeof url === "string") {
            submitData.append(`image_urls[${index}]`, url);
          }
        });
      }

      await AddPhotoToCollection(selectedCollection.id, submitData);

      toast.success(
        t(
          photoCollection?.id
            ? "Collection updated successfully"
            : "Collection created successfully",
        ),
      );

      onSectionChange("photoCollectionCategories");
    } catch (error) {
      console.error("Error saving photo collection:", error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }

      toast.error(
        t(
          photoCollection?.id
            ? "Failed to update collection"
            : "Failed to create collection",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetCollections = async (search = "") => {
    try {
      const res = await GetCollections(10, 0, search);
      const collectionsData = res.data.results.map((collection) => ({
        id: collection.id,
        title: collection.title,
      }));
      setCollections(collectionsData);
    } catch (err) {
      console.error("Error fetching collections:", err);
      setErrorFn(err, t);
    }
  };
  useEffect(() => {
    handleGetCollections();
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 mx-4 min-h-screen pb-10 overflow-y-auto">
      {/* Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Photo Collections List")}
        onBack={() => navigate(-1)}
        page={
          photoCollection?.id
            ? t("Edit Photo Collection")
            : t("Create Photo Collection")
        }
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
            maxImages={28}
            currentImageCount={images.length}
            isEditMode={Boolean(photoCollection?.id)}
          />
          {/* Basic Details */}

          {/* Start Collections */}
          <AutoComplete
            label={t("Collection Category")}
            placeholder={t("Select a collection category")}
            selectedItem={selectedCollection}
            onSelect={setSelectedCollection}
            onClear={() => setSelectedCollection(null)}
            list={collections}
            searchMethod={handleGetCollections}
            searchApi={true}
            searchPlaceholder={t("Search collections...")}
            error={errors.collection}
            required={!photoCollection?.id}
            renderItemLabel={(item) => item.title || item.name || ""}
          />
          {/* End Collections */}
          {/* Form Actions */}
          <FormActionsSection
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            isEditMode={Boolean(photoCollection?.id)}
          />
        </form>
      </div>
    </div>
  );
};

export default CreateOrEditPhotoCollection;
