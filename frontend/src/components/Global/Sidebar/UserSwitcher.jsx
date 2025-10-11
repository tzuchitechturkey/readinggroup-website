import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";

export function UserSwitcher({ data }) {
  return (
    <div className="mt-1">
      <SidebarMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              {/* Start Avatar */}
              <div className=" flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                <img
                  src={data?.avatar}
                  alt="avatar"
                  className="h-8 w-8 rounded-full"
                />
              </div>
              {/* End Avatar */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                {/* Start Name */}
                <span className="truncate font-semibold mt-1">{data.name}</span>
                {/* End Name */}
                  {/* Start Position */}
                <span className=" text-gray-500 text-xs">{data.plan}</span>
                {/* End Position */}
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenu>
    </div>
  );
}
