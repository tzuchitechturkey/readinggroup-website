import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { CreateHistory, EditHistoryById } from "@/api/history";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import DatePickerMonthYear from "@/components/Global/DatePickerMonthYear/DatePickerMonthYear";

const CreateOrEditHistory = ({
  setUpdate,
  isOpen,
  onClose,
  historyItem = null,
}) => {
  const { t } = useTranslation();
  const [isLaoding, setIsLaoding] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    date: null,
    title: "",
    sub_title_one: "",
    sub_title_two: "",
    description: "",
  });

  // Reset form when modal opens/closes or historyItem changes
  useEffect(() => {
    if (historyItem && historyItem.id) {
      // Convert year and month to a date object
      const date =
        historyItem.year && historyItem.month
          ? new Date(historyItem.year, historyItem.month - 1, 1)
          : null;
      setFormData({
        date,
        title: historyItem.title || "",
        sub_title_one: historyItem.sub_title_one || "",
        sub_title_two: historyItem.sub_title_two || "",
        description: historyItem.description || "",
      });
    } else {
      setFormData({
        date: null,
        title: "",
        sub_title_one: "",
        sub_title_two: "",
        description: "",
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
  console.log("Form data:", formData);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = t("Date is required");
    }

    if (!formData.title.trim()) {
      newErrors.title = t("Title is required");
    }

    if (!formData.sub_title_one.trim()) {
      newErrors.sub_title_one = t("Sub Title One is required");
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

      // Extract year and month from the date
      const year = formData.date.getFullYear();
      const month = formData.date.getMonth() + 1; // getMonth() returns 0-11, so add 1

      formDataToSend.append("year", year);
      formDataToSend.append("month", month); // Send as number
      formDataToSend.append("title", formData.title || "");
      formDataToSend.append("sub_title_one", formData.sub_title_one || "");
      formDataToSend.append("sub_title_two", formData.sub_title_two || "");

      if (historyItem?.id) {
        await EditHistoryById(historyItem.id, formDataToSend);
        toast.success(t("Event saved successfully"));
      } else {
        await CreateHistory(formDataToSend);
        toast.success(t("Event created successfully"));
      }
      setUpdate((prev) => !prev);
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      setErrorFn(error, t);
    } finally {
      setIsLaoding(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="bg-white relative rounded-lg p-6 ">
      {isLaoding && <Loader />}

      <form onSubmit={handleSubmit} className="relative z-50 space-y-4">
        {/* Date Picker for Month and Year Only */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Month & Year")} *
          </label>
          <DatePickerMonthYear
            value={formData.date}
            onChange={(date) => {
              setFormData((prev) => ({ ...prev, date }));
              // Clear error when user selects a date
              if (errors.date) {
                setErrors((prev) => ({ ...prev, date: "" }));
              }
            }}
            error={Boolean(errors.date)}
            disabled={false}
          />
        </div>

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
            {t("Sub Title One")} *
          </label>
          <input
            type="text"
            name="sub_title_one"
            value={formData.sub_title_one}
            onChange={handleInputChange}
            placeholder={t("Enter sub title one")}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.sub_title_one ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.sub_title_one && (
            <p className="text-red-500 text-xs mt-1">{errors.sub_title_one}</p>
          )}
        </div>
        {/* End Sub Title One */}

        {/* Start Sub Title Two */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Sub Title Two")} *
          </label>
          <textarea
            name="sub_title_two"
            value={formData.sub_title_two}
            onChange={handleInputChange}
            placeholder={t("Enter sub title two")}
            rows={4}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  border-gray-300
            `}
          />
        </div>
        {/* End Sub Title Two */}

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
