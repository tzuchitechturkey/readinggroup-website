import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { CreateLatestNews, EditLatestNewsById } from "@/api/latestNews";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";

import {
  BasicDetailsSection,
  ImagesSection,
  FormActionsSection,
} from "./NewsForm";

const CreateOrEditNews = ({ selectedNews, onSectionChange }) => {
  const { t, i18n } = useTranslation();
  const isEdit = Boolean(selectedNews);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    happened_at: "",
  });

  // Images state
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([""]);
  const [imageMode, setImageMode] = useState("files"); // "files" or "urls"

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form data for edit mode
  useEffect(() => {
    if (selectedNews) {
      setFormData({
        title: selectedNews.title || "",
        description: selectedNews.description || "",
        happened_at: selectedNews.happened_at
          ? selectedNews.happened_at.split("T")[0]
          : "",
      });

      // Set images
      if (selectedNews.images && selectedNews.images.length > 0) {
        // If editing, assume URLs mode with existing images
        const existingUrls = selectedNews.images.map((img) => img.image);
        setImageUrls(existingUrls);
        setImageMode("urls");
      }
    } else {
      // Reset for create mode
      setFormData({
        title: "",
        description: "",
        happened_at: "",
      });
      setImageFiles([]);
      setImageUrls([""]);
      setImageMode("files");
    }
  }, [selectedNews]);

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
      newErrors.happened_at = t("Date is required");
    }

    // Images validation
    // if (imageMode === "files") {
    //   if (imageFiles.length === 0) {
    //     newErrors.images = t("At least one image is required");
    //   }
    // } else {
    //   const validUrls = imageUrls.filter((url) => url.trim());
    //   if (validUrls.length === 0) {
    //     newErrors.images = t("At least one image URL is required");
    //   }
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("Please fill in all required fields"));
      return;
    }

    setIsLoading(true);

    try {
      // Prepare FormData
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("happened_at", formData.happened_at);

      // if (imageMode === "files") {
      //   // Append image files
      //   imageFiles.forEach((file, index) => {
      //     submitData.append("images", file);
      //   });
      // } else {

      //   // Send as JSON for URLs
      //   const jsonData = {
      //     ...formData,
      //     image_urls: imageUrls.filter((url) => url.trim()),
      //   };
      const jsonData = {
        title: formData.title,
        description: formData.description,
        happened_at: formData.happened_at,
      };

      if (isEdit) {
        await EditLatestNewsById(selectedNews.id, jsonData);
      } else {
        await CreateLatestNews(jsonData);
      }

      toast.success(
        isEdit
          ? t("News updated successfully")
          : t("News created successfully"),
      );
      onSectionChange("newsList");

      // }

      // For file uploads
      // if (isEdit) {
      //   await EditLatestNewsById(selectedNews.id, submitData);
      // } else {
      //   await CreateLatestNews(submitData);
      // }

      // toast.success(
      //   isEdit
      //     ? t("News updated successfully")
      //     : t("News created successfully"),
      // );
      // onSectionChange("newsList");
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onSectionChange("newsList");
  };

  const handleImageModeChange = (mode) => {
    setImageMode(mode);
    // Clear the other mode's data
    if (mode === "files") {
      setImageUrls([""]);
    } else {
      setImageFiles([]);
    }
    // Clear errors
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 pt-3 px-3"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}

      {/* Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to News List")}
        onBack={() => onSectionChange("newsList")}
        page={isEdit ? t("Edit News") : t("Create News")}
      />

      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-[#1D2630]">
          {isEdit ? t("Edit News") : t("Create New News")}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {isEdit
            ? t("Update the news information below")
            : t("Fill in the information below to create a new news item")}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Basic Details */}
        <BasicDetailsSection
          title={formData.title}
          onTitleChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          description={formData.description}
          onDescriptionChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          happenedAt={formData.happened_at}
          onHappenedAtChange={(e) =>
            setFormData({ ...formData, happened_at: e.target.value })
          }
          errors={errors}
        />

        {/* Images */}
        {/* <ImagesSection
          imageFiles={imageFiles}
          imageUrls={imageUrls}
          onImageFilesChange={setImageFiles}
          onImageUrlsChange={setImageUrls}
          imageMode={imageMode}
          onImageModeChange={handleImageModeChange}
          errors={errors}
        /> */}

        {/* Actions */}
        <FormActionsSection
          onSave={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          isEdit={isEdit}
        />
      </form>
    </div>
  );
};

export default CreateOrEditNews;
