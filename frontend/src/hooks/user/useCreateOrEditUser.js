import { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { CreateUser, EditUserById } from "@/api/user";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

export const useCreateOrEditUser = (user, onClose) => {
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    group: "",
    section_name: "",
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // ============ Form Handlers ============

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
  console.log(errors);
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = t("Username is required");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("Email is invalid");
    }

    if (!formData.group) {
      newErrors.group = t("Group is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      group: "",
      section_name: "",
    });
    setErrors({});
    setHasChanges(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (user?.id) {
        // Edit user
        await EditUserById(user.id, formData);
        toast.success(t("User updated successfully"));
      } else {
        // Create user
        await CreateUser(formData);
        toast.success(t("User created successfully"));
      }
      onClose(true); // true means data was changed
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user data if editing
  useEffect(() => {
    if (user?.id) {
      const loadUserData = async () => {
        try {
          setFormData({
            username: user?.username || "",
            email: user?.email || "",
            group: user?.groups?.[0] || "",
            section_name: user?.section_name || "",
          });
          setInitialFormData({
            username: user?.username || "",
            email: user?.email || "",
            group: user?.groups?.[0] || "",
            section_name: user?.section_name || "",
          });
        } catch (error) {
          setErrorFn(error, t);
        }
      };
      loadUserData();
    } else {
      resetForm();
      setInitialFormData(null);
    }
  }, [user?.id]);

  // Track changes
  useEffect(() => {
    if (initialFormData) {
      const changed =
        JSON.stringify(formData) !== JSON.stringify(initialFormData);
      setHasChanges(changed);
    }
  }, [formData, initialFormData]);

  return {
    formData,
    errors,
    isLoading,
    hasChanges,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
};
