import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { Base64UploadAdapter } from "@/components/ForPages/Dashboard/_common/utils/shared/ckeditorAdapter";

export const DescriptionSection = ({ formData, onInputChange, error }) => {
  const { t } = useTranslation();

  const editorConfig = {
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "|",
      "bulletedList",
      "numberedList",
      "|",
      "undo",
      "redo",
    ],
    plugins: [
      "heading",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "undo",
      "redo",
    ],
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t("Description")} <span className="text-red-500">*</span>
      </label>

      <CKEditor
        editor={ClassicEditor}
        data={formData?.description}
        config={editorConfig}
        onChange={(event, editor) => {
          const data = editor.getData();
          onInputChange({
            target: { name: "description", value: data },
          });
        }}
        onReady={(editor) => {
          editor.plugins.get("FileRepository").createUploadAdapter = (
            loader,
          ) => {
            return new Base64UploadAdapter(loader);
          };
        }}
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
