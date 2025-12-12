import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Save, Upload, X, Trash2, Edit2, Plus } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GetHistory,
  EditHistoryById,
  CreateHistory,
  DeleteHistoryById,
} from "@/api/aboutUs";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { processImageFile } from "@/Utility/imageConverter";
import Loader from "@/components/Global/Loader/Loader";

function BookOfStudy() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [bookOfStudyGroups, setBookOfStudyGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    image_url: "",
  });

  // Fetch Book of Study groups
  const fetchBookOfStudyGroups = async () => {
    setIsLoading(true);
    try {
      const res = await GetHistory(100, 0, "");
      setBookOfStudyGroups(res.data.results || []);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookOfStudyGroups();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: null,
      image_url: "",
    });
    setImagePreview(null);
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const { file: processedFile, url } = await processImageFile(file);
        setImagePreview(processedFile);
        setFormData((prev) => ({ ...prev, image: url }));
        setErrors((prev) => ({
          ...prev,
          image: "",
        }));
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error(t("Failed to process image"));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t("Title is required");
    }

    if (!formData.description.trim()) {
      newErrors.description = t("Description is required");
    }

    if (!editingId && !formData.image && !formData.image_url) {
      newErrors.image = t("Image is required");
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

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);

    if (imagePreview instanceof File) {
      formDataToSend.append("image", imagePreview);
    } else if (formData.image_url) {
      formDataToSend.append("image_url", formData.image_url);
    }

    setIsLoading(true);

    try {
      if (editingId) {
        await EditHistoryById(editingId, formDataToSend);
        toast.success(t("Group updated successfully"));
      } else {
        await CreateHistory(formDataToSend);
        toast.success(t("Group created successfully"));
      }
      resetForm();
      fetchBookOfStudyGroups();
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (group) => {
    setFormData({
      title: group.title,
      description: group.description,
      image: group.image,
      image_url: group.image_url,
    });
    setImagePreview(group.image || group.image_url);
    setEditingId(group.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm(t("Are you sure you want to delete this group?"))) {
      return;
    }

    setIsLoading(true);

    try {
      await DeleteHistoryById(id);
      toast.success(t("Group deleted successfully"));
      fetchBookOfStudyGroups();
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 ${
        i18n.language === "ar" ? "rtl" : "ltr"
      }`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}

      <div className=" p-3 mx-auto ">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("Book of Study")}
          </h1>
          <p className="text-gray-600">
            {t("Manage study groups with photos and descriptions")}
          </p>
        </div>

        {/* Add/Edit Form Section */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingId ? t("Edit Group") : t("Create New Group")}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section */}
              <div>
                <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 rounded-t-lg mb-4">
                  <p className="text-xs md:text-sm text-blue-800">
                    <strong>{t("Important")}:</strong>{" "}
                    {t(
                      "Please select an image with minimum dimensions of 300x200 pixels for best quality."
                    )}
                  </p>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("Group Photo")}
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    {imagePreview ? (
                      <img
                        src={
                          imagePreview instanceof File
                            ? URL.createObjectURL(imagePreview)
                            : imagePreview
                        }
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*,.heic,.heif"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 border ${
                        errors.image ? "border-red-500" : "border-gray-300"
                      } rounded-md hover:bg-gray-50`}
                    >
                      <Upload className="h-4 w-4" />
                      {t("Upload Image")}
                    </label>
                    {errors.image && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.image}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Title")} *
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={t("Enter group title")}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              {/* Description with CKEditor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Description")} *
                </label>
                <div
                  className={`border rounded-md ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } focus-within:ring-2 focus-within:ring-blue-500`}
                >
                  <CKEditor
                    editor={ClassicEditor}
                    data={formData.description}
                    config={{
                      placeholder: t("Enter group description"),
                      language: i18n.language === "ar" ? "ar" : "en",
                      removePlugins: [
                        "MediaEmbed",
                        "ImageUpload",
                        "Image",
                        "MediaEmbedToolbar",
                        "EasyImage",
                      ],
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setFormData((prev) => ({ ...prev, description: data }));
                      if (errors.description) {
                        setErrors((prev) => ({ ...prev, description: "" }));
                      }
                    }}
                    onBlur={() => {
                      if (!formData.description.trim()) {
                        setErrors((prev) => ({
                          ...prev,
                          description: t("Description is required"),
                        }));
                      }
                    }}
                  />
                </div>
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={resetForm}>
                  {t("Cancel")}
                </Button>
                <Button
                  type="submit"
                  className="flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4" />
                  {isLoading
                    ? t("Saving...")
                    : editingId
                    ? t("Update Group")
                    : t("Create Group")}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Add Button */}
        {!showForm && (
          <div className="mb-8">
            <Button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t("Add New Group")}
            </Button>
          </div>
        )}

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookOfStudyGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="aspect-video bg-gray-200 overflow-hidden">
                {group.image || group.image_url ? (
                  <img
                    src={group.image || group.image_url}
                    alt={group.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <Upload className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {group.title}
                </h3>

                {/* Description Preview */}
                <div className="text-sm text-gray-600 mb-4 line-clamp-3">
                  <div
                    className="prose prose-sm max-w-none"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: group.description || "",
                    }}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(group)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                    disabled={isLoading}
                  >
                    <Edit2 className="w-4 h-4" />
                    {t("Edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(group.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                    {t("Delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && bookOfStudyGroups.length === 0 && !showForm && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("No groups yet")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("Create your first study group with a photo and description")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookOfStudy;
