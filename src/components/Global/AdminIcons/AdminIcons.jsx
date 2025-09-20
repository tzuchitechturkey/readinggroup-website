import React from "react";

import { Link } from "react-router-dom";

import Notification from "../Notifications/Notifications";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

export default function AdminIcons() {
  return (
    <div>
      <div className="flex justify-end items-center gap-4">
        {/* Start Toggle Theme */}
        <div className="">
          <ThemeToggle />
        </div>
        {/* End Toggle Theme */}

        {/* Start Notification */}
        <div className=" ">
          <Notification />
        </div>
        {/* End Notification */}
        {/* Start Messages */}
        <div className="  mr-1">
          <img
            src="../../../../src/assets/Message.png"
            alt="user"
            className="w-6 h-6 rounded-full"
          />
        </div>
        {/* End Messages */}
        {/* Start User Info */}
        <div className="flex items-center gap-4 ">
          <Link to="/admin/profile" className="hidden md:block">
            <img
              src="../../../../src/assets/Beared Guy02-min 1.png"
              alt="user"
              className="w-8 h-8 rounded-full inline  "
            />
          </Link>
          <div className="">
            <p className="text-sm font-semibold">John Doe</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
        {/* End User Info */}
      </div>
    </div>
  );
}
