import React from "react";

import { X } from "lucide-react";

import Loader from "@/components/Global/Loader/Loader";
import { useCreateOrEditLearn } from "@/hooks/learn/useLearnForm";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";

import ImageUploadSection from "./ImageUploadSection";
import BasicDetailsSection from "./BasicDetailsSection";
import FormActionsSection from "./FormActionsSection";

function CreateOrEditLearn({ onSectionChange, learn = null }) {
  const {
    // Form state
    formData,
    hasChanges,
    errors,
    // Dropdown state
    showCategoryDropdown,
    setShowCategoryDropdown,
    categoriesList,
    categorySearchValue,
    setCategorySearchValue,
    // Guest speakers state
    guestSpeakerInput,
    setGuestSpeakerInput,
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
    // API Functions
    getCategories,
    i18n,
    t,
  } = useCreateOrEditLearn(learn, onSectionChange);
  // Handler for learn type change (resets writer selection)
  const handleLearnTypeChange = (e) => {
    handleInputChange(e);
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
        backTitle="Back to Learn List"
        onBack={() => {
          onSectionChange("learn");
        }}
        page={learn ? "Edit Learn" : "Create New Learn"}
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
          onLearnTypeChange={handleLearnTypeChange}
          showCategoryDropdown={showCategoryDropdown}
          setShowCategoryDropdown={setShowCategoryDropdown}
          categoriesList={categoriesList}
          categorySearchValue={categorySearchValue}
          setCategorySearchValue={setCategorySearchValue}
          getCategories={getCategories}
          handleCategoryClearSearch={handleCategoryClearSearch}
          handleCategorySelect={handleCategorySelect}
          categoryDropdownRef={categoryDropdownRef}
        />

        {/* Event Section - For Posters */}
        {formData.learn_type === "posters" && (
          <div className="space-y-4 border border-gray-200 rounded-lg p-4 ">
            {/* Is Event Switch */}
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                {t("Is Event")}
              </label>
              <button
                type="button"
                onClick={() =>
                  handleInputChange({
                    target: {
                      name: "is_event",
                      type: "checkbox",
                      checked: !formData.is_event,
                    },
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.is_event ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.is_event ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Event Fields - Only show if is_event is true */}
            {formData.is_event && (
              <div className=" mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Event Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("Event Date & Time")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.date ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.date && (
                    <p className="text-red-600 text-sm">{errors.date}</p>
                  )}
                </div>
                {/* End Event Title */}

                {/* Start Event Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("Event Title")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="event_title"
                    value={formData.event_title || ""}
                    onChange={handleInputChange}
                    placeholder="Enter event title"
                    className={`w-full px-3 py-2 border ${errors.event_title ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.event_title && (
                    <p className="text-red-600 text-sm">{errors.event_title}</p>
                  )}
                </div>
                {/* End Event Title */}

                {/* Start Guest Speakers */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("Guest Speakers")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={guestSpeakerInput}
                    onChange={(e) => setGuestSpeakerInput(e.target.value)}
                    onKeyDown={handleGuestSpeakersInput}
                    placeholder="Enter guest speaker name and press Enter"
                    className={`w-full px-3 py-2 border ${errors.guest_speakers ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formData.guest_speakers &&
                    formData.guest_speakers.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.guest_speakers.map((speaker, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            <span>{speaker}</span>
                            <button
                              type="button"
                              onClick={() => removeGuestSpeaker(speaker)}
                              className="hover:text-blue-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  {errors.guest_speakers && (
                    <p className="text-red-600 text-sm">
                      {errors.guest_speakers}
                    </p>
                  )}
                </div>
                {/* End Guest Speakers */}

                {/* Start Live Stream Link */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("Live Stream Link")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="live_stream_link"
                    value={formData.live_stream_link}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className={`border ${errors.live_stream_link ? "border-red-500" : " border-gray-300"} w-full px-3 py-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.live_stream_link && (
                    <p className="text-red-600 text-sm">
                      {errors.live_stream_link}
                    </p>
                  )}
                </div>
                {/* End Live Stream Link */}
              </div>
            )}
          </div>
        )}

        {/* Form Actions */}
        <FormActionsSection
          isLoading={isLoading}
          hasChanges={hasChanges}
          learn={learn}
          onCancel={() => onSectionChange("learn")}
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  );
}

export default CreateOrEditLearn;
