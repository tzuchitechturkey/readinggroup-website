import React, { useMemo, useState } from "react";

import { toast } from "react-toastify";

import CreateorEditCategoryModal from "@/components/ForPages/Dashboard/CreateorEditCategoryModal/CreateorEditCategoryModal";
import {
  CreateRelatedReportCategoryById,
  EditRelatedReportCategoryById,
} from "@/api/relatedReports";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

function CreateOrEditRelatedReportsCategory({
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
  selectedCategory,
}) {
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      is_active: false,
      report_count: 0,
    });
    setErrors({});
    setSelectedLanguage(null);
    setIsAutoTranslated(false);
  };

  const handleModalSubmit = async () => {
    setErrors({});
    setIsLoading(true);

    // Validation
    const newErrors = {};
    if (!form.title?.trim()) {
      newErrors.title = t("Category title is required");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      toast.error(t("Please fix the errors in the form"));
      return;
    }
    try {
      const categoryData = {
        title: form.title.trim(),
        description: form.description.trim(),
        is_active: form.is_active,
      };

      if (selectedCategory) {
        // Edit existing category
        await EditRelatedReportCategoryById(selectedCategory.id, categoryData);
        toast.success(t("Category updated successfully"));
      } else {
        // Create new category
        await CreateRelatedReportCategoryById(categoryData);
        toast.success(t("Category created successfully"));
      }

      setUpdate((prev) => prev + 1);
      setShowModal(false);
      resetForm();
    } catch (error) {
      setErrorFn(error, t);
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
      type: "textarea",
      rows: 4,
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
        isValid: form.is_active || form.report_count > 0,
        message: t("Cannot activate category with no reports."),
      }),
    },
  ];
  return (
    <CreateorEditCategoryModal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
        resetForm();
      }}
      title={
        selectedCategory
          ? t("Edit Related Reports Category")
          : t("Add New Related Reports Category")
      }
      form={form}
      setForm={setForm}
      originalForm={originalForm}
      errors={errors}
      setErrors={setErrors}
      fields={fields}
      toggleFields={form?.id ? toggleFields : []}
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
      originalLanguage={originalLanguage}
      isAutoTranslated={isAutoTranslated}
      setIsAutoTranslated={setIsAutoTranslated}
      onSubmit={handleModalSubmit}
      isLoading={false}
      t={t}
      width="600px"
      showLanguageSelector={false}
      showAutoTranslate={false}
    />
  );
}
export default CreateOrEditRelatedReportsCategory;
