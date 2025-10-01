import React from "react";

import { CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";

import LanguageDropdown from "@/components/Global/LanguageDropdown/LanguageDropdown";
import UserProfileDropdown from "@/components/Global/UserProfileDropdown/UserProfileDropdown";

function UserIcons() {
  return (
    <div className="flex items-center gap-2 ">
      <div className="hidden sm:block border-l border-gray-300 h-6 w-[1px]" />
      <CiSearch className="cursor-pointer text-4xl sm:text-xl hover:text-primary transition-all duration-200 p-1  mx-2  sm:p-0 rounded-full hover:bg-gray-100" />
      <LanguageDropdown />
      <UserProfileDropdown />
    </div>
  );
}

export default UserIcons;
