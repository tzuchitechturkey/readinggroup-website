import React from "react";

import { CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";

import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";

function UserIcons() {
  return (
    <div className="flex items-center gap-5 p-4">
      <div className="border-l-2 border-black h-5 w-[1px]" />
      <CiSearch className="cursor-pointer text-xl hover:scale-110 transition-all duration-200 " />
      <LanguageDropdown />
      <CgProfile className="cursor-pointer text-xl hover:scale-110 transition-all duration-200 " />
    </div>
  );
}

export default UserIcons;
