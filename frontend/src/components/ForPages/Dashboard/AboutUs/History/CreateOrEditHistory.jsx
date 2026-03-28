import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { CreateHistory, EditHistoryById } from "@/api/aboutUs";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";

const CreateOrEditHistory = ({ historyItem = null }) => {
  const { t } = useTranslation();
  const [isLaoding, setIsLaoding] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    year: "",
    title: "",
    sub_title: "",
    description: "",
    image: "",
    image_url: "",
  });

  // Reset form when modal opens/closes or historyItem changes
  useEffect(() => {
    if (historyItem && historyItem.id) {
      setFormData({
        ...historyItem,
      });
    } else {
      setFormData({
        year: "",
        title: "",
        sub_title: "",
        description: "",
        image: "",
        image_url: "",
      });
    }
  }, [historyItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      // Clear image error if exists
      if (errors.image) {
        setErrors((prev) => ({
          ...prev,
          image: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.year.toString().trim()) {
      newErrors.year = t("Year is required");
    }

    if (!formData.title.trim()) {
      newErrors.title = t("Title is required");
    }

    if (!formData.sub_title.trim()) {
      newErrors.sub_title = t("Sub Title is required");
    }

    if (!formData.description.trim()) {
      newErrors.description = t("Description is required");
    }

    if (!formData.image && !formData.image_url && !historyItem?.id) {
      newErrors.image = t("Image is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLaoding(true);
    try {
      // إنشاء FormData لإرسال الصورة بشكل صحيح
      const formDataToSend = new FormData();

      formDataToSend.append("year", formData.year);
      formDataToSend.append("title", formData.title || "");
      formDataToSend.append("sub_title", formData.sub_title || "");
      formDataToSend.append("description", formData.description || "");

      // إضافة رابط الصورة إذا كان موجود
      if (formData.image_url && formData.image_url.trim()) {
        formDataToSend.append("image_url", formData.image_url.trim());
      }

      // إضافة الصورة المرفوعة إذا كانت موجودة
      if (formData.image && typeof formData.image !== "string") {
        formDataToSend.append("image", formData.image);
      }

      // طباعة البيانات للتصحيح
      if (process.env.NODE_ENV === "development") {
        console.warn("FormData being sent:");
        for (const pair of formDataToSend.entries()) {
          console.warn(pair[0] + ": " + pair[1]);
        }
      }

      if (historyItem?.id) {
        await EditHistoryById(historyItem.id, formDataToSend);
        toast.success(t("Event saved successfully"));
      } else {
        await CreateHistory(formDataToSend);
        toast.success(t("Event created successfully"));
      }
      setUpdate((prev) => !prev);
    } catch (error) {
      console.error("Submit error:", error);
      setErrorFn(error, t);
    } finally {
      setIsLaoding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 overflow-y-auto">
      {isLaoding && <Loader />}

      <form onSubmit={handleSubmit} className="relative z-50 space-y-4">
        {/* Start Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Year")} *
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            placeholder={t("Enter year")}
            min="1900"
            max={new Date().getFullYear()}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.year ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.year && (
            <p className="text-red-500 text-xs mt-1">{errors.year}</p>
          )}
        </div>
        {/* End Year */}

        {/* Start Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Title")} *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder={t("Enter title")}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>
        {/* End Title */}

        {/* Start Sub Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Sub Title")} *
          </label>
          <input
            type="text"
            name="sub_title"
            value={formData.sub_title}
            onChange={handleInputChange}
            placeholder={t("Enter sub title")}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.sub_title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.sub_title && (
            <p className="text-red-500 text-xs mt-1">{errors.sub_title}</p>
          )}
        </div>
        {/* End Sub Title */}

        {/* Start Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Description")} *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder={t("Enter description")}
            rows={4}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>
        {/* End Description */}

      

        {/* Start Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {historyItem?.id ? t("Save Changes") : t("Add Event")}
          </button>
        </div>
        {/* End Actions */}
      </form>
    </div>
  );
};

export default CreateOrEditHistory;
