import React from "react";

import { IoMdNotifications } from "react-icons/io";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const notifications = [
  { id: 1, text: "New message from admin" },
  { id: 2, text: "Your profile was updated" },
  { id: 3, text: "Weekly newsletter available" },
];

export default function Notifications() {
  return (
    <div className="mt-1">
      <DropdownMenu>
        <DropdownMenuTrigger className="border-none outline-none bg-transparent  ">
          <IoMdNotifications className="text-2xl dark:text-[#1F7951] text-primary cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[220px]">
          {notifications.length === 0 ? (
            <DropdownMenuItem className="text-gray-400">
              No notifications
            </DropdownMenuItem>
          ) : (
            notifications.map((notif) => (
              <DropdownMenuItem key={notif.id} className="text-sm">
                {notif.text}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
