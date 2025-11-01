import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import { BASE_URL } from "@/configs";

export function UserSwitcher({ onSectionChange }) {
  const [data, setData] = useState();
  const { i18n } = useTranslation();
  useEffect(() => {
    const username = localStorage.getItem("username");
    const userImage = localStorage.getItem("userImage");

    const newData = {};

    if (username) {
      try {
        newData.username = JSON.parse(username);
      } catch {
        newData.username = username;
      }
    }
    if (userImage) {
      try {
        newData.profile_image_url = JSON.parse(userImage);
      } catch {
        newData.profile_image_url = userImage;
      }
    }

    if (Object.keys(newData).length > 0) {
      setData((prev) => ({ ...prev, ...newData }));
    }
  }, []);

  return (
    <div className="mt-1">
      <SidebarMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              onClick={() => onSectionChange("profile")}
              size="lg"
            >
              {/* Start Avatar */}
              <div className=" flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                <img
                  src={
                    data?.profile_image_url
                      ? `${BASE_URL}/${data?.profile_image_url}`
                      : "/fake-user.png"
                  }
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
                  {data?.display_name || data?.username}
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
