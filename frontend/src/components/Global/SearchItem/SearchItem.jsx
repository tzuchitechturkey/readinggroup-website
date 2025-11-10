import React, { useState, useRef, useEffect } from "react";

import { CiSearch } from "react-icons/ci";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { GlobalSearch } from "@/api/info";

export default function SearchItem({ t, isSearchOpen, setIsSearchOpen }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Handle close search
  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

    const getData = async () => {
      setIsLoading(true);
      try {
        const response = await GlobalSearch(searchQuery);
        setDataResult(response.data?.results || []);
        setTotalRecords(response.data?.count || 0);
        console.log("Search results:", response.data?.results);
      } catch (error) {
        setErrorFn(error, t);
      } finally {
        setIsLoading(false);
      }
    };
  
  return (
    <div className="flex items-center">
      <div
        className={`flex items-center transition-all duration-300 ease-in-out overflow-hidden ${
          isSearchOpen ? "w-44 md:w-52" : "w-0"
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
        </form>
      </div>

      <CiSearch
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        className="cursor-pointer text-4xl sm:text-xl hover:text-primary transition-all duration-200 p-1 mx-2 sm:p-0 rounded-full hover:bg-gray-100"
      />
    </div>
  );
}
