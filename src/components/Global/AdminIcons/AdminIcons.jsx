import React from "react";

import { Link } from "react-router-dom";

import Notification from "../Notifications/Notifications";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

export default function AdminIcons() {
  return (
    <div>
      <div className="flex justify-end items-center gap-4">
        {/* Start Toggle Theme */}
        {/* <div className="">
          <ThemeToggle />
        </div> */}
        {/* End Toggle Theme */}
        {/* Start Notification */}

        <Notification />
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
      </div>
    </div>
  );
}
