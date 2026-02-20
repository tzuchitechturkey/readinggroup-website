import { FileText, Trash2, Eye } from "lucide-react";

export const AttachmentsSection = ({
  t,
  formData,
  setShowAttachmentsModal,
  handleRemoveAttachment,
  handlePreviewFile,
}) => {
  const getFileIcon = (mimeType) => {
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("word")) return "📝";
    if (mimeType.includes("powerpoint")) return "🎯";
    return "📎";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t("Attachments")}
      </label>

      <button
        type="button"
        onClick={() => setShowAttachmentsModal(true)}
        className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
      >
        <FileText className="w-5 h-5" />
        {t("Click to select or manage attachments")}
      </button>

      {/* Selected Attachments */}
      {formData.attachments && formData.attachments.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-gray-500 font-medium">
            {t("Selected attachments")}:
          </p>
          {formData.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl flex-shrink-0">
                  {getFileIcon(attachment.file?.type || "")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {attachment.name || attachment.file?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {attachment.file?.size
                      ? `${(attachment.file.size / 1024 / 1024).toFixed(2)} MB`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handlePreviewFile(attachment.file)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title={t("Preview")}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(attachment.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title={t("Remove")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        {t("Click to select or manage attachments for this content")}
      </p>
    </div>
  );
};
