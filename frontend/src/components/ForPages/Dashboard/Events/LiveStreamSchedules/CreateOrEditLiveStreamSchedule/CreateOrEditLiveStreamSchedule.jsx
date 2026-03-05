import React from "react";

import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

import Loader from "@/components/Global/Loader/Loader";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";
import AutoComplete from "@/components/Global/AutoComplete/AutoComplete";
import { useEventForm } from "@/components/ForPages/Dashboard/_common/hooks/useEventForm";

import { FormActionsSection } from "./LiveStreamForm";

const CreateOrEditLiveStreamSchedule = ({ onSectionChange, event = null }) => {
  const { t } = useTranslation();
  const {
    formData,
    errors,
    isLoading,
    guestSpeakerInput,
    setGuestSpeakerInput,
    selectedLearn,
    learnsList,
    handleInputChange,
    handleSubmit,
    handleGuestSpeakersInput,
    removeGuestSpeaker,
    handleLearnSelect,
    handleLearnClear,
    getLearnsList,
    resetForm,
  } = useEventForm(event, onSectionChange);

  const handleCancel = () => {
    resetForm();
    onSectionChange("liveStreamSchedules");
  };

  return (
    <div className="bg-white rounded-lg p-3">
      {isLoading && <Loader />}

      {/* Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Live Stream Schedules List")}
        onBack={() => onSectionChange("liveStreamSchedules")}
        page={
          event?.id
            ? t("Edit Live Stream Schedule")
            : t("Create New Live Stream Schedule")
        }
      />

      <form
        onSubmit={handleSubmit}
        className=" mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Start Event Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t("Live Stream Title")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
            placeholder="Enter Live Stream title"
            className={`w-full px-3 py-2 border ${errors.title ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.title && (
            <p className="text-red-600 text-sm">{errors.title}</p>
          )}
        </div>
        {/* End Event Title */}

        {/* Date & Link & Guest Speakers Section */}
        {/* Start Event Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t("Live Stream Date")} <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="start_event_date"
            value={formData.start_event_date}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${errors.start_event_date ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.start_event_date && (
            <p className="text-red-600 text-sm">{errors.start_event_date}</p>
          )}
        </div>

        {/* Start Live Stream Time */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t("Live Stream Start Time")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="start_event_time"
            value={formData.start_event_time}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${errors.start_event_time ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.start_event_time && (
            <p className="text-red-600 text-sm">{errors.start_event_time}</p>
          )}
        </div>

        {/* Event Duration */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t("Event Duration (HOUR)")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            inputMode="numeric"
            pattern="[0-9]*"
            className={`w-full px-3 py-2 border ${
              errors.duration ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.duration && (
            <p className="text-red-600 text-sm">{errors.duration}</p>
          )}
        </div>

        {/* Start Guest Speakers */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t("Guest Speakers")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={guestSpeakerInput}
            onChange={(e) => setGuestSpeakerInput(e.target.value)}
            onKeyDown={handleGuestSpeakersInput}
            placeholder="Enter guest speaker name and press Enter"
            className={`w-full px-3 py-2 border ${errors.guest_speakers ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {formData.guest_speakers && formData.guest_speakers.length > 0 && (
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
            <p className="text-red-600 text-sm">{errors.guest_speakers}</p>
          )}
        </div>
        {/* End Guest Speakers */}

        {/* Start Live Stream Link */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t("Live Stream Link")} <span className="text-red-500">*</span>
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
            <p className="text-red-600 text-sm">{errors.live_stream_link}</p>
          )}
        </div>
        {/* End Live Stream Link */}

        {/* Start Learn Selection */}
        <div className="space-y-2 md:col-span-2">
          <AutoComplete
            label={t("Posters Resource")}
            placeholder={t("Posters Resource")}
            selectedItem={selectedLearn}
            onSelect={handleLearnSelect}
            onClear={handleLearnClear}
            list={learnsList}
            searchMethod={getLearnsList}
            searchApi={true}
            searchPlaceholder={t("Search posters resource...")}
            renderItemLabel={(item) => item.title || item.name}
            showWriterAvatar={false}
            error={errors.learn}
            multiple={false}
          />
        </div>
        {/* End Learn Selection */}
      </form>

      {/* Form Actions Section */}
      <FormActionsSection
        isLoading={isLoading}
        isEditing={Boolean(event?.id)}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateOrEditLiveStreamSchedule;
