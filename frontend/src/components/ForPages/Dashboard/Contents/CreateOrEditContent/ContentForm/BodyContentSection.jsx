import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// import { Base64UploadAdapter } from "@/components/ForPages/Dashboard/_common/utils/shared/ckeditorAdapter";
import { Base64UploadAdapter } from "@/components/ForPages/Dashboard/_common/utils/shared/ckeditorAdapter";

export const BodyContentSection = ({
  t,
  i18n,
  formData,
  setFormData,
  errors,
  setErrors,
}) => {
  const MyCustomUploadAdapterPlugin = (editor) => {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new Base64UploadAdapter(loader);
    };
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("Body Content")} *
      </label>
      <CKEditor
        editor={ClassicEditor}
        data={formData.body}
        config={{
          placeholder: t("Enter the full content of the content"),
          language: i18n.language === "ar" ? "ar" : "en",
          extraPlugins: [MyCustomUploadAdapterPlugin],
          removePlugins: ["MediaEmbedToolbar"],
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          setFormData((prev) => ({ ...prev, body: data }));
          if (errors.body) {
            setErrors((prev) => ({ ...prev, body: "" }));
          }
        }}
      />
      {errors.body && (
        <p className="text-red-500 text-xs mt-1">{errors.body}</p>
      )}
      <p className="text-xs text-gray-500 mt-1">
        {t("This is the main content that will be displayed to readers")}
      </p>
    </div>
  );
};
