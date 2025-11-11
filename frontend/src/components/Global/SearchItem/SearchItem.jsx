import React, { useState, useRef, useEffect } from "react";

import { CiSearch } from "react-icons/ci";
import { X } from "lucide-react";

import { GlobalSearch } from "@/api/info";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";

export default function SearchItem({ t, isSearchOpen, setIsSearchOpen }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const dropdownRef = useRef(null);
  const limit = 10;

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (
          searchInputRef.current &&
          !searchInputRef.current.contains(event.target)
        ) {
          setIsSearchOpen(false);
        }
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
    return () => {};
  }, [isSearchOpen, setIsSearchOpen]);

  // Handle search submission
  const handleSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!searchQuery || searchQuery.trim().length === 0) return;
    setIsLoading(true);
    setCurrentOffset(0);
    try {
      const response = await GlobalSearch(limit, 0, searchQuery);
      setData(response.data?.results || []);
      setTotalRecords(response.data?.count || 0);
      // results stored in state
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle load more
  const handleLoadMore = async () => {
    if (isLoadingMore || !searchQuery) return;
    const newOffset = currentOffset + limit;
    // Check if we've reached the end
    if (newOffset >= totalRecords) return;

    setIsLoadingMore(true);
    try {
      const response = await GlobalSearch(limit, newOffset, searchQuery);
      const newResults = response.data?.results || [];
      setData((prevData) => [...prevData, ...newResults]);
      setCurrentOffset(newOffset);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Handle close search
  const handleCloseSearch = () => {
    if (isSearchOpen || searchQuery) {
      setIsSearchOpen(false);
    } else if (!isSearchOpen) {
      setIsSearchOpen(true);
    }
    setSearchQuery("");
    setData([]);
    setCurrentOffset(0);
  };

  const getItemImage = (item) => {
    return (
      item?.image ||
      item?.image_url ||
      item?.thumbnail ||
      item?.thumbnail_url ||
      null
    );
  };

  return (
    <div className="flex items-center">
      <div
        className={`flex items-center transition-all duration-300 ease-in-out ${
          isSearchOpen ? "w-44 md:w-52" : "w-0 overflow-hidden"
        }`}
      >
        <form onSubmit={handleSearch} className="relative w-full">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("Search...")}
            className="w-full px-3 py-1.5 pr-8 border text-black/60 border-gray-300 rounded-full text-sm outline-none  "
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleCloseSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Results dropdown */}
          {isSearchOpen && data?.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-50 -left-10 mt-2 w-[20rem] max-h-96 max-w-[90vw] bg-white shadow-lg rounded-md overflow-hidden flex flex-col"
            >
              {isLoading ? (
                <div className="p-4">
                  <Loader />
                </div>
              ) : (
                <div className="flex flex-col h-">
                  <ul className="overflow-y-auto custom-scroll max-h-96 ">
                    {data.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          item?.post_type
                            ? `/cards-photos/card/${item?.id}`
                            : item?.video_type
                            ? `/videos/${item?.id}`
                            : item?.report_type
                            ? item?.report_type === "videos"
                              ? `/events/video/${item?.id}`
                              : `/events/report/${item?.id}`
                            : `/contents/content/${item?.id}`;
                        }}
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          {getItemImage(item) ? (
                            <img
                              src={getItemImage(item)}
                              alt={item?.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              —
                            </div>
                          )}
                        </div>
                        <div className="">
                          <p className="flex-1 text-sm text-gray-800">
                            {item?.title}
                          </p>
                          <p className="flex-1 text-sm text-gray-800">
                            {item?.post_type
                              ? item.post_type === "card"
                                ? t("Card")
                                : t("Photo")
                              : item?.video_type
                              ? t("Video")
                              : item?.report_type
                              ? item?.report_type === "videos"
                                ? t("Event Video")
                                : t("Report")
                              : t("Content")}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {totalRecords > data?.length && (
                    <div className="px-3 py-2 border-t text-center">
                      {isLoadingMore ? (
                        <Loader />
                      ) : (
                        <button
                          onClick={handleLoadMore}
                          className="text-sm text-primary hover:underline"
                          type="button"
                        >
                          {t("Show more")}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      <CiSearch
        onClick={() => handleCloseSearch()}
        className="cursor-pointer text-4xl sm:text-xl hover:text-primary transition-all duration-200 p-1 mx-2 sm:p-0 rounded-full hover:bg-gray-100"
      />
    </div>
  );
}
