import { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { processImageFile } from "@/Utility/imageConverter";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import {
  CreateLearn,
  EditLearnById,
  GetLearnCategoriesByType,
  GetLearnCategoryById,
} from "@/api/learn";
import { LEARN_FORM_DATA_INITIAL_STATE } from "@/constants/learn/learnConstant";
import { validateForm, isFormValid } from "@/Utility/Learn/validation";

export const useCreateOrEditLearn = (learn, onSectionChange) => {
  const { t, i18n } = useTranslation();

  // Category restriction: editor scoped to a specific learn category
  const restrictedCategoryId = (() => {
    const userType = localStorage.getItem("userType");
    const sectionName = localStorage.getItem("sectionName");
    const catId = localStorage.getItem("categoryName");
    return userType === "editor" && sectionName === "learn" && catId
      ? catId
      : null;
  })();
  const isRestrictedCategory = Boolean(restrictedCategoryId);

  // Form state
  const [formData, setFormData] = useState({
    ...LEARN_FORM_DATA_INITIAL_STATE,
    direction: "horizontal", // Default direction for cards
    is_event: false,
    start_event_date: "",
    start_event_time: "",
    duration: "", // Duration in HH:MM format
    event_title: "",
    guest_speakers: [],
    live_stream_link: "",
    author_name: "",
    author_country: "",
    event_date: "",
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [guestSpeakerInput, setGuestSpeakerInput] = useState("");

  // Dropdown state
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categorySearchValue, setCategorySearchValue] = useState("");

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Refs
  const categoryDropdownRef = useRef(null);

  // ============ API Functions ============

  const getCategories = async (type, search) => {
    try {
      const res = await GetLearnCategoriesByType(type, search);
      setCategoriesList(res?.data?.results || []);
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
    if (name === "learn_type") {
      getCategories(value);
      setErrors((prev) => ({
        ...prev,
        learn_type: "",
      }));
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
        is_event: false,
        start_event_date: "",
        start_event_time: "",
        duration: "",
        event_title: "",
        guest_speakers: [],
        live_stream_link: "",
      }));
      return;
    }

    if (name === "is_event") {
      newValue = checked;
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

  const handleGuestSpeakersInput = (e) => {
    if (e.key === "Enter" && guestSpeakerInput.trim()) {
      e.preventDefault();
      if (
        !(formData?.guest_speakers || []).includes(guestSpeakerInput.trim())
      ) {
        setFormData((prev) => ({
          ...prev,
          guest_speakers: [
            ...(prev.guest_speakers || []),
            guestSpeakerInput.trim(),
          ],
        }));
      }
      setGuestSpeakerInput("");
      if (errors.guest_speakers) {
        setErrors((prev) => ({
          ...prev,
          guest_speakers: "",
        }));
      }
    }
  };

  const removeGuestSpeaker = (guestToRemove) => {
    setFormData((prev) => ({
      ...prev,
      guest_speakers: prev.guest_speakers.filter(
        (item) => item !== guestToRemove,
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(formData, t, learn);
    setErrors(newErrors);

    if (!isFormValid(newErrors)) {
      toast.error(t("Please fix the errors in the form"));
      return;
    }

    // Create FormData for file upload
    const learnData = new FormData();

    // Add all text fields
    learnData.append("title", formData.title);
    learnData.append("subtitle", formData.subtitle);
    learnData.append("category", formData?.category?.id || formData?.category);
    // learnData.append("status", formData.status);
    learnData.append("learn_type", formData.learn_type);

    // Only append image if a new file was selected
    if (imageFile instanceof File) {
      learnData.append("image", imageFile);
    }

    // Add image_url if provided
    if (formData.image_url) {
      learnData.append("image_url", formData.image_url);
    }

    // Add direction for cards
    if (formData.learn_type === "cards") {
      learnData.append("direction", formData.direction);
    }

    // Add optional fields
    if (formData.author_name) {
      learnData.append("author_name", formData.author_name);
    }
    if (formData.author_country) {
      learnData.append("author_country", formData.author_country);
    }

    // Add event_date for posters only
    if (formData.event_date) {
      learnData.append("event_date", formData.event_date);
    }

    learnData.append("updated_at", new Date().toISOString());

    setIsLoading(true);
    try {
      learn?.id
        ? await EditLearnById(learn.id, learnData)
        : await CreateLearn(learnData);

      toast.success(
        learn?.id
          ? t("Learn updated successfully")
          : t("Learn created successfully"),
      );
      onSectionChange("learn");
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // ============ Effects ============

  // Initialize form data when editing
  useEffect(() => {
    if (learn) {
      const initialData = {
        title: learn.title || "",
        subtitle: learn.subtitle || "",
        category: learn.category || "",
        // status: learn.status || "draft",
        tags: learn.tags || "",
        language: learn.language || "",
        learn_type: learn.learn_type || "",
        image: learn.image || null,
        image_url: learn.image_url || "",
        direction: learn.direction || "horizontal",
        is_event: learn.is_event || false,
        start_event_date: learn.start_event_date || "",
        start_event_time: learn.start_event_time || "",
        duration: learn.duration || "",
        event_title: learn.event_title || "",
        guest_speakers: learn.guest_speakers || [],
        live_stream_link: learn.live_stream_link || "",
        author_name: learn.author_name || "",
        author_country: learn.author_country || "",
        event_date: learn.event_date || "",
      };
      setFormData(initialData);
      setInitialFormData(initialData);
      setHasChanges(false);
    } else {
      setInitialFormData(null);
      setHasChanges(false);
    }
  }, [learn]);

  // Check for changes when formData changes
  useEffect(() => {
    if (learn && initialFormData) {
      const hasTextChanges = Object.keys(initialFormData).some((key) => {
        return formData[key] !== initialFormData[key];
      });

      setHasChanges(hasTextChanges);
    }
  }, [formData, learn, initialFormData]);

  // Fetch writers and categories on mount
  useEffect(() => {
    if (learn?.category?.learn_type) {
      getCategories(learn?.category?.learn_type);
    }
  }, []);

  // Pre-set restricted category for new items (no existing learn)
  useEffect(() => {
    if (restrictedCategoryId && !learn) {
      GetLearnCategoryById(restrictedCategoryId)
        .then((res) => {
          const cat = res?.data;
          if (cat) {
            setFormData((prev) => ({
              ...prev,
              category: cat.id,
              learn_type: "cards",
            }));
            setCategoriesList([cat]);
            if (cat.learn_type) getCategories(cat.learn_type);
          }
        })
        .catch(console.error);
    }
  }, []);

  return {
    // Form state
    formData,
    hasChanges,
    errors,
    setErrors,
    imageFile,

    // Dropdown state
    showCategoryDropdown,
    setShowCategoryDropdown,
    categoriesList,
    categorySearchValue,
    setCategorySearchValue,

    // Loading state
    isLoading,

    // Refs
    categoryDropdownRef,

    // Handlers
    handleInputChange,
    handleImageUpload,
    handleCategorySelect,
    handleGuestSpeakersInput,
    removeGuestSpeaker,
    handleSubmit,

    // Additional state
    guestSpeakerInput,
    setGuestSpeakerInput,

    // API Functions
    getCategories,

    // Utilities
    i18n,
    t,

    // Restriction
    isRestrictedCategory,
  };
};
