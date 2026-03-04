import React, { useEffect, useState } from "react";

const ImageUploadSection = ({ formData, t }) => {
  const [imagePreview, setImagePreview] = useState(null);
  useEffect(() => {
    if (formData?.thumbnail_url) {
      const img = JSON.parse(formData?.thumbnail_url);
      setImagePreview(img);
    }
  }, [formData?.thumbnail_url]);
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {t("Report Thumbnail")}
      </h3>

      <div className="space-y-4">
        {/* Display Thumbnail URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Thumbnail URL")}
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
            {formData?.thumbnail_url ? (
              <div className="space-y-3">
                <p className="text-sm break-all">{formData.thumbnail_url}</p>
                {formData.thumbnail_url && (
                  <img
                    src={imagePreview?.high?.url || imagePreview?.medium?.url}
                    alt="Report Thumbnail"
                    className="w-full mx-auto max-w-xs h-auto rounded-lg border border-gray-200 object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                {t("Thumbnail will be filled automatically from YouTube")}
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {t(
              "The thumbnail image is automatically fetched from the YouTube video when you fetch YouTube information",
            )}
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadSection;
