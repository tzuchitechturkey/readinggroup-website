import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { LuPencil, LuUpload } from "react-icons/lu";
import { toast } from "react-toastify";

import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { GetBook, CreateBook, EditBookById } from "@/api/books";

import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";

const BooksList = ({ onSectionChange }) => {
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

  // Fetch the single book
  const fetchBook = async () => {
    setIsLoading(true);
    try {
      const res = await GetBook();
      if (res?.data) {
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
      }
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

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImages((prev) => ({
          ...prev,
          [name]: event.target.result,
        }));
      };
      reader.readAsDataURL(files[0]);
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
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 pt-3 px-3"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Description")}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t("Enter book description")}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Image")}
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100">
                <LuUpload />
                <span>{t("Upload Image")}</span>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {previewImages.image && (
                <img
                  src={previewImages.image}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded"
                />
              )}
            </div>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Cover Image")}
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100">
                <LuUpload />
                <span>{t("Upload Cover Image")}</span>
                <input
                  type="file"
                  name="cover_image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {previewImages.cover_image && (
                <img
                  src={previewImages.cover_image}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded"
                />
              )}
            </div>
          </div>

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

export default BooksList;
