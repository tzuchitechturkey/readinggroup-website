import React, { useMemo, useState } from "react";

import { toast } from "react-toastify";

import CreateorEditCategoryModal from "@/components/ForPages/Dashboard/CreateorEditCategoryModal/CreateorEditCategoryModal";
import { AddLearnCategory, EditLearnCategoryById } from "@/api/learn";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

function CreateorEditLearnCategory({
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
  // const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
  const [errors, setErrors] = useState({});

  // Check if name or description has changed from original
  const isContentChanged = useMemo(
    () =>
      form.name !== originalForm.name ||
      form.description !== originalForm.description,
    [form, originalForm],
  );

  // Load category data in selected language
  // const loadCategoryByLanguage = async (categoryId, language) => {
  //   if (!categoryId) return;

  //   setIsLoadingTranslation(true);
  //   try {
  //     const res = await GetLearnCategoryById(categoryId, language);

  //     const categoryData = res?.data;
  //     setForm({
  //       name: categoryData.name || "",
  //       description: categoryData.description || "",
  //       is_active:
  //         categoryData.is_active !== undefined ? categoryData.is_active : false,
  //       post_count: categoryData.post_count || 0,
  //     });
  //   } catch (err) {
  //     console.error("Error loading translation:", err);
  //     toast.error(t("Failed to load translation"));
  //   } finally {
  //     setIsLoadingTranslation(false);
  //   }
  // };

  // Handle language change and fetch translated data
  // const handleLanguageChange = async (newLanguage) => {
  //   setSelectedLanguage(newLanguage);
  //   // Only fetch if language changed and we're editing an existing category
  //   if (newLanguage !== originalLanguage && form?.id) {
  //     await loadCategoryByLanguage(form.id, newLanguage);
  //   }
  // };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setForm((prev) => ({ ...prev, [name]: value }));

  //   // إزالة الخطأ عند الإدخال
  //   if (errors[name]) {
  //     setErrors((prev) => ({ ...prev, [name]: "" }));
  //   }
  // };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name || !form.name.trim()) {
      newErrors.name = t("Name is required");
    }
    if (!form.learn_type || !form.learn_type.trim()) {
      newErrors.learn_type = t("Learn Type is required");
    }
    if (
      (!form.direction || !form.direction.trim()) &&
      form.learn_type === "cards"
    ) {
      newErrors.direction = t("Direction is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Map language names to language codes
  // const languageCodeMap = {
  //   ar: "ar",
  //   en: "en",
  //   tr: "tr",
  //   ch: "ch",
  //   chsi: "chsi",
  //   fr: "fr",
  // };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // const languageCode = languageCodeMap[selectedLanguage];
    const submitData = { ...form };

    // // إذا كانت عملية إنشاء جديدة، أرسل اللغة
    // if (!form || !form.id) {
    //   submitData.language = languageCode;
    // } else {
    //   // إذا كان تعديل:
    //   // إذا كان هناك key (ترجمة موجودة) ولم نعدل اللغة، أرسل الـ key
    //   // إذا أردنا تعديل الترجمات (اسم أو وصف)، لا نرسل الـ key
    //   // if (categoryKey) {
    //   //   submitData.key = categoryKey;
    //   // }
    //   // إضافة is_auto_translated إذا تم تعديل المحتوى
    //   if (isContentChanged) {
    //     submitData.is_auto_translated = isAutoTranslated;
    //   }
    // }
    // submitData.language = languageCode;
    setIsLoading(true);
    try {
      if (form.id) {
        await EditLearnCategoryById(form.id, submitData);
        toast.success(t("Category updated"));
      } else {
        await AddLearnCategory(submitData);
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
    {
      name: "learn_type",
      label: t("Type"),
      type: "select",
      options: [
        { value: "cards", label: t("Card") },
        { value: "posters", label: t("Poster") },
      ],
      required: true,
    },
    // if form.type === "cards" show direction field, else hide it
    {
      ...(form.learn_type === "cards" && {
        name: "direction",
        label: t("Direction"),
        type: "select",
        options: [
          { value: "vertical", label: t("Vertical") },
          { value: "horizontal", label: t("Horizontal") },
        ],
        required: form.learn_type === "cards",
      }),
    },
  ];
  const toggleFields = [
    {
      name: "is_active",
      label: t("Status"),
      color: "green",
      activeLabel: "Active",
      inactiveLabel: "Inactive",
      validation: (form) => ({
        isValid: form.is_active || form.content_count > 0,
        message: t("Cannot activate category with no Items."),
      }),
    },
  ];
  return (
    <CreateorEditCategoryModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      title={form.id ? t("Edit Category") : t("Add Category")}
      width="600px"
      // Form Data
      form={form}
      toggleFields={form?.id ? toggleFields : []}
      fields={fields}
      setForm={setForm}
      originalForm={originalForm}
      // Language & Translation
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
      // originalLanguage={originalLanguage}
      isAutoTranslated={isAutoTranslated}
      setIsAutoTranslated={setIsAutoTranslated}
      // Loading States
      isLoading={false}
      // isLoadingTranslation={isLoadingTranslation}
      // onFetchTranslation={handleLanguageChange}
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
      // Options
      showLanguageSelector={true}
      showAutoTranslate={true}
      showStatusToggle={true}
    />
  );
}

export default CreateorEditLearnCategory;
