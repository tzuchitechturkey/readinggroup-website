import React from "react";

import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { useTranslation } from "react-i18next";

import Notification from "../Notifications/Notifications";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

export default function AdminIcons() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex justify-end items-center lg:gap-4">
        {/* Start Toggle Theme */}
        {/* <div className="">
          <ThemeToggle />
        </div> */}
        {/* End Toggle Theme */}
        {/* Start Notification */}
        {/* <Notification /> */}
        <div className=" ">{/* End Notification */}</div>

        {/* Start Messages */}
        {/* <div className="  mr-1">
          <img src="/Message.png" alt="user" className="w-6 h-6 rounded-full" />
        </div> */}
        {/* End Messages */}
        {/* Start Language Dropdown */}
        <div className="">
          <LanguageDropdown iconColor="#999EAD" />
        </div>
        {/* End Language Dropdown */}

        {/* Start Got TO Home */}
        <div
          className="lg:mx-4 "
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
            to="/"
            className="p-1 px-3 border-[1px] border-gray-300 rounded-xl hover:bg-primary hover:text-white transition-colors duration-200"
          >
            {t("Home")}
          </Link>
        </div>
        {/* End Got TO Home */}
      </div>
    </div>
  );
}
