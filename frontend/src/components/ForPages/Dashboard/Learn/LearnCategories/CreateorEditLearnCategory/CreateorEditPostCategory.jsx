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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const submitData = { ...form };
    if (form.learn_type === "posters") {
      submitData.direction = "vertical";
    }

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
