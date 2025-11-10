import React, { useState, useEffect, useRef } from "react";

import {
  Save,
  Upload,
  Youtube,
  X,
  Tag,
  Search,
  Calendar,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CreateVideo,
  EditVideoById,
  GetVideoCategories,
  GetSeries,
  GetSeasonsBySeriesId,
} from "@/api/videos";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { languages } from "@/constants/constants";
import { processImageFile, isHeicFile } from "@/Utility/imageConverter";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import CustomBreadcrumb from "../../CustomBreadcrumb/CustomBreadcrumb";

const videoTypes = ["full_video", "unit_video"];

function CreateOrEditVideo({ onSectionChange, video = null }) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [seasonsList, setSeasonsList] = useState([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef(null);
  const [categorySearchValue, setCategorySearchValue] = useState("");
  const [openHappendAt, setOpenHappendAt] = useState(false);

  const [errors, setErrors] = useState({});
  const [castInput, setCastInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    // duration: "",
    category: "",
    video_type: "",
    language: "",
    thumbnail: null,
    thumbnail_url: "",
    is_featured: false,
    reference_code: "",
    video_url: "",
    season_name: "",
    happened_at: "",
    description: "",
    cast: [],
    tags: [],
  });
  // Initialize form data when editing
  useEffect(() => {
    if (video) {
      const initialData = {
        title: video?.title || "",
        // duration: video?.duration || "",
        category: video?.category || "",
        video_type: video?.video_type || "",
        language: video?.language || "",
        thumbnail: video?.thumbnail, // Reset file input
        thumbnail_url: video?.thumbnail_url || "",
        is_featured: video?.is_featured || false,
        reference_code: video?.reference_code || "",
        video_url: video?.video_url || "",
        season_name: video?.season_name?.id || "", // ID الـ season
        happened_at: video?.happened_at || "",
        description: video?.description || "",
        cast: video?.cast || [],
        tags: video?.tags || [],
      };
      setFormData(initialData);
      setInitialFormData(initialData);
      setHasChanges(false);

      // Set series ID and fetch its seasons
      const seriesId = video?.season_name?.season_title?.id;
      if (seriesId) {
        setSelectedSeriesId(seriesId);
        // Fetch seasons for this series
        fetchSeasonsBySeries(seriesId);
      }

      // Set existing thumbnail preview
      setImagePreview(video?.thumbnail || null);
    } else {
      setInitialFormData(null);
      setHasChanges(false);
    }
  }, [video]);

  const getCategories = async (searchVal = "") => {
    try {
      const res = await GetVideoCategories(10, 0, searchVal);
      setCategoriesList(res.data.results);
    } catch (err) {
      setErrorFn(err, t);
    }
  };

  // Fetch Series
  const fetchSeries = async () => {
    try {
      const res = await GetSeries();
      setSeriesList(res?.data?.results || []);
    } catch (err) {
      setErrorFn(err, t);
    }
  };

  // Fetch Seasons by Series ID
  const fetchSeasonsBySeries = async (seriesId) => {
    if (!seriesId) {
      setSeasonsList([]);
      return;
    }
    try {
      const res = await GetSeasonsBySeriesId(seriesId);
      setSeasonsList(res?.data?.results || []);
    } catch (err) {
      setErrorFn(err, t);
      setSeasonsList([]);
    }
  };

  // Handle Series Change
  const handleSeriesChange = (e) => {
    const seriesId = e.target.value;
    setSelectedSeriesId(seriesId);
    setFormData((prev) => ({
      ...prev,
      season_name: "", // Reset season when series changes
    }));
    fetchSeasonsBySeries(seriesId);

    // Clear error if exists
    if (errors.season_name) {
      setErrors((prev) => ({
        ...prev,
        season_name: "",
      }));
    }
  };

  // Handle input changes
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

    // If thumbnail_url is provided, update preview
    // if (name === "thumbnail_url" && value) {
    //   setImagePreview(value);
    //   // Clear the file thumbnail if URL is provided
    //   setFormData((prev) => ({
    //     ...prev,
    //     thumbnail: null,
    //   }));
    // }
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

    if (!formData?.thumbnail) {
      newErrors.thumbnail = t("Thumbnail is required");
    }

    if (!formData?.title.trim()) {
      newErrors.title = t("Title is required");
    }

    if (!formData?.category) {
      newErrors.category = t("Category is required");
    }

    if (!formData?.video_type) {
      newErrors.video_type = t("Type is required");
    }

    if (!formData?.language) {
      newErrors.language = t("Language is required");
    }

    if (!formData?.video_url.trim()) {
      newErrors.video_url = t("Video URL is required");
    } else if (!isValidYouTubeUrl(formData?.video_url)) {
      newErrors.video_url = t("Please enter a valid YouTube URL");
    }

    // if (!formData?.duration.trim()) {
    //   newErrors.duration = t("Duration is required");
    // }
    // Series and Season are optional
    if (selectedSeriesId && !formData?.season_name) {
      newErrors.season_name = t("Season is required when Series is selected");
    }

    if (!formData?.happened_at) {
      newErrors.happened_at = t("Happened At is required");
    }

    if (!formData?.description.trim()) {
      newErrors.description = t("Description is required");
    }

    if (!formData?.cast || formData?.cast.length === 0) {
      newErrors.cast = t("Cast is required");
    }

    if (!formData?.tags || formData?.tags.length === 0) {
      newErrors.tags = t("Tags are required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Validate YouTube URL
  const isValidYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("Please fix the errors in the form"));
      return;
    }

    // Create FormData for file upload
    const formDataToSend = new FormData();

    formDataToSend.append("title", formData?.title);
    formDataToSend.append(
      "category",
      formData?.category?.id || formData?.category
    );
    formDataToSend.append("video_type", "video");
    formDataToSend.append("language", formData?.language);
    formDataToSend.append("is_featured", formData?.is_featured);
    formDataToSend.append("reference_code", formData?.reference_code);
    formDataToSend.append("video_url", formData?.video_url);
    formDataToSend.append("season_name", formData?.season_name);
    // Format happened_at to ISO 8601 format (YYYY-MM-DDThh:mm:ss)
    if (formData?.happened_at) {
      const formattedDate = format(
        new Date(formData.happened_at),
        "yyyy-MM-dd'T'HH:mm:ss"
      );
      formDataToSend.append("happened_at", formattedDate);
    }
    formDataToSend.append("description", formData?.description);
    formDataToSend.append("cast", JSON.stringify(formData?.cast));
    formDataToSend.append("tags", JSON.stringify(formData?.tags));
    if (imagePreview instanceof File) {
      formDataToSend.append("thumbnail", imagePreview);
    }
    // Add thumbnail_url if provided
    if (formData?.thumbnail_url) {
      formDataToSend.append("thumbnail_url", formData?.thumbnail_url);
    }

    setIsLoading(true);

    try {
      video?.id
        ? await EditVideoById(video?.id, formDataToSend)
        : await CreateVideo(formDataToSend);

      toast.success(
        video?.id
          ? t("Video updated successfully")
          : t("Video created successfully")
      );
      onSectionChange("videos");
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for changes when formData changes
  useEffect(() => {
    if (video && initialFormData) {
      // Compare all fields
      const hasTextChanges = Object.keys(initialFormData).some((key) => {
        // Skip thumbnail file field (check if new file was uploaded separately)
        if (key === "thumbnail") {
          return false;
        }
        return formData[key] !== initialFormData[key];
      });

      // Check if new thumbnail has been uploaded
      const hasNewThumbnail = formData?.thumbnail !== null;

      setHasChanges(hasTextChanges || hasNewThumbnail);
    }
  }, [formData, video, initialFormData]);

  useEffect(() => {
    getCategories();
    fetchSeries();
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
    <div
      className="bg-white rounded-lg p-3 lg:p-6   w-full mx-4  overflow-y-auto"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Start Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Video List")}
        onBack={() => {
          onSectionChange("videos");
        }}
        page={video ? t("Edit Video") : t("Create New Video")}
      />
      {/* End Breadcrumb */}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Start Image Upload Section */}
        <div>
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <p className="text-xs md:text-sm text-blue-800">
              <strong>{t("Important")}:</strong>{" "}
              {t(
                "Please select an image with minimum dimensions of 300x200 pixels for best quality."
              )}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {t("Supported formats")}: PNG, WEBP, JPG, JPEG, HEIC
            </p>
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Video Thumbnail")} *
          </label>
          <div className="flex items-center gap-4">
            <div
              className={`w-32 h-24 border-2 border-dashed  border-gray-300 rounded-lg flex items-center justify-center`}
            >
              {imagePreview ? (
                <img
                  // src={imagePreview}
                  src={formData?.thumbnail}
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
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      // معالجة الصورة (تحويل HEIC إذا لزم الأمر)
                      const { file: processedFile, url } =
                        await processImageFile(file);

                      setImagePreview(processedFile);
                      setFormData((prev) => ({ ...prev, thumbnail: url }));
                      setErrors((prev) => ({
                        ...prev,
                        thumbnail: "",
                      }));
                    } catch (error) {
                      console.error("Error processing image:", error);
                      toast.error(t("Failed to process image"));
                    }
                  }
                }}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 border ${
                  errors.thumbnail ? "border-red-500" : ""
                } border-gray-300 rounded-md hover:bg-gray-50`}
              >
                <Upload className="h-4 w-4" />
                {t("Upload Image")}
              </label>
              <p className="text-xs text-gray-500 mt-1">
                {t("Recommended: 16:9 aspect ratio")}
              </p>
            </div>
          </div>
        </div>
        {/* End Image Upload Section */}

        {/* Start Thumbnail URL Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Thumbnail URL")} ({t("Alternative to file upload")})
          </label>
          <Input
            name="thumbnail_url"
            value={formData?.thumbnail_url}
            onChange={handleInputChange}
            placeholder={t("Enter thumbnail URL as alternative to file upload")}
          />
          <p className="text-xs text-gray-500 mt-1">
            {t("You can either upload a file above or provide a URL here")}
          </p>
        </div>
        {/* End Thumbnail URL Section */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Start Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Title")} *
              </label>
              <Input
                name="title"
                value={formData?.title}
                onChange={handleInputChange}
                placeholder={t("Enter video title")}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>
            {/* End Title */}

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
                              (formData?.category?.id || formData?.category)
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

            {/* Start Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Type")} *
              </label>
              <select
                name="video_type"
                value={formData?.video_type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.video_type ? "border-red-500" : "border-gray-300"
                } ${!formData?.video_type ? "text-gray-400" : "text-black"}`}
              >
                <option value="" hidden disabled>
                  {t("Select Type")}
                </option>

                {videoTypes.map((type) => (
                  <option key={type} className="text-black" value={type}>
                    {t(type)}
                  </option>
                ))}
              </select>

              {errors.video_type && (
                <p className="text-red-500 text-xs mt-1">{errors.video_type}</p>
              )}
            </div>
            {/* End Type */}
            {/* Start Series Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Series")}
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedSeriesId || ""}
                  onChange={handleSeriesChange}
                  className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !selectedSeriesId ? "text-gray-400" : "text-black"
                  } border-gray-300`}
                >
                  <option value="" disabled hidden>
                    {t("Select Series")}
                  </option>
                  {seriesList.map((series) => (
                    <option
                      key={series.id}
                      value={series.id}
                      className="text-black"
                    >
                      {series.name}
                    </option>
                  ))}
                </select>
                {selectedSeriesId && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSeriesId(null);
                      setSeasonsList([]);
                      setFormData((prev) => ({
                        ...prev,
                        season_name: "",
                      }));
                    }}
                    className="px-3 py-2 bg-red-100 text-red-600 border border-red-300 rounded-md hover:bg-red-200 transition-colors"
                    title={t("Clear selection")}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            {/* End Series Selection */}

            {/* Start Season Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Season")}
              </label>
              <div className="flex gap-2">
                <select
                  name="season_name"
                  value={formData?.season_name}
                  onChange={handleInputChange}
                  disabled={!selectedSeriesId || seasonsList.length === 0}
                  className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.season_name ? "border-red-500" : "border-gray-300"
                  } ${
                    !formData?.season_name ? "text-gray-400" : "text-black"
                  } ${
                    !selectedSeriesId || seasonsList.length === 0
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <option value="" disabled hidden>
                    {!selectedSeriesId
                      ? t("Select series first")
                      : seasonsList.length === 0
                      ? t("No seasons available")
                      : t("Select Season")}
                  </option>
                  {seasonsList.map((season) => (
                    <option
                      key={season.id}
                      value={season.id}
                      className="text-black"
                    >
                      {season.season_id}
                    </option>
                  ))}
                </select>
                {formData?.season_name && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        season_name: "",
                      }));
                    }}
                    className="px-3 py-2 bg-red-100 text-red-600 border border-red-300 rounded-md hover:bg-red-200 transition-colors"
                    title={t("Clear selection")}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {errors.season_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.season_name}
                </p>
              )}
            </div>
            {/* End Season Selection */}
            {/* Start Happened At */}
            <div>
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

              {errors.happened_at && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.happened_at}
                </p>
              )}
            </div>
            {/* End Happened At */}
            {/* Start Status Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData?.is_featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {t("Featured Video")}
                </label>
              </div>
            </div>
            {/* End Status Checkboxes */}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Start Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Language")} *
              </label>
              <select
                name="language"
                value={formData?.language}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.language
                    ? "border-red-500 text-red-500"
                    : !formData?.language
                    ? "border-gray-300 text-gray-400"
                    : "border-gray-300 text-black"
                }`}
              >
                <option value="" hidden disabled>
                  {t("Select Language")}
                </option>

                {languages.map((lang) => (
                  <option key={lang} className="text-black" value={lang}>
                    {t(lang)}
                  </option>
                ))}
              </select>

              {errors.language && (
                <p className="text-red-500 text-xs mt-1">{errors.language}</p>
              )}
            </div>
            {/* End Language */}

            {/* Start Duration */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Duration")} *
              </label>
              <Input
                name="duration"
                value={formData?.duration}
                onChange={handleInputChange}
                placeholder={t("e.g., 1h 28min or 15:30")}
                className={errors.duration ? "border-red-500" : ""}
              />
              {errors.duration && (
                <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
              )}
            </div> */}
            {/* End Duration */}

            {/* Start Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("YouTube URL")} *
              </label>
              <div className="relative">
                <Input
                  name="video_url"
                  value={formData?.video_url}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={`pl-10 ${
                    errors.video_url ? "border-red-500" : ""
                  }`}
                />
                <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.video_url && (
                <p className="text-red-500 text-xs mt-1">{errors.video_url}</p>
              )}
            </div>
            {/* End Video URL */}
            {/* Start Casts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Casts")} *
              </label>
              <div className="space-y-2">
                <Input
                  value={castInput}
                  onChange={(e) => setCastInput(e.target.value)}
                  onKeyDown={handleCastInput}
                  placeholder={t("Type a cast member name and press Enter")}
                  className={errors.cast ? "border-red-500" : ""}
                />
                {errors.cast && (
                  <p className="text-red-500 text-xs mt-1">{errors.cast}</p>
                )}
                {formData?.cast.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData?.cast.map((member, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        <User className="w-3 h-3" />
                        {member}
                        <button
                          type="button"
                          onClick={() => removeCast(member)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* End Casts */}
            {/* Start Tags  */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Tags")} *
              </label>
              <div className="space-y-2">
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyDown={handleTagsInput}
                  placeholder={t("Type a tag and press Enter")}
                  className={errors.tags ? "border-red-500" : ""}
                />
                {errors.tags && (
                  <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
                )}
                {formData?.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData?.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* End Tags  */}
          </div>
        </div>

        {/* Description - Full Width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Description")} *
          </label>
          <textarea
            name="description"
            value={formData?.description}
            onChange={handleInputChange}
            rows={4}
            placeholder={t("Enter video description")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSectionChange("videos")}
          >
            {t("Cancel")}
          </Button>
          <Button
            type="submit"
            className="flex items-center gap-2"
            disabled={video && !hasChanges}
          >
            <Save className="h-4 w-4" />
            {isLoading
              ? t("Saving...")
              : video
              ? t("Update Video")
              : t("Create Video")}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrEditVideo;
