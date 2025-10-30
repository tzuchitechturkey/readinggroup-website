import React, { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { X, User, Search, Tag, Upload, Calendar } from "lucide-react";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import {
  CreateEvent,
  EditEventById,
  GetEventCategories,
  GetEventSections,
} from "@/api/events";
import Loader from "@/components/Global/Loader/Loader";
import { GetAllUsers } from "@/api/posts";
import countries from "@/constants/countries.json";
import { languages } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CreateOrEditEvent = ({ onSectionChange, event = null }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const writerDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const sectionDropdownRef = useRef(null);
  const [showWriterDropdown, setShowWriterDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [writerSearchValue, setWriterSearchValue] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [writersList, setWritersList] = useState([]);
  const [categorySearchValue, setCategorySearchValue] = useState("");
  const [sectionSearchValue, setSectionSearchValue] = useState("");
  const [openHappendAt, setOpenHappendAt] = useState(false);
  const [castInput, setCastInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    writer: "",
    image: null,
    image_url: "",
    report_type: "",
    country: "",
    language: "",
    duration_minutes: "",
    section: "",
    happened_at: "",
    summary: "",
    thumbnail: null,
    thumbnail_url: "",
    video_url: "",
    cast: [],
    tags: [],
  });

  const [imagePreview, setImagePreview] = useState("");

  const getWriters = async (searchVal = "") => {
    try {
      const res = await GetAllUsers(searchVal);
      setWritersList(res?.data?.results);
    } catch (error) {
      console.error(error);
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

  const getSections = async (searchVal = "") => {
    try {
      const res = await GetEventSections(10, 0, searchVal);
      setSectionsList(res?.data?.results);
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
        writer: event.writer || "",
        image: null,
        image_url: event.image_url || "",
        report_type: event.report_type || "",
        country: event.country || "",
        language: event.language || "",
        duration_minutes: event.duration_minutes || "",
        section: event.section || "",
        summary: event.summary || "",
        happened_at: event.happened_at || "",
        thumbnail: null,
        thumbnail_url: event.thumbnail_url || "",
        video_url: event.video_url || "",
        cast: event.cast || [],
        tags: event.tags || [],
      });
      setImagePreview(
        event?.report_type === "videos"
          ? event.thumbnail || event.thumbnail_url
          : event.image || event.image_url
      );
    } else {
      setFormData({
        category: "",
        title: "",
        writer: "",
        image: null,
        image_url: "",
        report_type: "",
        country: "",
        language: "",
        duration_minutes: "",
        section: "",
        summary: "",
        happened_at: "",
        thumbnail: null,
        thumbnail_url: "",
        video_url: "",
        cast: [],
        tags: [],
      });
      setImagePreview("");
    }
  }, [event]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
  // Handle writer selection
  const handleWriterSelect = (writer) => {
    setFormData((prev) => ({
      ...prev,
      writer: writer.username,
    }));
    setShowWriterDropdown(false);
    setWriterSearchValue("");

    // Clear writer error if exists
    if (errors.writer) {
      setErrors((prev) => ({
        ...prev,
        writer: "",
      }));
    }
  };

  // Handle writer search
  const handleWriterSearch = () => {
    getWriters(writerSearchValue);
  };

  // Handle clear writer search
  const handleClearWriterSearch = () => {
    setWriterSearchValue("");
    getWriters("");
  };

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

  // Handle section selection
  const handleSectionSelect = (section) => {
    setFormData((prev) => ({
      ...prev,
      section: section.id,
    }));
    setShowSectionDropdown(false);
    setSectionSearchValue("");

    // Clear section error if exists
    if (errors.section) {
      setErrors((prev) => ({
        ...prev,
        section: "",
      }));
    }
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      category: "",
      title: "",
      writer: "",
      image: null,
      image_url: "",
      report_type: "",
      country: "",
      language: "",
      duration_minutes: "",
      section: "",
      summary: "",
      happened_at: "",
      thumbnail: null,
      thumbnail_url: "",
      video_url: "",
      cast: [],
      tags: [],
    });

    // Clean up existing preview
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview("");
    setCastInput("");
    setTagsInput("");
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
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(t("Please select a valid image file"));
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

      // Clear image error if exists
      if (errors.image) {
        setErrors((prev) => ({
          ...prev,
          image: "",
        }));
      }
    }
  };

  // Handle cast input
  const handleCastInput = (e) => {
    if (e.key === "Enter" && castInput.trim()) {
      e.preventDefault();
      if (!formData?.cast.includes(castInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          cast: [...prev.cast, castInput.trim()],
        }));
      }
      setCastInput("");

      // Clear error when adding cast
      if (errors.cast) {
        setErrors((prev) => ({
          ...prev,
          cast: "",
        }));
      }
    }
  };

  // Remove cast
  const removeCast = (castToRemove) => {
    setFormData((prev) => ({
      ...prev,
      cast: prev.cast.filter((item) => item !== castToRemove),
    }));
  };

  // Handle tags input
  const handleTagsInput = (e) => {
    if (e.key === "Enter" && tagsInput.trim()) {
      e.preventDefault();
      if (!formData?.tags.includes(tagsInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagsInput.trim()],
        }));
      }
      setTagsInput("");

      // Clear error when adding tag
      if (errors.tags) {
        setErrors((prev) => ({
          ...prev,
          tags: "",
        }));
      }
    }
  };
  console.log(formData);

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
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

    if (!formData.writer) {
      newErrors.writer = t("Writer is required");
    }

    if (!formData.image && !formData.image_url && !event?.id) {
      newErrors.image = t("Image is required");
    }

    if (!formData.report_type) {
      newErrors.report_type = t("Report type is required");
    }

    if (!formData.country) {
      newErrors.country = t("Country is required");
    }

    if (!formData.language) {
      newErrors.language = t("Language is required");
    }

    if (!formData.duration_minutes) {
      newErrors.duration_minutes = t("Duration is required");
    }
    if (!formData?.happened_at) {
      newErrors.happened_at = t("Happened At is required");
    }
    if (!formData.section) {
      newErrors.section = t("Section is required");
    }

    if (!formData.summary.trim()) {
      newErrors.summary = t("Summary is required");
    }

    // Validate video fields if report type is "videos"
    if (formData.report_type === "videos") {
      if (!formData?.video_url.trim()) {
        newErrors.video_url = t("Video URL is required");
      }

      if (!formData?.cast || formData?.cast.length === 0) {
        newErrors.cast = t("Cast is required");
      }

      if (!formData?.tags || formData?.tags.length === 0) {
        newErrors.tags = t("Tags are required");
      }
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
    submitData.append("writer", formData.writer);
    submitData.append("report_type", formData.report_type);
    submitData.append("country", formData.country);
    submitData.append("language", formData.language);
    submitData.append("duration_minutes", formData.duration_minutes);
    submitData.append("section", formData.section?.id || formData.section);
    if (formData.image) {
      submitData.append("image", formData.image);
      if (formData?.report_type === "videos") {
        submitData.append("thumbnail", formData.image);
      }
    }
    if (formData?.image_url) {
      submitData.append("image_url", formData.image_url);
      if (formData?.report_type === "videos") {
        submitData.append("thumbnail_url", formData.image_url);
      }
    }

    if (formData?.happened_at) {
      const formattedDate = format(
        new Date(formData.happened_at),
        "yyyy-MM-dd"
      );
      submitData.append("happened_at", formattedDate);
    }
    submitData.append("summary", formData.summary);

    // Append video fields if report type is "videos"
    if (formData.report_type === "videos") {
      submitData.append("video_url", formData.video_url);
      // Append cast as JSON array
      if (formData.cast && formData.cast.length > 0) {
        submitData.append("cast", JSON.stringify(formData.cast));
      }
      // Append tags as JSON array
      if (formData.tags && formData.tags.length > 0) {
        submitData.append("tags", JSON.stringify(formData.tags));
      }

      // submitData.append("thumbnail_url", formData.thumbnail_url);
      // Append thumbnail file if it exists
      // if (formData.thumbnail) {
      //   submitData.append("thumbnail", formData.thumbnail);
      // }
    }

    // Append file if it exists

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

      onSectionChange("eventsList");
      resetForm();
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getWriters();
    getCategories();
    getSections();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close writer dropdown if clicked outside
      if (
        writerDropdownRef.current &&
        !writerDropdownRef.current.contains(event.target)
      ) {
        setShowWriterDropdown(false);
      }

      // Close category dropdown if clicked outside
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }

      // Close section dropdown if clicked outside
      if (
        sectionDropdownRef.current &&
        !sectionDropdownRef.current.contains(event.target)
      ) {
        setShowSectionDropdown(false);
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSectionChange("dashboard")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            ← {t("Back to Events List")}
          </button>
          <div className="h-4 w-px bg-gray-300" />
          <h2 className="text-xl font-semibold text-[#1D2630]">
            {event?.id ? t("Edit Event") : t("Create New Event")}
          </h2>
        </div>
      </div>
      {/* End Breadcrumb */}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Start Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formData?.report_type === "videos"
              ? t("Event Video Thumbnail")
              : t("Event Image")}{" "}
            *
          </label>
          <div className="flex items-center gap-4">
            <div
              className={`w-32 h-24 border-2 border-dashed rounded-lg flex items-center justify-center ${
                errors.image ? "border-red-500" : "border-gray-300"
              }`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
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
                accept="image/*"
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
            placeholder={
              formData?.report_type === "videos"
                ? t("Enter thumbnail URL as alternative to file upload")
                : t("Enter image URL as alternative to file upload")
            }
          />
          <p className="text-xs text-gray-500 mt-1">
            {t("You can either upload a file above or provide a URL here")}
          </p>
        </div>
        {/* End Image URL Section */}

        {/* Start Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("Category")} *
            </label>
            <div className="relative" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center gap-3 ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
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
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
                  {/* Search Box */}
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
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
                          className="w-full px-3 py-1.5 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
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
          {/* Start Writer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("Writer")} *
            </label>
            <div className="relative" ref={writerDropdownRef}>
              <button
                type="button"
                onClick={() => setShowWriterDropdown(!showWriterDropdown)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center gap-3 ${
                  errors.writer ? "border-red-500" : "border-gray-300"
                }`}
              >
                {formData?.writer ? (
                  <div className="font-medium text-sm">{formData?.writer}</div>
                ) : (
                  <>
                    <User className="w-8 h-8 text-gray-400" />
                    <span className="text-gray-500">{t("Select Writer")}</span>
                  </>
                )}
              </button>

              {showWriterDropdown && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
                  {/* Search Box */}
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={writerSearchValue}
                          onChange={(e) => setWriterSearchValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleWriterSearch();
                            }
                          }}
                          placeholder={t("Search writers...")}
                          className="w-full px-3 py-1.5 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        {writerSearchValue && (
                          <button
                            type="button"
                            onClick={handleClearWriterSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleWriterSearch}
                        className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        title={t("Search")}
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Writers List */}
                  <div className="max-h-60 overflow-y-auto">
                    {writersList.length > 0 ? (
                      writersList.map((writer) => (
                        <button
                          key={writer.id}
                          type="button"
                          onClick={() => handleWriterSelect(writer)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                        >
                          <img
                            src={writer.profile_image}
                            alt={writer.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {writer.username}
                            </div>
                            <div className="text-xs text-gray-500">
                              {writer.groups[0]}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center text-gray-500 text-sm">
                        {t("No writers found")}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {errors.writer && (
              <p className="text-red-500 text-xs mt-1">{errors.writer}</p>
            )}
          </div>
          {/* End Writer Selection */}

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
              {/* <option value="news">{t("News")}</option> */}
              <option value="videos">{t("Video")}</option>
              <option value="reports">{t("Reports")}</option>
            </select>
            {errors.report_type && (
              <p className="text-red-500 text-xs mt-1">{errors.report_type}</p>
            )}
          </div>
          {/* End Report Type */}

          {/* Start Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("Section")} *
            </label>
            <div className="relative" ref={sectionDropdownRef}>
              <button
                type="button"
                onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center gap-3 ${
                  errors.section ? "border-red-500" : "border-gray-300"
                }`}
              >
                {formData?.section ? (
                  <>
                    <Tag className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {sectionsList.find(
                          (sec) =>
                            sec.id ===
                            (formData.section?.id || formData.section)
                        )?.name || t("Select Section")}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Tag className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-500">{t("Select Section")}</span>
                  </>
                )}
              </button>

              {showSectionDropdown && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
                  {/* Search Box */}
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={sectionSearchValue}
                          onChange={(e) =>
                            setSectionSearchValue(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              getSections(sectionSearchValue);
                            }
                          }}
                          placeholder={t("Search sections...")}
                          className="w-full px-3 py-1.5 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        {sectionSearchValue && (
                          <button
                            type="button"
                            onClick={() => {
                              setSectionSearchValue("");
                              getSections("");
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
                          getSections(sectionSearchValue);
                        }}
                        className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        title={t("Search")}
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Sections List */}
                  <div className="max-h-60 overflow-y-auto">
                    {sectionsList.length > 0 ? (
                      sectionsList.map((section) => (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => handleSectionSelect(section)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                        >
                          <Tag className="w-5 h-5 text-blue-600" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {section.name}
                            </div>
                            {section.description && (
                              <div className="text-xs text-gray-500">
                                {section.description}
                              </div>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center text-gray-500 text-sm">
                        {t("No sections found")}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {errors.section && (
              <p className="text-red-500 text-xs mt-1">{errors.section}</p>
            )}
          </div>
          {/* End Section */}

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

          {/* Start Language */}
          <div>
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
          </div>
          {/* End Language */}

          {/* Start Duration Minutes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Duration (Minutes)")} *
            </label>
            <input
              type="number"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleInputChange}
              min="0"
              className={`w-full p-3 border rounded-lg outline-none ${
                errors.duration_minutes ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("Enter duration in minutes")}
            />
            {errors.duration_minutes && (
              <p className="text-red-500 text-xs mt-1">
                {errors.duration_minutes}
              </p>
            )}
          </div>
          {/* End Duration Minutes */}

          {/* Start Happened At */}
          <div className="-mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Happened At")} *
            </label>
            <Popover
              open={openHappendAt}
              onOpenChange={setOpenHappendAt}
              className="!z-[999999999999999]"
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.happened_at && "text-muted-foreground",
                    errors.happened_at && "border-red-500"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.happened_at
                    ? format(new Date(formData.happened_at), "MM/dd/yyyy")
                    : t("Pick Happened At date")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={
                    formData.happened_at
                      ? new Date(formData.happened_at)
                      : undefined
                  }
                  onSelect={(date) => {
                    handleInputChange({
                      target: { name: "happened_at", value: date },
                    });
                    setOpenHappendAt(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {errors.happened_at && (
              <p className="text-red-500 text-xs mt-1">{errors.happened_at}</p>
            )}
          </div>
          {/* End Air Date */}

          {/* Start Video Fields - Only show if report_type is videos */}
          {formData.report_type === "videos" && (
            <>
              {/* Start Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("Video URL")} *
                </label>
                <input
                  type="text"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg outline-none ${
                    errors.video_url ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t("Enter video URL (YouTube)")}
                />
                {errors.video_url && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.video_url}
                  </p>
                )}
              </div>
              {/* End Video URL */}

              {/* Start Cast */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("Cast")} *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={castInput}
                    onChange={(e) => setCastInput(e.target.value)}
                    onKeyPress={handleCastInput}
                    className={`flex-1 p-3 border rounded-lg outline-none ${
                      errors.cast ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={t("Add cast member (press Enter)")}
                  />
                </div>
                {formData.cast && formData.cast.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.cast.map((cast, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                      >
                        <span>{cast}</span>
                        <button
                          type="button"
                          onClick={() => removeCast(cast)}
                          className="text-blue-800 hover:text-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.cast && (
                  <p className="text-red-500 text-xs mt-1">{errors.cast}</p>
                )}
              </div>
              {/* End Cast */}

              {/* Start Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("Tags")} *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    onKeyPress={handleTagsInput}
                    className={`flex-1 p-3 border rounded-lg outline-none ${
                      errors.tags ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={t("Add tags (press Enter)")}
                  />
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full"
                      >
                        <Tag size={14} />
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-purple-800 hover:text-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.tags && (
                  <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
                )}
              </div>
              {/* End Tags */}
            </>
          )}
          {/* End Video Fields */}

          {/* End Air Date */}
        </div>
        {/* End Two-Column Grid */}
        {/* Start Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Summary")} *
          </label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            rows={4}
            className={`w-full p-3 border rounded-lg outline-none ${
              errors.summary ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("Enter report summary")}
          />
          {errors.summary && (
            <p className="text-red-500 text-xs mt-1">{errors.summary}</p>
          )}
        </div>
        {/* End Summary */}

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
