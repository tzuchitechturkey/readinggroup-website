import React from "react";

import { useTranslation } from "react-i18next";

import Loader from "@/components/Global/Loader/Loader";
import { useCreateOrEditPost } from "@/components/ForPages/Dashboard/_common/hooks/Content/usePostForm";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";

import ImageUploadSection from "./components/ImageUploadSection";
import BasicDetailsSection from "./components/BasicDetailsSection";
import SelectFieldsSection from "./components/SelectFieldsSection";
import WriterSelectionDropdown from "./components/WriterSelectionDropdown";
import CategorySelectionDropdown from "./components/CategorySelectionDropdown";
import TagsSection from "./components/TagsSection";
import ExcerptSection from "./components/ExcerptSection";
import BodyContentSection from "./components/BodyContentSection";
import MetadataSection from "./components/MetadataSection";
import FormActionsSection from "./components/FormActionsSection";

function CreateOrEditPost({ onSectionChange, post = null }) {
  const { i18n } = useTranslation();

  // Use the custom hook for all state management and logic
  const {
    // Form state
    formData,
    setFormData,
    hasChanges,
    errors,
    setErrors,
    tagInput,
    setTagInput,

    // Dropdown state
    showWriterDropdown,
    setShowWriterDropdown,
    showCategoryDropdown,
    setShowCategoryDropdown,
    writersList,
    categoriesList,
    writerSearchValue,
    setWriterSearchValue,
    categorySearchValue,
    setCategorySearchValue,

    // Loading state
    isLoading,

    // Refs
    writerDropdownRef,
    categoryDropdownRef,

    // Handlers
    handleInputChange,
    handleImageUpload,
    handleWriterSelect,
    handleWriterSearch,
    handleClearWriterSearch,
    handleCategorySelect,
    handleTagInput,
    removeTag,
    handleSubmit,

    // API Functions
    getCategories,
  } = useCreateOrEditPost(post, onSectionChange);

  // Handler for post type change (resets writer selection)
  const handlePostTypeChange = (e) => {
    handleInputChange(e);
    setFormData((prev) => ({
      ...prev,
      writer: "",
    }));
  };

  // Handler for body content change
  const handleBodyChange = (data) => {
    setFormData((prev) => ({ ...prev, body: data }));
    if (errors.body) {
      setErrors((prev) => ({ ...prev, body: "" }));
    }
  };

  // Handler for body blur
  const handleBodyBlur = () => {
    if (!formData.body.trim()) {
      setErrors((prev) => ({
        ...prev,
        body: "Body content is required",
      }));
    }
  };

  // Handler for category search clear
  const handleCategoryClearSearch = () => {
    setCategorySearchValue("");
    getCategories("");
  };

  return (
    <div
      className="bg-white rounded-lg p-6 mx-4 overflow-y-auto"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}

      {/* Breadcrumb */}
      <CustomBreadcrumb
        backTitle="Back to Posts List"
        onBack={() => {
          onSectionChange("posts");
        }}
        page={post ? "Edit Post" : "Create New Post"}
      />

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <ImageUploadSection
          formData={formData}
          errors={errors}
          imageFile={null}
          onImageUpload={handleImageUpload}
          onImageUrlChange={handleInputChange}
        />

        {/* Basic Details Section */}
        <BasicDetailsSection
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
          onPostTypeChange={handlePostTypeChange}
        />

        {/* Select Fields Section (Language, Country) */}
        <SelectFieldsSection
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
        />

        {/* Category and Writer Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <CategorySelectionDropdown
              showDropdown={showCategoryDropdown}
              onToggleDropdown={setShowCategoryDropdown}
              selectedCategoryId={formData.category}
              categoriesList={categoriesList}
              categorySearchValue={categorySearchValue}
              onSearchChange={setCategorySearchValue}
              onSearch={() => getCategories(categorySearchValue)}
              onClearSearch={handleCategoryClearSearch}
              onSelect={handleCategorySelect}
              errors={errors}
              dropdownRef={categoryDropdownRef}
            />
          </div>

          {/* Writer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData?.post_type === "photo" ? "Camera Man" : "Writer"} *
            </label>
            <WriterSelectionDropdown
              showDropdown={showWriterDropdown}
              onToggleDropdown={setShowWriterDropdown}
              selectedWriter={formData.writer}
              selectedAvatar={formData.writer_avatar}
              writerSearchValue={writerSearchValue}
              onSearchChange={setWriterSearchValue}
              onSearch={handleWriterSearch}
              onClearSearch={handleClearWriterSearch}
              writersList={writersList}
              onSelect={handleWriterSelect}
              errors={errors}
              postType={formData.post_type}
              dropdownRef={writerDropdownRef}
            />
          </div>
        </div>

        {/* Tags Section */}
        <TagsSection
          formData={formData}
          errors={errors}
          tagInput={tagInput}
          onTagInputChange={setTagInput}
          onTagAdd={handleTagInput}
          onTagRemove={removeTag}
        />

        {/* Excerpt Section */}
        <ExcerptSection
          formData={formData}
          errors={errors}
          onExcerptChange={handleInputChange}
        />

        {/* Body Content Section (CKEditor) */}
        <BodyContentSection
          formData={formData}
          errors={errors}
          onBodyChange={handleBodyChange}
          onBodyBlur={handleBodyBlur}
        />

        {/* Metadata Section */}
        <MetadataSection
          formData={formData}
          onMetadataChange={handleInputChange}
        />

        {/* Form Actions */}
        <FormActionsSection
          isLoading={isLoading}
          hasChanges={hasChanges}
          post={post}
          onCancel={() => onSectionChange("posts")}
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  );
}

export default CreateOrEditPost;
