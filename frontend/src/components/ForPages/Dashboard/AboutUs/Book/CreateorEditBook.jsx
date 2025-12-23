import React, { useState, useEffect, useRef } from "react";

import { Save, X, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { Button } from "@/components/ui/button";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { CreateBook, EditBookById, GetBooksGroups } from "@/api/books";

import CustomBreadcrumb from "../../CustomBreadcrumb/CustomBreadcrumb";

function CreateOrEditBook({ onSectionChange, selectedBook = null }) {
  const { t, i18n } = useTranslation();
  const categoryDropdownRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categorySearchValue, setCategorySearchValue] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});
  console.log("selectedBook:", selectedBook);
  const getCategories = async (searchVal = "") => {
    try {
      const res = await GetBooksGroups(10, 0, searchVal);
      setCategoriesList(res?.data?.results || res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // Initialize form data when editing
  useEffect(() => {
    if (selectedBook) {
      const initialData = {
        name: selectedBook?.name || "",
        description: selectedBook?.description || "",
        category: selectedBook?.category?.id || "",
      };
      setFormData(initialData);
      setInitialFormData(initialData);
      setHasChanges(false);
    } else {
      setInitialFormData(null);
      setHasChanges(false);
      setFormData({
        name: "",
        description: "",
        category: "",
      });
    }
  }, [selectedBook]);

  // Check for changes when formData changes
  useEffect(() => {
    if (selectedBook && initialFormData) {
      const hasTextChanges = Object.keys(initialFormData).some((key) => {
        return formData[key] !== initialFormData[key];
      });
      setHasChanges(hasTextChanges);
    }
  }, [formData, selectedBook, initialFormData]);

  // Handle input changes
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

  // Handle category search
  const handleCategorySearch = () => {
    getCategories(categorySearchValue);
  };

  // Handle clear category search
  const handleClearCategorySearch = () => {
    setCategorySearchValue("");
    getCategories("");
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("Name is required");
    }

    if (!formData.description.trim()) {
      newErrors.description = t("Description is required");
    }

    if (!formData.category) {
      newErrors.category = t("Group is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
      };

      if (selectedBook?.id) {
        await EditBookById(selectedBook.id, submitData);
      } else {
        await CreateBook(submitData);
      }

      toast.success(
        selectedBook?.id
          ? t("Book updated successfully")
          : t("Book created successfully")
      );
      onSectionChange("books");
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
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get selected category name for display
  const selectedCategoryName =
    categoriesList.find((cat) => cat.id === formData.category)?.name ||
    selectedBook?.category?.name ||
    "";

  return (
    <div
      className="bg-white rounded-lg p-4 mx-4 overflow-y-auto max-h-[calc(100vh-120px)]"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      {/* Start Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Books List")}
        onBack={() => {
          onSectionChange("books");
        }}
        page={selectedBook ? t("Edit Book") : t("Create New Book")}
      />
      {/* End Breadcrumb */}

      <form onSubmit={handleSubmit} className="space-y-6 mt-5 p-3  mx-auto">
        <div className="grid grid-cols-2 gap-3">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Title")} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t("Enter book title")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          {/* Start Gropus Selection */}
          <div ref={categoryDropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Groups")} *
            </label>
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className={`w-full px-4 py-2 border rounded-lg text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <span className={selectedCategoryName ? "" : "text-gray-400"}>
                {selectedCategoryName || t("Select Group")}
              </span>
              <Search className="h-4 w-4 text-gray-400" />
            </button>

            {showCategoryDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {/* Search Input */}
                <div className="sticky top-0 p-3 border-b border-gray-200 bg-white">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t("Search groups...")}
                      value={categorySearchValue}
                      onChange={(e) => setCategorySearchValue(e.target.value)}
                      onKeyUp={handleCategorySearch}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                {/* Category List */}
                <div>
                  {categoriesList.length > 0 ? (
                    categoriesList.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleCategorySelect(category)}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                          formData.category === category.id
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : ""
                        }`}
                      >
                        {category.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      {t("No Groups found")}
                    </div>
                  )}
                </div>
              </div>
            )}

            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>
          {/* End Category Selection */}
        </div>
        {/* Start Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Description")} *
          </label>
          <CKEditor
            editor={ClassicEditor}
            data={formData.description}
            config={{
              placeholder: t("Enter the full content of the post"),
              language: i18n.language === "ar" ? "ar" : "en",
              // Custom upload adapter to suppress filerepository-no-upload-adapter error.
              extraPlugins: [MyCustomUploadAdapterPlugin],
              // Optional: remove plugins that may try to upload to server automatically.
              removePlugins: [
                // If build contains these and you don't want server upload.
                "MediaEmbedToolbar",
              ],
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
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>
        {/* End Description Field */}

        {/* Submit Buttons */}
        <div className="flex gap-3 justify-end pt-6 border-t">
          <Button
            type="button"
            onClick={() => onSectionChange("books")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {t("Cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isLoading || (selectedBook && !hasChanges)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {selectedBook ? t("Update Book") : t("Create Book")}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrEditBook;

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
