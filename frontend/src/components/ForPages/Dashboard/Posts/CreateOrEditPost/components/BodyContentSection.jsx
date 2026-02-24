import React from "react";

import { useTranslation } from "react-i18next";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { Base64UploadAdapterPlugin } from "@/components/ForPages/Dashboard/_common/utils/shared/ckeditorAdapter";

/**
 * BodyContentSection Component
 * Handles body content editing with CKEditor
 */
function BodyContentSection({ formData, errors, onBodyChange, onBodyBlur }) {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("Body Content")} *
      </label>
      <div
        className={`border rounded-md ${
          errors.body ? "border-red-500" : "border-gray-300"
        } focus-within:ring-2 focus-within:ring-blue-500`}
      >
        <CKEditor
          editor={ClassicEditor}
          data={formData.body}
          config={{
            placeholder: t("Enter the full content of the post"),
            language: i18n.language === "ar" ? "ar" : "en",
            extraPlugins: [Base64UploadAdapterPlugin],
            removePlugins: ["MediaEmbedToolbar"],
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            onBodyChange(data);
          }}
          onBlur={onBodyBlur}
        />
      </div>
      {errors.body && (
        <p className="text-red-500 text-xs mt-1">{errors.body}</p>
      )}
      <p className="text-xs text-gray-500 mt-1">
        {t("This is the main content that will be displayed to readers")}
      </p>
    </div>
  );
}

export default BodyContentSection;
