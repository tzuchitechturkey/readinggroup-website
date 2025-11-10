import React, { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { X, User, Search, Tag, Calendar, Upload } from "lucide-react";
import { format } from "date-fns";

import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import {
  CreateTvProgram,
  EditTvProgramById,
  GetNewsCategories,
} from "@/api/tvPrograms";
import Loader from "@/components/Global/Loader/Loader";
import { GetAllUsers } from "@/api/info";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import CustomBreadcrumb from "../../../CustomBreadcrumb/CustomBreadcrumb";

const CreateOrEditNews = ({ onSectionChange, news = null }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const writerDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const [showWriterDropdown, setShowWriterDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [writerSearchValue, setWriterSearchValue] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [writersList, setWritersList] = useState([]);
  const [categorySearchValue, setCategorySearchValue] = useState("");
  const [openAirDate, setOpenAirDate] = useState(false);
  const [formData, setFormData] = useState({
    image: null,
    image_url: "",
    title: "",
    description: "",
    air_date: "",
    writer: "",
    category: "",
    is_live: false,
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
      const res = await GetNewsCategories(10, 0, searchVal);
      setCategoriesList(res?.data?.results);
    } catch (error) {
      console.error(error);
    }
  };
  // Reset form when modal opens/closes or TV changes
  useEffect(() => {
    if (news?.id) {
      setFormData({
        title: news.title || "",
        description: news.description || "",
        air_date: news.air_date || "",
        writer: news.writer || "",
        category: news.category || "",
        image: null, // Reset file input
        image_url: news.image_url || "",
        is_live: news.is_live || false,
      });
      // Set existing image preview for editing
      setImagePreview(news.image || news.image_url || "");
    } else {
      setFormData({
        image: null,
        image_url: "",
        title: "",
        description: "",
        air_date: "",
        writer: "",
        category: "",
        is_live: false,
      });
      setImagePreview("");
    }
    // } else {
    //   // Clean up preview URL when modal closes
    //   if (imagePreview && imagePreview.startsWith("blob:")) {
    //     URL.revokeObjectURL(imagePreview);
    //   }
    // }
  }, [news]);

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
  // Reset form function
  const resetForm = () => {
    setFormData({
      image: null,
      image_url: "",
      title: "",
      description: "",
      air_date: "",
      writer: "",
      category: "",
      is_live: false,
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

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t("Title is required");
    }

    if (!formData.description.trim()) {
      newErrors.description = t("Description is required");
    }

    if (!formData.air_date) {
      newErrors.air_date = t("Air date is required");
    }

    if (!formData.writer) {
      newErrors.writer = t("Writer is required");
    }

    if (!formData.category) {
      newErrors.category = t("Category is required");
    }

    if (!formData.image && !formData.image_url && !news?.id) {
      newErrors.image = t("Image is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Create FormData object to handle file uploads
    const submitData = new FormData();

    // Append text fields
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);

    // تحويل التاريخ إلى صيغة YYYY-MM-DD
    const airDateFormatted = formData.air_date
      ? format(new Date(formData.air_date), "yyyy-MM-dd")
      : "";
    submitData.append("air_date", airDateFormatted);

    submitData.append("writer", formData.writer);
    submitData.append("category", formData.category);
    submitData.append("image_url", formData.image_url);
    submitData.append("is_live", formData.is_live);

    // Append file if it exists
    if (formData.image) {
      submitData.append("image", formData.image);
    }

    setIsLoading(true);
    try {
      if (news?.id) {
        // Update existing TV program
        await EditTvProgramById(news.id, submitData);
        toast.success(t("TV Program updated successfully"));
      } else {
        // Add new TV program
        await CreateTvProgram(submitData);
        toast.success(t("TV Program created successfully"));
      }

      onSectionChange("newsList");
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
        backTitle={t("Back to Dashboard")}
        onBack={() => {
          onSectionChange("dashboard");
        }}
        page={news?.id ? t("Edit News") : t("Create New News")}
      />
      {/* End Breadcrumb */}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Start Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Program Image")} *
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
            placeholder={t("Enter image URL as alternative to file upload")}
          />
          <p className="text-xs text-gray-500 mt-1">
            {t("You can either upload a file above or provide a URL here")}
          </p>
        </div>
        {/* End Image URL Section */}
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
            placeholder={t("Enter program title")}
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
            className={`w-full p-3 border rounded-lg outline-none ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("Enter program description")}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>
        {/* End Description */}

        {/* Start Date and Writer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
        {/* End Date and Writer Row */}

        {/* Start Category and Image Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Air Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Air Date")} *
            </label>
            <Popover
              open={openAirDate}
              onOpenChange={setOpenAirDate}
              className="!z-[999999999999999]"
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.air_date && "text-muted-foreground",
                    errors.air_date && "border-red-500"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.air_date
                    ? format(new Date(formData.air_date), "MM/dd/yyyy") // عرض التاريخ بالإنجليزي
                    : "Pick Air date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={
                    formData.air_date ? new Date(formData.air_date) : undefined
                  }
                  onSelect={(date) => {
                    handleInputChange({
                      target: { name: "air_date", value: date },
                    });
                    setOpenAirDate(false);
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

            {errors.air_date && (
              <p className="text-red-500 text-xs mt-1">{errors.air_date}</p>
            )}
          </div>
          {/* End Air Date */}
          {/* Start Is Live */}
          <div className="flex items-center gap-3 pt-8">
            <input
              type="checkbox"
              id="is_live"
              name="is_live"
              checked={formData.is_live}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="is_live"
              className="text-sm font-medium text-gray-700"
            >
              {t("Live Program")}
            </label>
          </div>
          {/* End Is Live */}
        </div>
        {/* End Image URL and Is Live Row */}

        {/* Start Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onSectionChange("news");
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-white border-[1px] border-primary hover:text-primary transition-all duration-200"
          >
            {news?.id ? t("Save Changes") : t("Add Program")}
          </button>
        </div>
        {/* End Actions */}
      </form>
    </div>
  );
};

export default CreateOrEditNews;
