import React, { useState } from "react";

import { X, Calendar, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";
import "react-day-picker/dist/style.css";
import "@/components/ForPages/Dashboard/CreateorEditCategoryModal/DatePickerStyles.css";

import Loader from "@/components/Global/Loader/Loader";
import { useEventForm } from "@/components/ForPages/Dashboard/_common/hooks/useEventForm";

import { FormActionsSection } from "./LiveStreamForm";

// مكون Date Picker محسّن مع قوائم الشهر والسنة
function DatePickerWithMonthYear({
  value,
  onChange,
  error,
  t,
  isOpen,
  onOpenChange,
}) {
  const [currentDate, setCurrentDate] = useState(
    value ? new Date(value) : new Date(),
  );

  const months = [
    { value: 0, label: t("January") },
    { value: 1, label: t("February") },
    { value: 2, label: t("March") },
    { value: 3, label: t("April") },
    { value: 4, label: t("May") },
    { value: 5, label: t("June") },
    { value: 6, label: t("July") },
    { value: 7, label: t("August") },
    { value: 8, label: t("September") },
    { value: 9, label: t("October") },
    { value: 10, label: t("November") },
    { value: 11, label: t("December") },
  ];

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - 50 + i,
  );

  const handleMonthChange = (e) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(e.target.value));
    setCurrentDate(newDate);
  };

  const handleYearChange = (e) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(e.target.value));
    setCurrentDate(newDate);
  };

  const handleDateSelect = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    onChange(formattedDate);
    onOpenChange(false);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={`w-full px-3 py-2 border rounded-lg flex items-center justify-between bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value
              ? format(new Date(value), "MMMM d, yyyy")
              : t("Select a date")}
          </span>
          <Calendar className="h-5 w-5 text-gray-400" />
        </button>
      </Popover.Trigger>
      <Popover.Content className="w-auto p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t("Month")}
              </label>
              <select
                value={currentDate.getMonth()}
                onChange={handleMonthChange}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t("Year")}
              </label>
              <select
                value={currentDate.getFullYear()}
                onChange={handleYearChange}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DayPicker
            mode="single"
            month={currentDate}
            onMonthChange={setCurrentDate}
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => {
              if (date) {
                handleDateSelect(date);
              }
            }}
          />
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}

// مكون Time Picker محسّن مع Dropdowns للساعات والدقائق
function TimePickerWithDropdowns({ value, onChange, error, t }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(value ? parseInt(value.split(":")[0]) : 0);
  const [minutes, setMinutes] = useState(
    value ? parseInt(value.split(":")[1]) : 0,
  );

  React.useEffect(() => {
    if (value) {
      const parts = value.split(":");
      setHours(parseInt(parts[0]));
      setMinutes(parseInt(parts[1]));
    }
  }, [value, isOpen]);

  const hoursList = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0"),
  );
  const minutesList = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0"),
  );

  const handleHourChange = (e) => {
    setHours(parseInt(e.target.value));
  };

  const handleMinuteChange = (e) => {
    setMinutes(parseInt(e.target.value));
  };

  const handleConfirm = () => {
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    onChange(formattedTime);
    setIsOpen(false);
  };

  const handleSetNow = () => {
    const now = new Date();
    setHours(now.getHours());
    setMinutes(now.getMinutes());
  };

  const displayTime = value || "00:00";

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={`w-full px-3 py-2 border rounded-lg flex items-center justify-between bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <span
            className={value ? "text-gray-900 font-medium" : "text-gray-500"}
          >
            {displayTime}
          </span>
          <Clock className="h-5 w-5 text-gray-400" />
        </button>
      </Popover.Trigger>
      <Popover.Content className="w-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="space-y-4 w-64">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 mb-2 block">
                {t("Hours")}
              </label>
              <select
                value={hours}
                onChange={handleHourChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {hoursList.map((hour) => (
                  <option key={hour} value={parseInt(hour)}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <span className="text-2xl font-bold text-gray-400">:</span>
            </div>

            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 mb-2 block">
                {t("Minutes")}
              </label>
              <select
                value={minutes}
                onChange={handleMinuteChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {minutesList.map((minute) => (
                  <option key={minute} value={parseInt(minute)}>
                    {minute}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">{t("Selected Time")}</p>
            <p className="text-3xl font-bold text-blue-600">
              {String(hours).padStart(2, "0")}:
              {String(minutes).padStart(2, "0")}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSetNow}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t("Now")}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t("Confirm")}
            </button>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}

const CreateOrEditLiveStreamSchedule = ({
  liveStream = null,
  onClose,
  setUpdate,
}) => {
  const { t } = useTranslation();
  const [openDatePopover, setOpenDatePopover] = useState(false);

  const handleSuccess = () => {
    if (setUpdate) setUpdate((prev) => !prev);
    if (onClose) onClose();
  };

  const {
    formData,
    errors,
    isLoading,
    guestSpeakerInput,
    setGuestSpeakerInput,
    handleInputChange,
    handleSubmit,
    handleGuestSpeakersInput,
    removeGuestSpeaker,
    resetForm,
  } = useEventForm(liveStream, handleSuccess);

  const handleCancel = () => {
    resetForm();
    if (onClose) onClose();
  };

  return (
    <div className="bg-white rounded-lg p-3">
      {isLoading && <Loader />}

      <form
        onSubmit={handleSubmit}
        className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Live Stream Title */}
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

        {/* Live Stream Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t("Live Stream Date")} <span className="text-red-500">*</span>
          </label>
          <DatePickerWithMonthYear
            value={formData.start_event_date}
            onChange={(formattedDate) => {
              handleInputChange({
                target: {
                  name: "start_event_date",
                  value: formattedDate,
                },
              });
            }}
            error={errors.start_event_date}
            t={t}
            isOpen={openDatePopover}
            onOpenChange={setOpenDatePopover}
          />
          {errors.start_event_date && (
            <p className="text-red-600 text-sm">{errors.start_event_date}</p>
          )}
        </div>

        {/* Live Stream Start Time */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t("Live Stream Start Time")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <TimePickerWithDropdowns
            value={formData.start_event_time}
            onChange={(time) => {
              handleInputChange({
                target: {
                  name: "start_event_time",
                  value: time,
                },
              });
            }}
            error={errors.start_event_time}
            t={t}
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

        {/* Guest Speakers */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t("Guest Speakers")}
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

        {/* Live Stream Link */}
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
            className={`border ${errors.live_stream_link ? "border-red-500" : "border-gray-300"} w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.live_stream_link && (
            <p className="text-red-600 text-sm">{errors.live_stream_link}</p>
          )}
        </div>
      </form>

      {/* Form Actions */}
      <FormActionsSection
        isLoading={isLoading}
        isEditing={Boolean(liveStream?.id)}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateOrEditLiveStreamSchedule;
