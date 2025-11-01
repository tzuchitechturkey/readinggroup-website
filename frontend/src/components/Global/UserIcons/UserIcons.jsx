import React, { useState, useRef, useEffect } from "react";

import { CiSearch, CiLogin } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { X, LayoutDashboard } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { useTranslation } from "react-i18next";

import LanguageDropdown from "@/components/Global/LanguageDropdown/LanguageDropdown";
import UserProfileDropdown from "@/components/Global/UserProfileDropdown/UserProfileDropdown";

function UserIcons() {
  const { t } = useTranslation();
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);
  }, []);
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

  return (
    <div className="flex items-center gap-2 ">
      <div className="hidden sm:block border-l border-gray-300 h-6 w-[1px]" />

      {/* Start Search Section */}
      {/* <div className="flex items-center">
        <div
          className={`flex items-center transition-all duration-300 ease-in-out overflow-hidden ${
            isSearchOpen ? "w-48 sm:w-64" : "w-0"
          }`}
        >
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
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
      </div> */}

      <LanguageDropdown />

      {isLoggedIn ? (
        <UserProfileDropdown />
      ) : (
        <Link
          to="/auth/login"
          className="p-1 px-3 border-[1px] border-gray-300 rounded-xl hover:bg-primary hover:text-white transition-colors duration-200"
        >
          {t("Login")}
        </Link>
      )}
      {isLoggedIn && userType === "admin" && (
        <div
          onClick={() => {
            localStorage.removeItem("dashboardSelectedPost");
            localStorage.removeItem("dashboardSelectedVideo");
            localStorage.removeItem("dashboardSelectedNews");
            localStorage.removeItem("dashboardSelectedEvent");
            localStorage.removeItem("dashboardActiveParent");
            localStorage.removeItem("dashboardActiveSection");
          }}
        >
          <Link
            className="p-1 px-3 border-[1px] border-gray-300 rounded-xl hover:bg-primary hover:text-white transition-colors duration-200"
            to="/dashboard"
          >
            {t("Dashboard")}
          </Link>
        </div>
      )}
    </div>
  );
}

export default UserIcons;
