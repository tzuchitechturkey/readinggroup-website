import React, { useState, useEffect, useRef } from "react";

import {
  Save,
  Upload,
  Youtube,
  X,
  Tag,
  Search,
  User,
  Loader2,
} from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import AutoComplete from "@/components/Global/AutoComplete/AutoComplete";
import {
  CreateVideo,
  EditVideoById,
  GetVideoCategories,
  // GetSeries,
  // GetSeasonsBySeriesId,
  FetchYouTubeInfo,
} from "@/api/videos";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { languages, postStatusOptions } from "@/constants/constants";
import { processImageFile } from "@/Utility/imageConverter";

import CustomBreadcrumb from "../../CustomBreadcrumb/CustomBreadcrumb";
import DatePickerWithYearMonth from "./DatePickerWithYearMonth";

function CreateOrEditVideo({ onSectionChange, video = null }) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  // const [seriesList, setSeriesList] = useState([]);
  // const [seasonsList, setSeasonsList] = useState([]);
  // const [selectedSeries, setSelectedSeries] = useState(null);
  // const [selectedSeason, setSelectedSeason] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef(null);
  const [categorySearchValue, setCategorySearchValue] = useState("");
  const [errors, setErrors] = useState({});
  const [castInput, setCastInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isFetchingYoutube, setIsFetchingYoutube] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    video_type: "",
    language: "",
    thumbnail: null,
    thumbnail_url: "",
    is_featured: false,
    reference_code: "",
    video_url: "",
    happened_at: "",
    description: "",
    cast: [],
    tags: [],
    status: "",
    duration: "",
    // season_name: "",
  });
  // Initialize form data when editing
  useEffect(() => {
    if (video) {
      const initialData = {
        title: video?.title || "",
        category: video?.category || "",
        language: video?.language || "",
        thumbnail: video?.thumbnail, // Reset file input
        thumbnail_url: video?.thumbnail_url || "",
        is_featured: video?.is_featured || false,
        reference_code: video?.reference_code || "",
        video_url: video?.video_url || "",
        happened_at: video?.happened_at || "",
        description: video?.description || "",
        tags: video?.tags || [],
        status: video?.status || "",
        duration: video?.duration || "",
        cast: video?.cast || [],
        // season_name: video?.season_name?.id || "", // ID الـ season
      };
      setFormData(initialData);
      setInitialFormData(initialData);
      setHasChanges(false);

      // Set series and season objects when editing
      // const seriesData = video?.season_name?.season_title;
      // const seasonData = video?.season_name;

      // if (seriesData) {
      //   setSelectedSeries(seriesData);
      //   // Fetch seasons for this series
      //   fetchSeasonsBySeries(seriesData.id);
      // }

      // if (seasonData) {
      //   setSelectedSeason(seasonData);
      // }

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

  // Fetch Series with search support for AutoComplete
  // const fetchSeries = async (searchVal = "") => {
  //   try {
  //     const res = await GetSeries(searchVal); // Pass search value to API
  //     setSeriesList(res?.data?.results || []);
  //   } catch (err) {
  //     setErrorFn(err, t);
  //   }
  // };

  // Fetch Seasons by Series ID
  // const fetchSeasonsBySeries = async (seriesId) => {
  //   if (!seriesId) {
  //     setSeasonsList([]);
  //     return;
  //   }
  //   try {
  //     const res = await GetSeasonsBySeriesId(seriesId);
  //     setSeasonsList(res?.data?.results || []);
  //   } catch (err) {
  //     setErrorFn(err, t);
  //     setSeasonsList([]);
  //   }
  // };

  // Handle Series Selection from AutoComplete
  // const handleSeriesSelect = (series) => {
  //   setSelectedSeries(series);
  //   setSelectedSeason(null); // Reset selected season object
  //   setFormData((prev) => ({
  //     ...prev,
  //     season_name: "", // Reset season when series changes
  //   }));
  //   fetchSeasonsBySeries(series?.id);

  //   // Clear error if exists
  //   if (errors.season_name) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       season_name: "",
  //     }));
  //   }
  // };

  // Handle Clear Series Selection
  // const handleClearSeries = () => {
  //   setSelectedSeries(null);
  //   setSelectedSeason(null); // Clear selected season object
  //   setSeasonsList([]);
  //   setFormData((prev) => ({
  //     ...prev,
  //     season_name: "",
  //   }));
  // };

  // Handle Season Selection from AutoComplete
  // const handleSeasonSelect = (season) => {
  //   setSelectedSeason(season);
  //   setFormData((prev) => ({
  //     ...prev,
  //     season_name: season.id,
  //   }));

  //   // Clear error if exists
  //   if (errors.season_name) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       season_name: "",
  //     }));
  //   }
  // };

  // Handle Clear Season Selection
  // const handleClearSeason = () => {
  //   setSelectedSeason(null);
  //   setFormData((prev) => ({
  //     ...prev,
  //     season_name: "",
  //   }));
  // };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setHasChanges(true);

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
        setHasChanges(true);
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
    setHasChanges(true);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Thumbnail is optional now (users can provide thumbnail_url or skip it)

    if (!formData?.title.trim()) {
      newErrors.title = t("Title is required");
    }

    if (!formData?.category) {
      newErrors.category = t("Category is required");
    }

    if (!formData?.language) {
      newErrors.language = t("Language is required");
    }

    if (!formData?.status) {
      newErrors.status = t("Status is required");
    }

    if (!formData?.video_url.trim()) {
      newErrors.video_url = t("Video URL is required");
    } else if (!isValidYouTubeUrl(formData?.video_url)) {
      newErrors.video_url = t("Please enter a valid YouTube URL");
    }

    // Series and Season are optional
    // if (selectedSeries && !formData?.season_name) {
    //   newErrors.season_name = t("Season is required when Series is selected");
    // }

    if (!formData?.happened_at) {
      newErrors.happened_at = t("Happened At is required");
    }

    if (!formData?.description.trim()) {
      newErrors.description = t("Description is required");
    }

    // if (!formData?.cast || formData?.cast.length === 0) {
    //   newErrors.cast = t("Cast is required");
    // }

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
    formDataToSend.append("status", formData?.status);
    formDataToSend.append("is_featured", formData?.is_featured);
    formDataToSend.append("reference_code", formData?.reference_code);
    formDataToSend.append("video_url", formData?.video_url);
    // formDataToSend.append("season_name", formData?.season_name);
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
    if (formData?.duration) {
      formDataToSend.append("duration", formData?.duration);
    }
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

  const handleFetchYouTubeInfo = async () => {
    const url = formData?.video_url?.trim();

    if (!url) {
      setErrors((prev) => ({
        ...prev,
        video_url: t("Video URL is required"),
      }));
      toast.error(t("Please enter a YouTube URL"));
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setErrors((prev) => ({
        ...prev,
        video_url: t("Please enter a valid YouTube URL"),
      }));
      toast.error(t("Please enter a valid YouTube URL"));
      return;
    }

    setIsFetchingYoutube(true);

    try {
      const response = await FetchYouTubeInfo({ video_url: url });
      const data = response?.data || {};
      setFormData((prev) => {
        const preferredOrder = [
          "maxres",
          "high",
          "standard",
          "medium",
          "default",
        ];
        const thumbnails = data?.thumbnails || {};
        const fallbackThumb = preferredOrder
          .map((key) => thumbnails?.[key]?.url)
          .find((thumb) => Boolean(thumb));

        const next = {
          ...prev,
          title: prev.title || data?.title || "",
          description: prev.description || data?.description || "",
          reference_code: prev.reference_code || data?.reference_code || "",
          language: prev.language || data?.default_language || "",
          duration: prev.duration || data?.duration_formatted || "",
          thumbnail_url:
            prev.thumbnail_url ||
            thumbnails?.standard?.url ||
            prev.thumbnail_url,
          happened_at:
            prev.happened_at || data?.published_at || prev.happened_at,
        };

        if (!prev.thumbnail_url && fallbackThumb) {
          setImagePreview(fallbackThumb);
        }

        return next;
      });

      setErrors((prev) => ({
        ...prev,
        title: "",
        description: "",
        reference_code: "",
        language: "",
        video_url: "",
      }));
      setHasChanges(true);
      toast.success(t("YouTube details fetched successfully"));
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsFetchingYoutube(false);
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
    // fetchSeries();
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
            {t("Video Thumbnail")}
          </label>
          <div className="flex items-center gap-4">
            <div
              className={`w-32 h-24 border-2 border-dashed  border-gray-300 rounded-lg flex items-center justify-center`}
            >
              {imagePreview ? (
                <img
                  // src={imagePreview}
                  src={
                    formData?.thumbnail ||
                    formData?.thumbnail_url ||
                    imagePreview
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                              i18n?.language === "ar"
                                ? "text-right"
                                : "text-left"
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
                              i18n?.language === "ar"
                                ? "text-right"
                                : "text-left"
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

            {/* Start Type */}
            {/* <div>
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
            </div> */}
            {/* End Type */}
            {/* Start Series Selection with AutoComplete */}
            {/* <AutoComplete
              label={t("Series")}
              placeholder={t("Select Series")}
              selectedItem={selectedSeries}
              onSelect={handleSeriesSelect}
              onClear={handleClearSeries}
              list={seriesList}
              searchMethod={fetchSeries}
              searchApi={true}
              searchPlaceholder={t("Search series...")}
              required={false}
              renderItemLabel={(item) => item.name}
              customStyle="bg-white"
              showWriterAvatar={false}
              isRtl={i18n?.language === "ar"}
            /> */}
            {/* End Series Selection */}

            {/* Start Season Selection with AutoComplete */}
            {/* <AutoComplete
              label={t("Season")}
              placeholder={
                !selectedSeries
                  ? t("Select series first")
                  : seasonsList.length === 0
                  ? t("No seasons available")
                  : t("Select Season")
              }
              selectedItem={selectedSeason}
              onSelect={handleSeasonSelect}
              onClear={handleClearSeason}
              list={seasonsList}
              searchMethod={null}
              searchApi={false}
              required={false}
              renderItemLabel={(item) => item.season_id}
              customStyle="bg-white"
              showWriterAvatar={false}
              isRtl={i18n?.language === "ar"}
              disabled={!selectedSeries || seasonsList.length === 0}
              error={errors.season_name}
            />
            {errors.season_name && (
              <p className="text-red-500 text-xs mt-1">{errors.season_name}</p>
            )} */}
            {/* End Season Selection */}
            {/* Start Happened At */}
            <div>
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
                <p className="text-red-500 text-xs mt-1">
                  {errors.happened_at}
                </p>
              )}
            </div>
            {/* End Happened At */}
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
                <label className="mx-2 text-sm text-gray-700">
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

            {/* Start Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Status")} *
              </label>
              <select
                name="status"
                value={formData?.status}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.status
                    ? "border-red-500 text-red-500"
                    : !formData?.status
                    ? "border-gray-300 text-gray-400"
                    : "border-gray-300 text-black"
                }`}
              >
                <option value="" hidden disabled>
                  {t("Select Status")}
                </option>

                {postStatusOptions.map((option) => (
                  <option
                    key={option.value}
                    className="text-black"
                    value={option.value}
                  >
                    {t(option.label)}
                  </option>
                ))}
              </select>

              {errors.status && (
                <p className="text-red-500 text-xs mt-1">{errors.status}</p>
              )}
            </div>
            {/* End Status */}

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
                  className={`pl-10 pr-28 ${
                    errors.video_url ? "border-red-500" : ""
                  }`}
                />
                <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleFetchYouTubeInfo}
                  disabled={isFetchingYoutube}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {isFetchingYoutube ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-1">
                      <Search className="h-3 w-3" />
                      {t("Fetch info")}asdasd
                    </span>
                  )}
                </Button>
              </div>
              {errors.video_url && (
                <p className="text-red-500 text-xs mt-1">{errors.video_url}</p>
              )}
            </div>
            {/* End Video URL */}
            {/* Start Casts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Casts")}
                {/* * */}
              </label>
              <div className="space-y-2">
                <Input
                  value={castInput}
                  onChange={(e) => setCastInput(e.target.value)}
                  onKeyDown={handleCastInput}
                  placeholder={t("Type a cast member name and press Enter")}
                  // className={errors.cast ? "border-red-500" : ""}
                />
                {/* {errors.cast && (
                  <p className="text-red-500 text-xs mt-1">{errors.cast}</p>
                )} */}
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
          </div>
        </div>

        {/* Description - Full Width */}
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
                placeholder: t("Enter the full content of the Video"),
                language: i18n.language === "ar" ? "ar" : "en",
                extraPlugins: [MyCustomUploadAdapterPlugin],
                removePlugins: [
                  "CKFinder",
                  "CKFinderUploadAdapter",
                  "Image",
                  "ImageToolbar",
                  "ImageCaption",
                  "ImageStyle",
                  "ImageResize",
                  "ImageUpload",
                  "EasyImage",
                  "MediaEmbed",
                  "MediaEmbedToolbar",
                ],
                toolbar: {
                  // تأكد أن شريط الأدوات لا يحتوي على أزرار رفع/صورة
                  items: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "|",
                    "bulletedList",
                    "numberedList",
                    "|",
                    "undo",
                    "redo",
                  ],
                },
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
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {t("This is the description that will be displayed to viewers")}
          </p>
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
// CKEditor custom upload adapter plugin (Base64 inline images)
function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new Base64UploadAdapter(loader);
  };
}

class Base64UploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({ default: reader.result });
          };
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        })
    );
  }
  abort() {
    // No special abort handling needed for Base64 conversion.
  }
}
