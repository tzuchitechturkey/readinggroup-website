import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useIsMobile } from "@/hooks/global/use-mobile";
import LanguageDropdown from "@/components/Global/LanguageDropdown/LanguageDropdown";
import UserProfileDropdown from "@/components/Global/UserProfileDropdown/UserProfileDropdown";

import SearchItem from "../SearchItem/SearchItem";

function UserIcons() {
  const { t, i18n } = useTranslation();
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const isMobile = useIsMobile();
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);
  }, []);
  return (
    <div className="flex items-center ">
      <div
        className={`hidden sm:block border-gray-300 h-6 ${
          i18n?.language === "ar" ? "ml-1" : "mr-1"
        } w-[1px] `}
      />

      {/* Start Search Section */}
      {/* <SearchItem
        t={t}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      /> */}
      {/* End Search Section */}
      {!isSearchOpen && (
        <>
          <LanguageDropdown />

          {isLoggedIn ? (
            <UserProfileDropdown />
          ) : (
            <button
              onClick={() => {
                navigate("/auth/login");
              }}
              className="rounded-[38px] px-[16px] py-[8px]  border-[1px] border-gray-300  bg-white  hover:text-primary transition-colors duration-200 text-[#285688] text-lg font-medium leading-[1.5] font-['Noto_Sans']"
            >
              {t("Login")}
            </button>
          )}
          {isLoggedIn &&
            (userType === "admin" ||
              userType === "team_leader" ||
              userType === "editor") && (
              <div
                onClick={() => {
                  localStorage.removeItem("dashboardSelectedLearn");
                  localStorage.removeItem("dashboardSelectedVideo");
                  localStorage.removeItem("dashboardSelectedNews");
                  localStorage.removeItem("dashboardSelectedEvent");
                  localStorage.removeItem("dashboardActiveParent");
                  localStorage.removeItem("dashboardActiveSection");
                }}
              >
                <Link
                  className=" rounded-[38px] px-[16px] py-[8px]  border-[1px] border-gray-300  bg-white transition-colors duration-200  text-[#285688] text-lg font-medium leading-[1.5] font-['Noto_Sans']"
                  to="/dashboard"
                >
                  {t("Dashboard")}
                </Link>
              </div>
            )}
        </>
      )}

      {isSearchOpen && !isMobile && (
        <>
          <LanguageDropdown />

          {isLoggedIn ? (
            <UserProfileDropdown />
          ) : (
            <button
              onClick={() => {
                navigate("/auth/login");
              }}
              className="text-sm p-1 px-2 border-[1px] border-gray-300 rounded-xl bg-white  hover:text-primary transition-colors duration-200"
            >
              {t("Login")}
            </button>
          )}
          {isLoggedIn &&
            (userType === "admin" ||
              userType === "team_leader" ||
              userType === "editor") && (
              <div
                onClick={() => {
                  localStorage.removeItem("dashboardSelectedLearn");
                  localStorage.removeItem("dashboardSelectedVideo");
                  localStorage.removeItem("dashboardSelectedNews");
                  localStorage.removeItem("dashboardSelectedEvent");
                  localStorage.removeItem("dashboardActiveParent");
                  localStorage.removeItem("dashboardActiveSection");
                }}
              >
                <Link
                  className="text-sm p-1 text-white px-2 border-[1px] border-gray-300 rounded-xl hover:bg-primary hover:text-white transition-colors duration-200"
                  to="/dashboard"
                >
                  {t("Dashboard")}
                </Link>
              </div>
            )}
        </>
      )}
    </div>
  );
}

export default UserIcons;
