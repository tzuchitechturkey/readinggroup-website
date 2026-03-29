import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { GetBook, CreateBook, EditBookById } from "@/api/books";

import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";
import ImageSection from "./ImageSection";
import { DescriptionSection } from "./DescriptionSection";

const BookPage = ({ onSectionChange }) => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [book, setBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    cover_image: null,
  });
  const [previewImages, setPreviewImages] = useState({
    image: null,
    cover_image: null,
  });

  const [errors, setErrors] = useState({});
  const [descriptionError, setDescriptionError] = useState("");

  // Fetch the single book
  const fetchBook = async () => {
    setIsLoading(true);
    try {
      const res = await GetBook();
      setBook(res.data[0]);
      setFormData({
        title: res.data[0].title || "",
        description: res.data[0].description || "",
        image: null,
        cover_image: null,
      });
      setPreviewImages({
        image: res.data[0].image || null,
        cover_image: res.data[0].cover_image || null,
      });
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle description changes
  const handleDescriptionChange = (data) => {
    setFormData((prev) => ({
      ...prev,
      description: data,
    }));
    // Clear error if exists
    if (descriptionError) {
      setDescriptionError("");
    }
  };

  // Handle description blur
  const handleDescriptionBlur = () => {
    // Add validation logic if needed
  };

  // Handle file input changes for specific image
  const handleFileChange = (imageKey) => (file) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [imageKey]: file,
      }));
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImages((prev) => ({
          ...prev,
          [imageKey]: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
      // Clear error if exists
      if (errors[imageKey]) {
        setErrors((prev) => ({
          ...prev,
          [imageKey]: "",
        }));
      }
    }
  };

  // Create new book
  const handleCreateBook = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error(t("Book title is required"));
      return;
    }

    setIsSaving(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      if (formData.image) {
        data.append("image", formData.image);
      }
      if (formData.cover_image) {
        data.append("cover_image", formData.cover_image);
      }

      const res = book?.id
        ? await EditBookById(book.id, data)
        : await CreateBook(data);
      setBook(res.data);
      setFormData({
        title: res.data.title || "",
        description: res.data.description || "",
        image: null,
        cover_image: null,
      });
      setPreviewImages({
        image: res.data.image || null,
        cover_image: res.data.cover_image || null,
      });

      toast.success(
        book?.id
          ? t("Book updated successfully")
          : t("Book created successfully"),
      );
      onSectionChange("dashboard");
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="bg-white rounded-lg p-3 lg:p-6 w-full mx-4 overflow-y-auto"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}

      {/* Start Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Dashboard")}
        onBack={() => {
          onSectionChange("dashboard");
        }}
        page={t("The Book")}
      />
      {/* End Breadcrumb */}

      <div className="py-6">
        <form onSubmit={handleCreateBook} className="space-y-6">
          {/* Image Upload */}
          <ImageSection
            imagePreview={previewImages.image}
            onFileChange={handleFileChange("image")}
            errors={errors}
            title={t("Image")}
            fieldName="image"
          />

          {/* Cover Image Upload */}
          <div>
            <ImageSection
              imagePreview={previewImages.cover_image}
              onFileChange={handleFileChange("cover_image")}
              errors={errors}
              title={t("Cover Image")}
              fieldName="cover_image"
            />
          </div>
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Book Title")} *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder={t("Enter book title")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description Input */}
          <DescriptionSection
            formData={formData}
            onBodyChange={handleDescriptionChange}
            onBodyBlur={handleDescriptionBlur}
            error={descriptionError}
          />
          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isSaving ? t("Creating...") : t("Create Book")}
            </button>
            <button
              type="button"
              onClick={() => onSectionChange("dashboard")}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              {t("Cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookPage;
