import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageDropdown from "@/components/Global/LanguageDropdown/LanguageDropdown";
import UserProfileDropdown from "@/components/Global/UserProfileDropdown/UserProfileDropdown";

import SearchItem from "../SearchItem/SearchItem";

function UserIcons() {
  const { t } = useTranslation();
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      <div className="hidden sm:block border-l border-gray-300 h-6 w-[1px]" />

      {/* Start Search Section */}
      <SearchItem t={t} />
      {/* End Search Section */}

      <LanguageDropdown />

      {isLoggedIn ? (
        <UserProfileDropdown />
      ) : (
        <button
          onClick={() => {
            navigate("/auth/login");
          }}
          className="p-1 px-2 border-[1px] border-gray-300 rounded-xl hover:bg-primary hover:text-white transition-colors duration-200"
        >
          {t("Login")}
        </button>
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
            className="p-1 px-2 border-[1px] border-gray-300 rounded-xl hover:bg-primary hover:text-white transition-colors duration-200"
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
