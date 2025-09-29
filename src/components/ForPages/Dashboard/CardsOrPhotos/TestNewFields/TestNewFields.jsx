import React, { useState } from "react";

import { useTranslation } from "react-i18next";

// Test component to demonstrate the new fields functionality
const TestNewFields = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    theme: "",
    language: "",
    type: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.warn("تم إرسال البيانات الجديدة:", formData);
    alert(`تم اختيار:\nالثيم: ${formData.theme}\nاللغة: ${formData.language}\nالنوع: ${formData.type}`);
  };

  // Theme options
  const THEME_OPTIONS = [
    { value: "dark", label: "Dark" },
    { value: "light", label: "Light" },
    { value: "colorful", label: "Colorful" },
    { value: "minimal", label: "Minimal" },
    { value: "classic", label: "Classic" }
  ];

  // Language options
  const LANGUAGE_OPTIONS = [
    { value: "ar", label: "Arabic" },
    { value: "en", label: "English" },
    { value: "tr", label: "Turkish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" }
  ];

  // Type options
  const TYPE_OPTIONS = [
    { value: "article", label: "Article" },
    { value: "photo", label: "Photo" },
    { value: "gallery", label: "Gallery" },
    { value: "news", label: "News" },
    { value: "event", label: "Event" },
    { value: "announcement", label: "Announcement" }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        اختبار الحقول الجديدة
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Start Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Theme")} / الثيم
          </label>
          <select
            name="theme"
            value={formData.theme}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">{t("Select Theme")} / اختر الثيم</option>
            {THEME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </select>
        </div>
        {/* End Theme */}
        
        {/* Start Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Language")} / اللغة
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">{t("Select Language")} / اختر اللغة</option>
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </select>
        </div>
        {/* End Language */}
        
        {/* Start Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Type")} / النوع
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">{t("Select Type")} / اختر النوع</option>
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </select>
        </div>
        {/* End Type */}

        {/* Display Selected Values */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">القيم المختارة:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>الثيم:</strong> {formData.theme || "لم يتم الاختيار"}</p>
            <p><strong>اللغة:</strong> {formData.language || "لم يتم الاختيار"}</p>
            <p><strong>النوع:</strong> {formData.type || "لم يتم الاختيار"}</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            اختبار الإرسال
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestNewFields;