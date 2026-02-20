import { Tag, X, Search, User } from "lucide-react";

export const WriterSelectionDropdown = ({
  t,
  i18n,
  formData,
  showWriterDropdown,
  setShowWriterDropdown,
  writersList,
  writerSearchValue,
  setWriterSearchValue,
  handleWriterSelect,
  handleWriterSearch,
  handleClearWriterSearch,
  errors,
  writerDropdownRef,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("Writer")}
      </label>
      <div className="relative" ref={writerDropdownRef}>
        <button
          type="button"
          onClick={() => setShowWriterDropdown(!showWriterDropdown)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center gap-3 ${
            errors.writer ? "border-red-500" : "border-gray-300"
          }`}
        >
          {formData?.writer ? (
            <>
              <img
                src={formData?.writer_avatar || "/fake-user.png"}
                alt={formData?.writer}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <div
                  className={`font-medium ${
                    i18n?.language === "ar" ? "text-right" : "text-left"
                  } text-sm`}
                >
                  {formData?.writer}
                </div>
              </div>
            </>
          ) : (
            <>
              <User className="w-8 h-8 text-gray-400" />
              <span className="text-gray-500">{t("Select Writer")}</span>
            </>
          )}
        </button>

        {showWriterDropdown && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
            {/* Search Box */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={writerSearchValue}
                    onChange={(e) => setWriterSearchValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleWriterSearch();
                      }
                    }}
                    placeholder={t("Search writers...")}
                    className="w-full px-3 py-1.5 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  {writerSearchValue && (
                    <button
                      type="button"
                      onClick={handleClearWriterSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleWriterSearch}
                  className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  title={t("Search")}
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Writers List */}
            <div className="max-h-60 overflow-y-auto">
              {writersList.length > 0 ? (
                writersList.map((writer) => (
                  <button
                    key={writer.id}
                    type="button"
                    onClick={() => handleWriterSelect(writer)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <img
                      src={
                        writer.avatar || writer.avatar_url || "/fake-user.png"
                      }
                      alt={writer.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div
                      className={` ${
                        i18n?.language === "ar" ? "text-right" : "text-left"
                      }  flex-1`}
                    >
                      <div className="font-medium text-sm">{writer.name}</div>
                      <div className="text-xs text-gray-500">
                        {writer.position}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-gray-500 text-sm">
                  {t("No writers found")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {errors.writer && (
        <p className="text-red-500 text-xs mt-1">{errors.writer}</p>
      )}
    </div>
  );
};
