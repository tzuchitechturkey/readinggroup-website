import React, { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { X, Search, Tag, Upload } from "lucide-react";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { processImageFile } from "@/Utility/imageConverter";
import {
  CreateEvent,
  EditEventById,
  GetEventCategories,
  GetEventById,
} from "@/api/events";
import Loader from "@/components/Global/Loader/Loader";
import countries from "@/constants/countries.json";
import { postStatusOptions } from "@/constants/constants";
import { languages, getCurrentLanguage } from "@/constants";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";

import DatePickerWithYearMonth from "../../Videos/CreateOrEditVideo/DatePickerWithYearMonth";

const CreateOrEditEvent = ({ onSectionChange, event = null }) => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const categoryDropdownRef = useRef(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categorySearchValue, setCategorySearchValue] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    image: null,
    image_url: "",
    country: "",
    happened_at: "",
    thumbnail: null,
    thumbnail_url: "",
    status: "",
    external_link: "",
    report_type: "",
    language: getCurrentLanguage(i18n),
  });

  const handleLoadTranslation = async () => {
    if (!event?.id || !formData.language) return;

    setIsLoading(true);
    try {
      const response = await GetEventById(event.id, formData.language);
      if (response?.data) {
        setFormData((prev) => ({
          ...prev,
          category: response?.data?.category || "",
          title: response?.data?.title || "",
          image: null,
          image_url: response?.data?.image_url || "",
          country: response?.data?.country || "",
          language: response?.data?.language || "",
          happened_at: response?.data?.happened_at || "",
          thumbnail: null,
          thumbnail_url: response?.data?.thumbnail_url || "",
          status: response?.data?.status || "",
          external_link: response?.data?.external_link || "",
          report_type: response?.data?.report_type || "",
        }));
        toast.success(t("Translation loaded successfully"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("Failed to load translation"));
    } finally {
      setIsLoading(false);
    }
  };

  const getCategories = async (searchVal = "") => {
    try {
      const res = await GetEventCategories(10, 0, searchVal);
      setCategoriesList(res?.data?.results);
    } catch (error) {
      console.error(error);
    }
  };

  //Reset form when modal opens/closes or event changes
  useEffect(() => {
    if (event?.id) {
      setFormData({
        category: event.category || "",
        title: event.title || "",
        image: null,
        image_url: event.image_url || "",
        country: event.country || "",
        language: event.language || "",
        happened_at: event.happened_at || "",
        thumbnail: null,
        thumbnail_url: event.thumbnail_url || "",
        status: event.status || "",
        external_link: event.external_link || "",
        report_type: event.report_type || "",
      });
      setImagePreview(event.image || event.image_url);
    } else {
      setFormData({
        category: "",
        title: "",
        image: null,
        image_url: "",
        country: "",
        language: "",
        happened_at: "",
        thumbnail: null,
        thumbnail_url: "",
        status: "",
        report_type: "",
      });
      setImagePreview("");
    }
  }, [event]);

  useEffect(() => {
    // Update language in formData when i18n language changes
    setFormData((prev) => ({
      ...prev,
      language: getCurrentLanguage(i18n),
    }));
  }, [i18n.language]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      category: category.id,
    }));
    setShowCategoryDropdown(false);
    setCategorySearchValue("");

    // Clear category error if exists
    if (errors.category) {
      setErrors((prev) => ({
        ...prev,
        category: "",
      }));
    }
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      category: "",
      title: "",
      // writer: "",
      image: null,
      image_url: "",
      country: "",
      language: "",
      status: "",
      external_link: "",
      happened_at: "",
      thumbnail: null,
      thumbnail_url: "",
      report_type: "",
    });

    // Clean up existing preview
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle file upload and preview
  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        // معالجة الصورة (تحويل HEIC إذا لزم الأمر)
        const { file: processedFile, url } = await processImageFile(file);

        // Update form data with file
        setFormData((prev) => ({
          ...prev,
          image: processedFile,
        }));

        // Set preview URL
        setImagePreview(url);

        // Clear image error if exists
        if (errors.image) {
          setErrors((prev) => ({
            ...prev,
            image: "",
          }));
        }
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error(t("Failed to process image"));
      }
    }
  };

  // Validate URL format
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = t("Category is required");
    }

    if (!formData.title.trim()) {
      newErrors.title = t("Title is required");
    }

    if (!formData.image && !formData.image_url && !event?.id) {
      newErrors.image = t("Image is required");
    }

    if (!formData.status) {
      newErrors.status = t("Status is required");
    }

    if (!formData.country) {
      newErrors.country = t("Country is required");
    }

    if (!formData.language) {
      newErrors.language = t("Language is required");
    }

    if (!formData?.happened_at) {
      newErrors.happened_at = t("Happened At is required");
    }

    if (!formData?.external_link?.trim()) {
      newErrors.external_link = t("External Link is required");
    } else if (!isValidUrl(formData?.external_link)) {
      newErrors.external_link = t("Please enter a valid URL");
    }
    if (!formData.report_type) {
      newErrors.report_type = t("Report type is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast.error(t("Please fix the errors in the form"));
      return;
    }

    // Create FormData object to handle file uploads
    const submitData = new FormData();

    // Append text fields
    submitData.append("category", formData?.category?.id || formData?.category);
    submitData.append("title", formData.title);
    submitData.append("writer", "formData.writer");
    submitData.append("status", formData.status);
    submitData.append("country", formData.country);
    submitData.append("language", formData.language);
    if (event?.key) {
      submitData.append("key", event.key);
    }
    if (formData.image) {
      submitData.append("image", formData.image);
    }
    if (formData?.image_url) {
      submitData.append("image_url", formData.image_url);
      // }
    }

    if (formData?.happened_at) {
      const formattedDate = format(
        new Date(formData.happened_at),
        "yyyy-MM-dd"
      );
      submitData.append("happened_at", formattedDate);
    }
    submitData.append("external_link", formData.external_link);
    submitData.append("report_type", formData.report_type);

    setIsLoading(true);
    try {
      if (event?.id) {
        // Update existing Event
        await EditEventById(event.id, submitData);
        toast.success(t("Event updated successfully"));
      } else {
        // Add new Event
        await CreateEvent(submitData);
        toast.success(t("Event created successfully"));
      }

      onSectionChange("events");
      resetForm();
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close category dropdown if clicked outside
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg p-3  ">
      {isLoading && <Loader />}
      {/* Start Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Events List")}
        onBack={() => {
          onSectionChange("events");
        }}
        page={event?.id ? t("Edit Event") : t("Create New Event")}
      />
      {/* End Breadcrumb */}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Start Image Upload Section */}
        <div>
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <p className="text-xs md:text-sm text-blue-800">
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
            {t("Event Image")}*
          </label>
          <div className="flex items-center gap-4">
            <div
              className={`w-32 h-24 border-2 border-dashed rounded-lg flex items-center justify-center ${
                errors.image ? "border-red-500" : "border-gray-300"
              }`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview || "/fake-user.png"}
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
                onChange={handleFileChange}
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
              <p className="text-xs text-gray-500 mt-1">
                {t("Recommended: 16:9 aspect ratio")}
              </p>
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
            </div>
          </div>
        </div>
        {/* End Image Upload Section */}
        {/* Start Image URL Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Image URL")} ({t("Alternative to file upload")})
          </label>
          <Input
            name="image_url"
            value={formData.image_url}
            onChange={handleInputChange}
            placeholder={t("Enter image URL as alternative to file upload")}
          />
          <p className="text-xs text-gray-500 mt-1">
            {t("You can either upload a file above or provide a URL here")}
          </p>
        </div>
        {/* End Image URL Section */}

        {/* Start Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className={`w-full p-3 border rounded-lg outline-none ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("Enter report title")}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          {/* End Title */}

          {/* Start Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("Language")} *
            </label>
            <div className="flex gap-2">
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="flex-1 p-2 border border-gray-300 rounded"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              {event?.key && (
                <button
                  type="button"
                  onClick={handleLoadTranslation}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  title={t("Load translation for selected language")}
                >
                  🌐 {t("Load")}
                </button>
              )}
            </div>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Language")} *
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg outline-none ${
                errors.language ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="" disabled hidden>
                {t("Select Language")}
              </option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang}>
                  {t(lang)}
                </option>
              ))}
            </select>
            {errors.language && (
              <p className="text-red-500 text-xs mt-1">{errors.language}</p>
            )}
          </div> */}
          {/* End Language */}
          {/* Start Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Report Type")} *
            </label>
            <select
              name="report_type"
              value={formData.report_type}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg outline-none ${
                errors.report_type ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="" disabled hidden>
                {t("Select Type")}
              </option>
              <option value="videos">{t("Video")}</option>
              <option value="reports">{t("Reports")}</option>
            </select>
            {errors.report_type && (
              <p className="text-red-500 text-xs mt-1">{errors.report_type}</p>
            )}
          </div>
          {/* End Report Type */}
          {/* Start Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Category")} *
            </label>
            <div className="relative" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className={`w-full px-3 py-[14px] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  i18n?.language === "ar" ? "text-right" : "text-left"
                } flex items-center gap-3 ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
                aria-haspopup="listbox"
              >
                {formData?.category ? (
                  <>
                    <Tag className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {categoriesList.find(
                          (cat) =>
                            cat.id ===
                            (formData.category?.id || formData.category)
                        )?.name || t("Select Category")}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Tag className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-500">
                      {t("Select Category")}
                    </span>
                  </>
                )}
              </button>

              {showCategoryDropdown && (
                <div
                  dir={i18n?.language === "ar" ? "rtl" : "ltr"}
                  className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden"
                >
                  {/* Search Box */}
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          dir={i18n?.language === "ar" ? "rtl" : "ltr"}
                          value={categorySearchValue}
                          onChange={(e) =>
                            setCategorySearchValue(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              getCategories(categorySearchValue);
                            }
                          }}
                          placeholder={t("Search categories...")}
                          className={`w-full px-3 py-1.5 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                            i18n?.language === "ar" ? "text-right" : "text-left"
                          }`}
                        />
                        {categorySearchValue && (
                          <button
                            type="button"
                            onClick={() => {
                              setCategorySearchValue("");
                              getCategories("");
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          getCategories(categorySearchValue);
                        }}
                        className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        title={t("Search")}
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Categories List */}
                  <div className="max-h-60 overflow-y-auto">
                    {categoriesList.length > 0 ? (
                      categoriesList.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategorySelect(category)}
                          className={`w-full px-3 py-2 hover:bg-gray-50 flex items-center gap-3 ${
                            i18n?.language === "ar" ? "text-right" : "text-left"
                          }`}
                        >
                          <Tag className="w-5 h-5 text-blue-600" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {category.name}
                            </div>
                            {category.description && (
                              <div className="text-xs text-gray-500">
                                {category.description}
                              </div>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center text-gray-500 text-sm">
                        {t("No categories found")}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>
          {/* End Category */}
          {/* Start Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Status")} *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg outline-none ${
                errors.status ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="" disabled hidden>
                {t("Select Status")}
              </option>
              {postStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">{errors.status}</p>
            )}
          </div>
          {/* End Status */}

          {/* Start Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Country")} *
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg outline-none ${
                errors.country ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="" disabled hidden>
                {t("Select Country")}
              </option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {t(country.name)}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">{errors.country}</p>
            )}
          </div>
          {/* End Country */}

          {/* Start Happened At */}
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Happened At")} *
            </label>
            <DatePickerWithYearMonth
              value={formData.happened_at}
              onChange={(date) => {
                handleInputChange({
                  target: { name: "happened_at", value: date },
                });
              }}
              placeholder="Pick Happened At date"
              error={Boolean(errors.happened_at)}
            />

            {errors.happened_at && (
              <p className="text-red-500 text-xs mt-1">{errors.happened_at}</p>
            )}
          </div>
          {/* End Air Date */}
          {/* Start External Link */}
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("External Link")} *
            </label>
            <input
              type="url"
              name="external_link"
              value={formData.external_link}
              onChange={handleInputChange}
              className={`w-full p-3 py-1 border rounded-md outline-none ${
                errors.external_link ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t(
                "Enter the external link (e.g., https://example.com)"
              )}
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("Please enter a valid URL starting with http:// or https://")}
            </p>
            {errors.external_link && (
              <p className="text-red-500 text-xs mt-1">
                {errors.external_link}
              </p>
            )}
          </div>
          {/* End External Link */}
        </div>

        {/* Start Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onSectionChange("events");
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-white border-[1px] border-primary hover:text-primary transition-all duration-200"
          >
            {event?.id ? t("Save Changes") : t("Add Event")}
          </button>
        </div>
        {/* End Actions */}
      </form>
    </div>
  );
};

export default CreateOrEditEvent;
