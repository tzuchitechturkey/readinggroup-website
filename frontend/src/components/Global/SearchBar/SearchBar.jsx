import React from "react";

function SearchBar({ searchTerm, setSearchTerm, onSearch, i18n, t }) {
  return (
    <div className="bg-white rounded-lg p-4  mb-3 md:mb-6 shadow-sm">
      <div className="relative max-w-md flex">
        <input
          type="text"
          placeholder={t("Search Categories")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`flex-1 px-4 py-2 border border-gray-300 ${
            i18n?.language === "ar" ? "rounded-r-lg" : "rounded-l-lg"
          } text-sm pr-8`}
        />

        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
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
  );
}

export default SearchBar;
