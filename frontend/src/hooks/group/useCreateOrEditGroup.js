import { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { CreateGroup, EditGroupById, GetGroupById } from "@/api/group";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

export const useCreateOrEditGroup = (group, onClose) => {
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("Group name is required");
    }

    if (!formData.section_name) {
      newErrors.section_name = t("Content type is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
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
      if (group?.id) {
        // Edit group
        await EditGroupById(group.id, formData);
        toast.success(t("Group updated successfully"));
      } else {
        // Create group
        await CreateGroup(formData);
        toast.success(t("Group created successfully"));
      }
      onClose(true); // true means data was changed
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Load group data if editing
  useEffect(() => {
    if (group?.id) {
      const loadGroupData = async () => {
        try {
          const res = await GetGroupById(group.id);
          const loadedGroup = res?.data;
          setFormData({
            name: loadedGroup?.name || "",
            section_name: loadedGroup?.section_name || "",
          });
          setInitialFormData({
            name: loadedGroup?.name || "",
            section_name: loadedGroup?.section_name || "",
          });
        } catch (error) {
          setErrorFn(error, t);
        }
      };
      loadGroupData();
    } else {
      resetForm();
      setInitialFormData(null);
    }
  }, [group?.id]);

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
