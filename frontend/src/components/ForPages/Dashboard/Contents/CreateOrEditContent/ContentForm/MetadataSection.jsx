export const MetadataSection = ({
  t,
  formData,
  handleInputChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("Metadata")}
      </label>
      <textarea
        name="metadata"
        value={formData.metadata}
        onChange={handleInputChange}
        rows={3}
        placeholder={t("Enter metadata (JSON format)")}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-xs text-gray-500 mt-1">
        {t("Optional metadata in JSON format")}
      </p>
    </div>
  );
};
