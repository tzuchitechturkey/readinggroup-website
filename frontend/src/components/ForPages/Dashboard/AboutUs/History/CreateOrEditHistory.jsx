import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

import { CreateHistory, EditHistoryById } from "@/api/aboutUs";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Loader from "@/components/Global/Loader/Loader";

const CreateOrEditHistory = ({
  isOpen,
  onClose,
  historyItem = null,
  setUpdate,
}) => {
  const { t } = useTranslation();
  const [isLaoding, setIsLaoding] = useState(false);
  const [openStoryDate, setOpenStory] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    story_date: "",
    image: "",
    image_url: "",
  });

  // Reset form when modal opens/closes or historyItem changes
  useEffect(() => {
    if (isOpen) {
      if (historyItem && historyItem.id) {
        setFormData({
          ...historyItem,
          // تحويل التواريخ من string إلى Date objects للتعديل
          story_date: historyItem.story_date
            ? new Date(historyItem.story_date)
            : "",
        });
      } else {
        setFormData({
          story_date: "",
          title: "",
          description: "",
          image: "",
          image_url: "",
        });
      }
    }
  }, [isOpen, historyItem]);

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

  const handleDateChange = (date) => {
    setOpenStory(false);
    setFormData((prev) => ({ ...prev, story_date: date }));

    // Clear date error if exists
    if (errors.story_date) {
      setErrors((prev) => ({
        ...prev,
        story_date: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.story_date) {
      newErrors.story_date = t("Story date is required");
    }

    if (!formData.title.trim()) {
      newErrors.title = t("Title is required");
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

      // تحويل التواريخ إلى صيغة YYYY-MM-DD
      if (formData.story_date) {
        const storyDate = new Date(formData.story_date);
        // التأكد من صحة التاريخ
        if (!isNaN(storyDate.getTime())) {
          formDataToSend.append(
            "story_date",
            storyDate.toISOString().split("T")[0]
          );
        }
      }

      if (formData.to_date) {
        const toDate = new Date(formData.to_date);
        // التأكد من صحة التاريخ
        if (!isNaN(toDate.getTime())) {
          formDataToSend.append("to_date", toDate.toISOString().split("T")[0]);
        }
      }

      // إضافة باقي البيانات
      formDataToSend.append("title", formData.title || "");
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
      onClose();
      setUpdate((prev) => !prev);
    } catch (error) {
      console.error("Submit error:", error);
      setErrorFn(error, t);
    } finally {
      setIsLaoding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg p-6 overflow-y-auto">
      {isLaoding && <Loader />}

      <form onSubmit={handleSubmit} className="relative z-50 space-y-4">
        {/* Start Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Story Date")} *
          </label>
          <Popover
            open={openStoryDate}
            onOpenChange={setOpenStory}
            className="!z-[999999999999999]"
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.story_date && "text-muted-foreground",
                  errors.story_date && "border-red-500"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {formData.story_date
                  ? format(new Date(formData.story_date), "PPP")
                  : t("Pick Story date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={
                  formData.story_date
                    ? new Date(formData.story_date)
                    : undefined
                }
                onSelect={handleDateChange}
                disabled={(date) => {
                  // Disable dates after today
                  const today = new Date();
                  today.setHours(23, 59, 59, 999);
                  return date > today;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.story_date && (
            <p className="text-red-500 text-xs mt-1">{errors.story_date}</p>
          )}
        </div>
        {/* End Start Date */}

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
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>
        {/* End Title */}

        {/* Start Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Description")} *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
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

        {/* Start Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Image URL")}
          </label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url || ""}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* End Image URL */}

        {/* Start Image Upload */}
        <div>
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <p className="text-sm text-blue-800">
              <strong>{t("Important")}:</strong>{" "}
              {t(
                "Please select an image with minimum dimensions of 1920x1080 pixels for best quality."
              )}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {t("Supported formats")}: PNG, WEBP, JPG, JPEG, HEIC
            </p>
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Event Image")} *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={`w-full p-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
              errors.image ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.image && (
            <p className="text-red-500 text-xs mt-1">{errors.image}</p>
          )}

          {formData.image && (
            <div className="mt-3">
              <img
                src={
                  typeof formData.image === "string"
                    ? formData.image
                    : URL.createObjectURL(formData.image)
                }
                alt="preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>
        {/* End Image Upload */}

        {/* Start Image Preview */}
        {/* {formData.image && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Image Preview")}
            </label>
            <img
              src={formData.image}
              alt={t("Preview")}
              className="w-32 h-32 object-cover rounded-lg border"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )} */}
        {/* End Image Preview */}

        {/* Start Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {t("Cancel")}
          </button>
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
