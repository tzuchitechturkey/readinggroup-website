import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Category options
const CATEGORY_OPTIONS = [
  { value: "تعليمي", label: "Educational" },
  { value: "ثقافي", label: "Cultural" },
  { value: "مقابلات", label: "Interviews" },
  { value: "أخبار", label: "News" },
  { value: "ترفيهي", label: "Entertainment" },
  { value: "وثائقي", label: "Documentary" },
];

const CreateOrEditNews = ({
  isOpen,
  onClose,
  onSave,
  news = null,
  isEditing = false,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    image: null,
    title: "",
    description: "",
    date: "",
    writer: "",
    category: "",
  });

  // State for image preview
  const [imagePreview, setImagePreview] = useState("");

  // Reset form when modal opens/closes or TV changes
  useEffect(() => {
    if (isOpen) {
      if (news && isEditing) {
        setFormData({
          ...news,
          image: null, // Reset file input
        });
        // Set existing image preview for editing
        setImagePreview(news.image || "");
      } else {
        setFormData({
          image: null,
          title: "",
          description: "",
          date: "",
          writer: "",
          category: "",
        });
        setImagePreview("");
      }
    } else {
      // Clean up preview URL when modal closes
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    }
  }, [isOpen, news, isEditing, imagePreview]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Reset form function
  const resetForm = () => {
    setFormData({
      image: null,
      title: "",
      description: "",
      date: "",
      writer: "",
      category: "",
    });

    // Clean up existing preview
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("يرجى اختيار ملف صورة صحيح");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت");
        return;
      }

      // Update form data with file
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create FormData object to handle file uploads
    const submitData = new FormData();

    // Append text fields
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("date", formData.date);
    submitData.append("writer", formData.writer);
    submitData.append("category", formData.category);

    // Append file if it exists
    if (formData.image) {
      submitData.append("image", formData.image);
    }

    // For editing, include existing image URL if no new file selected
    if (isEditing && news) {
      if (!formData.image && news.image) {
        submitData.append("existingImage", news.image);
      }
    }

    onSave(submitData);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg p-3  ">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {isEditing ? t("Edit TV Program") : t("Add New TV Program")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Start Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Title")}
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg outline-none"
            required
            placeholder={t("Enter program title")}
          />
        </div>
        {/* End Title */}

        {/* Start Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Description")}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg outline-none"
            required
            placeholder={t("Enter program description")}
          />
        </div>
        {/* End Description */}

        {/* Start Date and Writer Row */}
        <div className="space-y-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Start Date")}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(formData.date, "PPP")
                  ) : (
                    <span>{t("Pick start date")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={formData.date}
                  onSelect={handleInputChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* End Start Date */}

          {/* Start Writer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Writer")}
            </label>
            <input
              type="text"
              name="writer"
              value={formData.writer}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none"
              required
              placeholder={t("Enter writer name")}
            />
          </div>
          {/* End Writer */}
          {/* End Date and Writer Row */}

          {/* Start Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Category")}
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none"
              required
            >
              <option value="">{t("Select Category")}</option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value} ({t(option.label)})
                </option>
              ))}
            </select>
          </div>
          {/* End Category */}

          {/* Start Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Program Image")}
            </label>
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required={!isEditing}
            />
            <p className="text-xs text-gray-500 mt-1">
              الحد الأقصى: 5 ميجابايت. الصيغ المدعومة: JPG, PNG, WebP
            </p>
          </div>
          {/* End Image */}

          {/* Start Image Preview */}
          {imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Image Preview")}
              </label>
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="معاينة صورة البرنامج"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, image: null }));
                    if (imagePreview.startsWith("blob:")) {
                      URL.revokeObjectURL(imagePreview);
                    }
                    setImagePreview("");
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          {/* End Image Preview */}

          {/* Start Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-white border-[1px] border-primary hover:text-primary transition-all duration-200"
            >
              {isEditing ? t("Save Changes") : t("Add Program")}
            </button>
          </div>
          {/* End Actions */}
        </div>
      </form>
    </div>
  );
};

export default CreateOrEditNews;
