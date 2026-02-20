import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { Base64UploadAdapterPlugin } from "@/components/ForPages/Dashboard/_common/utils/shared/ckeditorAdapter";

export const DescriptionSection = ({
  formData,
  onBodyChange,
  onBodyBlur,
  error,
}) => {
  const { t, i18n } = useTranslation();

  const handleEditorBlur = () => {
    // CKEditor blur doesn't need to call onBodyBlur
    // as onChange already updates the data
    if (onBodyBlur && typeof onBodyBlur === "function") {
      onBodyBlur();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t("Description")} <span className="text-red-500">*</span>
      </label>

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
        onBlur={handleEditorBlur}
      />
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
