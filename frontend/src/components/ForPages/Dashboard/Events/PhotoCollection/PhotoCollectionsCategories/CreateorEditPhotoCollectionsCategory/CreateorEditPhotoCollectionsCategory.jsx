import React, { useMemo, useState } from "react";

import { toast } from "react-toastify";

import CreateorEditCategoryModal from "@/components/ForPages/Dashboard/CreateorEditCategoryModal/CreateorEditCategoryModal";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { CreateCollection, EditCollectionById } from "@/api/photoCollections";

function CreateorEditPhotoCollectionsCategory({
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
      form.title !== originalForm.title ||
      form.description !== originalForm.description,
    [form, originalForm],
  );

  const validateForm = () => {
    const newErrors = {};

    if (!form.title || !form.title.trim()) {
      newErrors.title = t("Title is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error(t("Please fix the errors in the form"));
      return;
    }

    // const languageCode = languageCodeMap[selectedLanguage];
    const submitData = { ...form };

    // submitData.language = languageCode;
    setIsLoading(true);
    try {
      if (form.id) {
        await EditCollectionById(form.id, submitData);
        toast.success(t("Category updated"));
      } else {
        await CreateCollection(submitData);
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
      name: "title",
      label: t("Title"),
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: t("Description"),
      type: "text",
      required: false,
    },
  ];
  const toggleFields = [
    {
      name: "is_active",
      label: t("Status"),
      color: "green",
      activeLabel: t("Active"),
      inactiveLabel: t("Inactive"),
      validation: (form) => ({
        isValid: form.is_active || form.photo_count > 0,
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
      toggleFields={toggleFields}
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

export default CreateorEditPhotoCollectionsCategory;
