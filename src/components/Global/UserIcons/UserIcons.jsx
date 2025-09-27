import React from "react";

import { CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";

import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";

function UserIcons() {
  return (
    <div className="flex items-center gap-4">
      <div className="border-l border-gray-300 h-6 w-[1px]" />
      <CiSearch className="cursor-pointer text-lg hover:text-blue-600 transition-all duration-200" />
      <LanguageDropdown />
      <CgProfile className="text-xl cursor-pointer   hover:text-blue-600 transition-all duration-200" />
    </div>
  );
}

export default UserIcons;
