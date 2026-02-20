import { Plus } from "lucide-react";

const EventCategoriesHeader = ({
  totalRecords,
  searchTerm,
  onAddClick,
  onSearchChange,
  onSearch,
  i18n,
  t,
}) => {
  return (
    <>
      {/* Header Section */}
      <div className="flex items-center justify-between lg:px-4 sm:px-6 py-4 border-b bg-white rounded-lg mb-6">
        <h2 className="text-lg font-medium text-[#1D2630]">
          {t("Events Categories")}
        </h2>

        <div className="flex justify-end items-center gap-1">
          <span className="text-sm text-gray-500">
            {t("Total")}: {totalRecords} {t("categories")}
          </span>
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 text-xs lg:text-sm bg-primary border border-primary hover:bg-white transition-all duration-200 text-white hover:text-primary px-3 py-1.5 rounded"
          >
            <Plus className="h-4 w-4" />
            {t("Add Category")}
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="relative max-w-md flex">
          <input
            type="text"
            placeholder={t("Search Categories")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`flex-1 px-4 py-2 border border-gray-300 ${
              i18n?.language === "ar" ? "rounded-r-lg" : "rounded-l-lg"
            } text-sm pr-8`}
          />

          {searchTerm && (
            <button
              onClick={() => {
                onSearchChange("");
                onSearch("");
              }}
              className={` absolute ${
                i18n?.language === "ar" ? " left-20" : " right-20"
              } top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700`}
            >
              ✕
            </button>
          )}

          <button
            onClick={() => {
              if (searchTerm.trim()) {
                onSearch(searchTerm);
              }
            }}
            className={`px-4 py-2 bg-[#4680ff] text-white ${
              i18n?.language === "ar" ? "rounded-l-lg" : "rounded-r-lg"
            }  text-sm font-semibold hover:bg-blue-600`}
          >
            {t("Search")}
          </button>
        </div>
      </div>
    </>
  );
};

export default EventCategoriesHeader;
