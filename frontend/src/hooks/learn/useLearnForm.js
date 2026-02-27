import { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { format } from "date-fns";

import { processImageFile } from "@/Utility/imageConverter";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import {
  CreateLearn,
  EditLearnById,
  GetLearnCategoriesByType,
} from "@/api/learn";
import { LEARN_FORM_DATA_INITIAL_STATE } from "@/constants/learn/learnConstant";
import { validateForm, isFormValid } from "@/Utility/Learn/validation";

export const useCreateOrEditLearn = (learn, onSectionChange) => {
  const { t, i18n } = useTranslation();

  // Form state
  const [formData, setFormData] = useState({
    ...LEARN_FORM_DATA_INITIAL_STATE,
    direction: "horizontal", // Default direction for cards
    is_event: false,
    date: "",
    event_title: "",
    guest_speakers: [],
    live_stream_link: "",
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

  const getCategories = async (type) => {
    try {
      const res = await GetLearnCategoriesByType(type);
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
      // Reset is_event when changing learn_type
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
        is_event: false,
        date: "",
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

    // Add event-related fields for posters
    if (formData.learn_type === "posters" && formData.is_event) {
      learnData.append("is_event", true);
      if (formData.date) {
        const formattedDate = format(new Date(formData.date), "yyyy-MM-dd");
        learnData.append("event_date", formattedDate);
      }
      learnData.append("event_title", formData.event_title);
      learnData.append(
        "guest_speakers",
        JSON.stringify(formData.guest_speakers),
      );
      learnData.append("live_stream_link", formData.live_stream_link);
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
        date: learn.event_date || "",
        event_title: learn.event_title || "",
        guest_speakers: learn.guest_speakers || [],
        live_stream_link: learn.live_stream_link || "",
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
    getCategories("cards");
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
  };
};
