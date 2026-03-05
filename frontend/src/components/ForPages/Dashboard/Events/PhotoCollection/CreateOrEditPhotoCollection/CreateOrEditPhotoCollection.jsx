import { useState, useEffect, use } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  GetCollectionById,
  CreateCollection,
  EditCollectionById,
  GetCollections,
  AddPhotoToCollection,
} from "@/api/photoCollections";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";
import Loader from "@/components/Global/Loader/Loader";
import AutoComplete from "@/components/Global/AutoComplete/AutoComplete";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

import FormActionsSection from "./PhotoCollectionForm/FormActionsSection";
import ImageSection from "./PhotoCollectionForm/ImageSection";

const CreateOrEditPhotoCollection = ({ onSectionChange, photoCollection }) => {
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
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);

  // Load data for edit mode
  useEffect(() => {
    if (isEditMode) {
      loadPhotoCollection();
    }
  }, [id, isEditMode]);

  // Set selectedCollection from photoCollection prop
  useEffect(() => {
    if (photoCollection?.id && photoCollection?.title) {
      setSelectedCollection({
        id: photoCollection.id,
        title: photoCollection.title,
      });
    }
  }, [photoCollection]);

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

    // في وضع التعديل، الـ collection يكون من photoCollection
    // في وضع الإنشاء، يجب أن يختار المستخدم
    if (!isEditMode && !selectedCollection?.id) {
      newErrors.collection = t("Collection category is required");
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

      await AddPhotoToCollection(selectedCollection.id, submitData);

      toast.success(
        t(
          isEditMode
            ? "Collection updated successfully"
            : "Collection created successfully",
        ),
      );

      onSectionChange("photoCollections");
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
      {isLoading && <Loader />}
      {/* Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Photo Collections List")}
        onBack={() => navigate(-1)}
        page={
          isEditMode ? t("Edit Photo Collection") : t("Create Photo Collection")
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
            required={!isEditMode}
            renderItemLabel={(item) => item.title || item.name || ""}
          />
          {/* End Collections */}
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
