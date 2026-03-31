import { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { CreateUser, EditUserById, GetUserById, GetUsers } from "@/api/user";
import { GetGroups } from "@/api/group";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

export const useCreateOrEditUser = (user, onClose) => {
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    group_id: "",
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const [groupsList, setGroupsList] = useState([]);

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

    if (!formData.group_id) {
      newErrors.group_id = t("Group is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      group_id: "",
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

  // Load groups
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const res = await GetGroups();
        setGroupsList(res?.data?.results || []);
      } catch (error) {
        console.error("Error loading groups:", error);
      }
    };
    loadGroups();
  }, []);

  // Load user data if editing
  useEffect(() => {
    if (user?.id) {
      const loadUserData = async () => {
        try {
          const res = await GetUserById(user.id);
          const loadedUser = res?.data;
          setFormData({
            username: loadedUser?.username || "",
            email: loadedUser?.email || "",
            group_id: loadedUser?.groups?.[0] || "",
          });
          setInitialFormData({
            username: loadedUser?.username || "",
            email: loadedUser?.email || "",
            group_id: loadedUser?.groups?.[0] || "",
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
      const changed = JSON.stringify(formData) !== JSON.stringify(initialFormData);
      setHasChanges(changed);
    }
  }, [formData, initialFormData]);

  return {
    formData,
    errors,
    isLoading,
    hasChanges,
    groupsList,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
};
