import React from "react";

import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { postStatusOptions } from "@/constants/constants";

/**
 * BasicDetailsSection Component
 * Handles title, subtitle, and status fields
 */
function BasicDetailsSection({ formData, errors, onInputChange, onPostTypeChange }) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Title")} *
        </label>
        <Input
          name="title"
          value={formData.title}
          onChange={onInputChange}
          placeholder={t("Enter post title")}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Subtitle")} *
        </label>
        <Input
          name="subtitle"
          value={formData.subtitle}
          onChange={onInputChange}
          placeholder={t("Enter post subtitle")}
          className={errors.subtitle ? "border-red-500" : ""}
        />
        {errors.subtitle && (
          <p className="text-red-500 text-xs mt-1">{errors.subtitle}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Status")} *
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={onInputChange}
          className={`w-full px-3 py-2 border rounded-md outline-0 ${
            errors.status ? "border-red-500" : "border-gray-300"
          } ${!formData.status ? "text-gray-400" : "text-black"}`}
        >
          <option value="" hidden disabled>
            {t("Select Status")}
          </option>
          {postStatusOptions.map((option) => (
            <option
              className="text-black"
              key={option.value}
              value={option.value}
            >
              {t(option.label)}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="text-red-500 text-xs mt-1">{errors.status}</p>
        )}
      </div>

      {/* Read Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Read Time")} *
        </label>
        <Input
          name="read_time"
          type="number"
          value={formData.read_time}
          onChange={onInputChange}
          placeholder={t("Enter Read Time in minutes")}
          className={errors.read_time ? "border-red-500" : ""}
        />
        {errors.read_time && (
          <p className="text-red-500 text-xs mt-1">{errors.read_time}</p>
        )}
      </div>

      {/* Post Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Type")} *
        </label>
        <select
          name="post_type"
          value={formData.post_type}
          onChange={onPostTypeChange}
          className={`w-full px-3 py-2 border rounded-md outline-none ${
            errors.post_type ? "border-red-500" : "border-gray-300"
          } ${!formData.post_type ? "text-gray-400" : "text-black"}`}
        >
          <option value="" hidden disabled>
            {t("Select Type")}
          </option>
          <option className="text-black" value="card">
            {t("Card")}
          </option>
          <option className="text-black" value="photo">
            {t("Photo")}
          </option>
        </select>
        {errors.post_type && (
          <p className="text-red-500 text-xs mt-1">{errors.post_type}</p>
        )}
      </div>

      {/* Camera (conditional) */}
      {formData.post_type === "photo" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Camera Model")}
          </label>
          <Input
            name="camera_name"
            value={formData.camera_name}
            onChange={onInputChange}
            placeholder={t("Enter camera model")}
            className={errors.camera_name ? "border-red-500" : ""}
          />
        </div>
      )}
    </div>
  );
}

export default BasicDetailsSection;
