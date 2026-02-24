import React, { useMemo, useState } from "react";

import { toast } from "react-toastify";

import CreateorEditCategoryModal from "@/components/ForPages/Dashboard/CreateorEditCategoryModal/CreateorEditCategoryModal";
import {
  AddVideoCategory,
  EditVideoCategoryById,
  GetVideoCategoryById,
} from "@/api/videos";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

function CreateorEditVideoCategory({
  showModal,
  setShowModal,
  t,
  originalForm,
  selectedLanguage,
  originalLanguage,
  form,
  isAutoTranslated,
  setSelectedLanguage,
  setIsAutoTranslated,
  setForm,
  setIsLoading,
  setUpdate,
}) {
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
  const [errors, setErrors] = useState({});

  // Check if name or description has changed from original
  const isContentChanged = useMemo(
    () =>
      form.name !== originalForm.name ||
      form.description !== originalForm.description,
    [form, originalForm],
  );

  // Load category data in selected language
  const loadCategoryByLanguage = async (categoryId, language) => {
    if (!categoryId) return;

    setIsLoadingTranslation(true);
    try {
      const res = await GetVideoCategoryById(categoryId);
      const categoryData = res?.data;

      setForm({
        name: categoryData.name || "",
        description: categoryData.description || "",
        is_active:
          categoryData.is_active !== undefined ? categoryData.is_active : false,
        video_count: categoryData.video_count || 0,
        id: categoryData.id,
      });
    } catch (err) {
      console.error("Error loading translation:", err);
      toast.error(t("Failed to load translation"));
    } finally {
      setIsLoadingTranslation(false);
    }
  };

  // Handle language change
  const handleLanguageChange = async (newLanguage) => {
    setSelectedLanguage(newLanguage);
    if (newLanguage !== originalLanguage && form?.id) {
      await loadCategoryByLanguage(form.id, newLanguage);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!form.name || !form.name.trim()) {
      newErrors.name = t("Name is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Map language names to language codes
  const languageCodeMap = {
    ar: "ar",
    en: "en",
    tr: "tr",
    ch: "ch",
    chsi: "chsi",
    fr: "fr",
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const languageCode = languageCodeMap[selectedLanguage];
    const submitData = { ...form };

    // إذا كانت عملية إنشاء جديدة، أرسل اللغة
    if (!form || !form.id) {
      submitData.language = languageCode;
    } else {
      // إذا كان تعديل:
      // إذا كان هناك key (ترجمة موجودة) ولم نعدل اللغة، أرسل الـ key
      // إذا أردنا تعديل الترجمات (اسم أو وصف)، لا نرسل الـ key
      // if (categoryKey) {
      //   submitData.key = categoryKey;
      // }
      // إضافة is_auto_translated إذا تم تعديل المحتوى
      if (isContentChanged) {
        submitData.is_auto_translated = isAutoTranslated;
      }
    }
    submitData.language = languageCode;
    setIsLoading(true);

    try {
      if (form.id) {
        await EditVideoCategoryById(form.id, form);
        toast.success(t("Category updated"));
      } else {
        await AddVideoCategory(form);
        toast.success(t("Category created"));
      }
      setShowModal(false);
      setUpdate((prev) => !prev);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Define form fields
  const fields = [
    {
      name: "name",
      label: t("Name"),
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: t("Description"),
      type: "textarea",
      rows: 4,
    },
  ];

  // Define toggle fields
  const toggleFields = [
    {
      name: "is_active",
      label: t("Status"),
      color: "green",
      activeLabel: "Active",
      inactiveLabel: "Inactive",
      validation: (form) => ({
        isValid: form.is_active || form.video_count > 0,
        message: t("Cannot activate category with no videos."),
      }),
    },
  ];

  return (
    <CreateorEditCategoryModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      title={form.id ? t("Edit Category") : t("Add Category")}
      // Form Data
      form={form}
      setForm={setForm}
      originalForm={originalForm}
      fields={fields}
      toggleFields={toggleFields}
      // Language & Translation
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
      originalLanguage={originalLanguage}
      isAutoTranslated={isAutoTranslated}
      setIsAutoTranslated={setIsAutoTranslated}
      // Loading States
      isLoading={false}
      isLoadingTranslation={isLoadingTranslation}
      onFetchTranslation={handleLanguageChange}
      // Validation
      onValidate={validateForm}
      errors={errors}
      setErrors={setErrors}
      // Submission
      onSubmit={handleSubmit}
      // Localization
      t={t}
      // Content Changed Flag
      isContentChanged={isContentChanged}
      // Options - disable language features for video categories
      showLanguageSelector={true}
      showAutoTranslate={true}
      showStatusToggle={true}
    />
  );
}

export default CreateorEditVideoCategory;
