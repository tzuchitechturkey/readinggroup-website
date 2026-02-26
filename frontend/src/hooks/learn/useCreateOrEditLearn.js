import { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { processImageFile } from "@/Utility/imageConverter";
import { CreatePost, EditPostById, GetPostCategories } from "@/api/posts";
import { GetAuthors } from "@/api/authors";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { FORM_DATA_INITIAL_STATE } from "@/Utility/Learn/constants";
import { validateForm, isFormValid } from "@/Utility/Learn/validation";

export const useCreateOrEditPost = (post, onSectionChange) => {
  const { t, i18n } = useTranslation();

  // Form state
  const [formData, setFormData] = useState(FORM_DATA_INITIAL_STATE);
  const [initialFormData, setInitialFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Dropdown state
  const [showWriterDropdown, setShowWriterDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [writersList, setWritersList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [writerSearchValue, setWriterSearchValue] = useState("");
  const [categorySearchValue, setCategorySearchValue] = useState("");

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Refs
  const writerDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  // ============ API Functions ============

  const getWriters = async (searchVal = "") => {
    try {
      const res = await GetAuthors(10, 0, searchVal);
      setWritersList(res?.data?.results);
    } catch (error) {
      console.error("Error fetching writers:", error);
    }
  };

  const getCategories = async (searchVal = "") => {
    try {
      const res = await GetPostCategories(10, 0, searchVal);
      setCategoriesList(res?.data?.results);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // ============ Form Handlers ============

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let newValue;

    if (type === "checkbox") {
      newValue = checked;
    } else if (type === "file") {
      newValue = files[0];
    } else {
      newValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    try {
      const { file: processedFile, url } = await processImageFile(file);
      setImageFile(processedFile);
      setFormData((prev) => ({ ...prev, image: url }));

      // Clear error when uploading
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error(t("Failed to process image"));
    }
  };

  const handleWriterSelect = (writer) => {
    setFormData((prev) => ({
      ...prev,
      writer: writer.name,
      writer_avatar: writer.avatar || writer?.avatar_url,
    }));
    setShowWriterDropdown(false);
    setWriterSearchValue("");

    if (errors.writer) {
      setErrors((prev) => ({
        ...prev,
        writer: "",
      }));
    }
  };

  const handleWriterSearch = () => {
    getWriters(writerSearchValue);
  };

  const handleClearWriterSearch = () => {
    setWriterSearchValue("");
    getWriters("");
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      category: category.id,
    }));
    setShowCategoryDropdown(false);
    setCategorySearchValue("");

    if (errors.category) {
      setErrors((prev) => ({
        ...prev,
        category: "",
      }));
    }
  };

  const handleTagInput = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
      setErrors((prev) => ({
        ...prev,
        tags: "",
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(formData, t, post);
    setErrors(newErrors);

    if (!isFormValid(newErrors)) {
      toast.error(t("Please fix the errors in the form"));
      return;
    }

    // Create FormData for file upload
    const postData = new FormData();

    // Add all text fields
    postData.append("title", formData.title);
    postData.append("subtitle", formData.subtitle);
    postData.append("excerpt", formData.excerpt);
    postData.append("body", formData.body);
    postData.append("writer", formData.writer);
    postData.append("category", formData?.category?.id || formData?.category);
    postData.append("status", formData.status);
    postData.append("read_time", formData.read_time);
    postData.append("tags", JSON.stringify(formData.tags));
    postData.append("language", formData.language);
    postData.append("post_type", formData.post_type);
    postData.append("country", formData.country);
    postData.append("camera_name", formData.camera_name);

    // Only append image if a new file was selected
    if (imageFile instanceof File) {
      postData.append("image", imageFile);
    }

    // Add image_url if provided
    if (formData.image_url) {
      postData.append("image_url", formData.image_url);
    }

    // Add metadata if provided
    if (formData.metadata) {
      postData.append("metadata", formData.metadata);
    }

    // Add timestamps
    if (post) {
      postData.append("created_at", post.created_at);
      postData.append("views", post.views || 0);
    }
    postData.append("updated_at", new Date().toISOString());

    setIsLoading(true);
    try {
      post?.id
        ? await EditPostById(post.id, postData)
        : await CreatePost(postData);

      toast.success(
        post?.id
          ? t("Post updated successfully")
          : t("Post created successfully"),
      );
      onSectionChange("posts");
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // ============ Effects ============

  // Initialize form data when editing
  useEffect(() => {
    if (post) {
      const initialData = {
        title: post.title || "",
        subtitle: post.subtitle || "",
        excerpt: post.excerpt || "",
        body: post.body || "",
        writer: post.writer || "",
        writer_avatar: post.writer_avatar || "",
        category: post.category || "",
        status: post.status || "draft",
        read_time: post.read_time || "",
        tags: post.tags || "",
        language: post.language || "",
        post_type: post.post_type || "",
        image: post.image || null,
        image_url: post.image_url || "",
        metadata: post.metadata || "",
        country: post.country || "",
        camera_name: post.camera_name || "",
      };
      setFormData(initialData);
      setInitialFormData(initialData);
      setHasChanges(false);
    } else {
      setInitialFormData(null);
      setHasChanges(false);
    }
  }, [post]);

  // Check for changes when formData changes
  useEffect(() => {
    if (post && initialFormData) {
      const hasTextChanges = Object.keys(initialFormData).some((key) => {
        if (key === "tags") {
          return (
            JSON.stringify(formData[key]) !==
            JSON.stringify(initialFormData[key])
          );
        }
        return formData[key] !== initialFormData[key];
      });

      setHasChanges(hasTextChanges);
    }
  }, [formData, post, initialFormData]);

  // Fetch writers and categories on mount
  useEffect(() => {
    getWriters();
    getCategories();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        writerDropdownRef.current &&
        !writerDropdownRef.current.contains(event.target)
      ) {
        setShowWriterDropdown(false);
      }

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

  return {
    // Form state
    formData,
    setFormData,
    hasChanges,
    errors,
    setErrors,
    tagInput,
    setTagInput,
    imageFile,

    // Dropdown state
    showWriterDropdown,
    setShowWriterDropdown,
    showCategoryDropdown,
    setShowCategoryDropdown,
    writersList,
    categoriesList,
    writerSearchValue,
    setWriterSearchValue,
    categorySearchValue,
    setCategorySearchValue,

    // Loading state
    isLoading,

    // Refs
    writerDropdownRef,
    categoryDropdownRef,

    // Handlers
    handleInputChange,
    handleImageUpload,
    handleWriterSelect,
    handleWriterSearch,
    handleClearWriterSearch,
    handleCategorySelect,
    handleTagInput,
    removeTag,
    handleSubmit,

    // API Functions
    getCategories,

    // Utilities
    i18n,
    t,
  };
};
