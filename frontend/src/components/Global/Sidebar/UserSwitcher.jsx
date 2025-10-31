import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import { BASE_URL } from "@/configs";

export function UserSwitcher() {
  const [data, setData] = useState();
  const { i18n } = useTranslation();
  useEffect(() => {
    const username = localStorage.getItem("username");
    const userImage = localStorage.getItem("userImage");

    const newData = {};

    if (username) newData.username = JSON.parse(username);
    if (userImage) newData.profile_image_url = JSON.parse(userImage);

    if (Object.keys(newData).length > 0) {
      setData((prev) => ({ ...prev, ...newData }));
    }
  }, []);

  return (
    <div className="mt-1">
      <SidebarMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              {/* Start Avatar */}
              <div className=" flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                <img
                  src={`${BASE_URL}/${data?.profile_image_url}`}
                  alt="avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
              </div>
              {/* End Avatar */}
              <div
                className={`grid flex-1 ${
                  i18n.language === "ar" ? "text-right" : "text-left"
                }  text-sm leading-tight`}
              >
                {/* Start Name */}
                <span className="truncate font-semibold mb-1">
                  {data?.username}
                </span>
                {/* End Name */}
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenu>
    </div>
  );
}
