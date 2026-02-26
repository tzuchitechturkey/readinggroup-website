import { X } from "lucide-react";

export const FilePreviewModal = ({
  isOpen,
  previewFile,
  previewUrl,
  t,
  handleClosePreview,
}) => {
  if (!isOpen || !previewFile || !previewUrl) return null;

  // Helper function to get file type from file name
  const getFileType = (file) => {
    const fileName = file?.name || file?.file_name || "";
    const extension = fileName.toLowerCase().split(".").pop();

    if (extension === "pdf") return "pdf";
    if (["doc", "docx"].includes(extension)) return "word";
    if (["ppt", "pptx"].includes(extension)) return "powerpoint";
    return "other";
  };

  const fileType = getFileType(previewFile);
  const fileName = previewFile?.name || previewFile?.file_name || "File";

  console.log("FilePreviewModal render", { previewFile, previewUrl, fileType });

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            {t("Preview")}: {fileName}
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
          {fileType === "pdf" ? (
            <iframe
              src={previewUrl}
              className="w-full h-full border-none"
              title="PDF Preview"
            />
          ) : fileType === "word" ? (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📄</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t("Word Document")}
                </h3>
                <p className="text-gray-600 mb-4">{fileName}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {t("Preview not available for Word documents in browser")}
                </p>
                <a
                  href={previewUrl}
                  download={fileName}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t("Open")}
                </a>
              </div>
            </div>
          ) : fileType === "powerpoint" ? (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t("PowerPoint Presentation")}
                </h3>
                <p className="text-gray-600 mb-4">{fileName}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {t("Preview not available for PowerPoint files in browser")}
                </p>
                <a
                  href={previewUrl}
                  download={fileName}
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
                <p className="text-gray-600 mb-4">{fileName}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {t("Preview not available for this file type")}
                </p>
                <a
                  href={previewUrl}
                  download={fileName}
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
