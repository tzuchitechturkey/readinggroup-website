import { X } from "lucide-react";

export const FilePreviewModal = ({
  isOpen,
  previewFile,
  previewUrl,
  t,
  handleClosePreview,
}) => {
  if (!isOpen || !previewFile || !previewUrl) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            {t("Preview")}: {previewFile?.name}
          </h2>
          <button
            onClick={handleClosePreview}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          {previewFile?.type === "application/pdf" ? (
            <iframe
              src={previewUrl}
              className="w-full h-full border-none"
              title="PDF Preview"
            />
          ) : previewFile?.type.includes("word") ||
            previewFile?.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📄</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t("Word Document")}
                </h3>
                <p className="text-gray-600 mb-4">{previewFile?.name}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {t("Preview not available for Word documents in browser")}
                </p>
                <a
                  href={previewUrl}
                  download={previewFile?.name}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t("Download")}
                </a>
              </div>
            </div>
          ) : previewFile?.type.includes("powerpoint") ||
            previewFile?.type ===
              "application/vnd.openxmlformats-officedocument.presentationml.presentation" ? (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t("PowerPoint Presentation")}
                </h3>
                <p className="text-gray-600 mb-4">{previewFile?.name}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {t("Preview not available for PowerPoint files in browser")}
                </p>
                <a
                  href={previewUrl}
                  download={previewFile?.name}
                  className="inline-block px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  {t("Download")}
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📎</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t("File")}
                </h3>
                <p className="text-gray-600 mb-4">{previewFile?.name}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {t("Preview not available for this file type")}
                </p>
                <a
                  href={previewUrl}
                  download={previewFile?.name}
                  className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {t("Download")}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
