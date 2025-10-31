import { useState, useRef, useEffect } from "react";

import { Search, X, User } from "lucide-react";

export default function AutoComplete({
  label,
  placeholder,
  selectedItem,
  onSelect,
  list = [],
  searchMethod = () => {},
  searchApi = true,
  searchPlaceholder,
  error,
  required = false,
  renderItemLabel,
  renderItemSubLabel,
  customStyle = "",
  showWriterAvatar = true,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const [searchList, setSearchList] = useState(list);

  const handleSearch = async () => {
    if (searchApi) {
      searchMethod(tempSearchInput);
    } else {
      const filteredList = list.filter((item) =>
        item[searchParam].toLowerCase().includes(tempSearchInput.toLowerCase())
      );
      setSearchList(filteredList);
    }
  };
  const clearSearch = () => {
    setSearch("");
    handleSearch();
  };

  useEffect(() => {
    setSearchList(list); // Reset the list whenever the main list changes
  }, [list]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close writer dropdown if clicked outside

      // Close category dropdown if clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div>
      {label ? (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && "*"}
        </label>
      ) : (
        ""
      )}

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full px-3 py-[6px] border  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center gap-3 ${
            error ? "border-red-500" : "border-gray-300"
          } ${customStyle}`}
        >
          {selectedItem?.username ? (
            <>
              <img
                src={selectedItem.profile_image || "/fake-user.png"}
                alt={selectedItem.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="font-medium text-black/60 text-sm">
                  {renderItemLabel(selectedItem)}
                </div>
              </div>
            </>
          ) : (
            <>
              {showWriterAvatar && <User className="w-8 h-8 text-gray-400" />}
              <span className="text-gray-500">{placeholder}</span>
            </>
          )}
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                    placeholder={searchPlaceholder}
                    className="w-full px-3 py-1.5 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSearch}
                  className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto">
              {searchList?.length > 0 ? (
                searchList.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect(item);
                      setOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <img
                      src={item.profile_image ? item.profile_image : "/fake-user.png"}
                      alt={item.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {renderItemLabel(item)}
                      </div>
                      {renderItemSubLabel && (
                        <div className="text-xs text-gray-500">
                          {renderItemSubLabel(item)}
                        </div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-gray-500 text-sm">
                  لا توجد نتائج
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
