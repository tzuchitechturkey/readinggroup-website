import React from "react";

import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";

import { useCreateOrEditUser } from "@/hooks/user/useCreateOrEditUser";
import { Input } from "@/components/ui/input";

export default function CreateOrEditUsers({ user, onClose }) {
  const { t } = useTranslation();
  const {
    formData,
    errors,
    isLoading,
    hasChanges,
    groupsList,
    handleInputChange,
    handleSubmit,
  } = useCreateOrEditUser(user, onClose);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {isLoading && <Loader className="animate-spin h-5 w-5" />}

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Username")} *
        </label>
        <Input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder={t("Enter username")}
          disabled={isLoading}
          className={errors.username ? "border-red-500" : ""}
        />
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">{errors.username}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Email")} *
        </label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder={t("Enter email")}
          disabled={isLoading}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* Group Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Group")} *
        </label>
        <select
          name="group_id"
          value={formData.group_id}
          onChange={handleInputChange}
          disabled={isLoading}
          className={`w-full px-4 py-2.5 border rounded-lg outline-none ${
            errors.group_id ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-blue-500`}
        >
          <option value="" hidden>
            {t("Select Group")}
          </option>
          {groupsList.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        {errors.group_id && (
          <p className="text-red-500 text-xs mt-1">{errors.group_id}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={isLoading || (user?.id && !hasChanges)}
          className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? t("Saving...") : t("Save")}
        </button>
        <button
          type="button"
          onClick={() => onClose(false)}
          disabled={isLoading}
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
        >
          {t("Cancel")}
        </button>
      </div>
    </form>
  );
}
