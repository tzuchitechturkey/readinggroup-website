import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { CreateLatestNews, EditLatestNewsById } from "@/api/latestNews";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";

import BasicDetailsSection from "./NewsForm/BasicDetailsSection";
import FormActionsSection from "./NewsForm/FormActionsSection";

const CreateOrEditNews = ({
  selectedNews,
  onSectionChange,
  setOpenCreateOrEditModal,
  setUpdate,
}) => {
  const { t, i18n } = useTranslation();
  const isEdit = Boolean(selectedNews);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    happened_at: "",
  });

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
    } else {
      // Reset for create mode
      setFormData({
        title: "",
        description: "",
        happened_at: "",
      });
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
          ? t("Latest News updated successfully")
          : t("Latest News created successfully"),
      );
      setUpdate((prev) => !prev);
      setOpenCreateOrEditModal(false);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onSectionChange("newsList");
  };

  return (
    <div
      className="bg-white rounded-lg pt-3"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}

      {/* Form */}
      <form onSubmit={handleSubmit}>
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
