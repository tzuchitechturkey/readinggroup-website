import * as React from "react";

import { DynamicNav } from "@/components/Global/Sidebar/DynamicNav";
import { NavFooter } from "@/components/Global/Sidebar/NavFooter";
import { UserSwitcher } from "@/components/Global/Sidebar/UserSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import Avatar from "../../../../src/assets/Beared Guy02-min 1.png";
import DashboardIcon from "../../../../src/assets/icons/Home-simple-door.png";
import Posts from "../../../../src/assets/icons/Union.png";
import Video from "../../../../src/assets/icons/video-icon.png";
import Help from "../../../../src/assets/icons/Help.png";
import LogOut from "../../../../src/assets/icons/Log-out.png";
import Reading from "../../../../src/assets/icons/Page.png";
import Settings from "../../../../src/assets/icons/Settings.png";
import User from "../../../../src/assets/icons/User 1.png";
import VaadinHealth from "../../../../src/assets/icons/vaadin_health-card.png";
// This is sample data.
const data = {
  footer: [
    {
      title: "Help",
      icon: Help,
    },
    {
      title: "Logout Account",
      icon: LogOut,
    },
  ],
  userInfo: {
    name: "MUSA AL AHMED",
    avatar: Avatar,
    plan: "web-developer",
  },

  navMain: [
    {
      title: "Home",
      url: "/ ",
      icon: DashboardIcon,
    },
    {
      title: "Read",
      url: "/about/history",
      icon: Reading,
      items: [
        {
          title: "team",
          url: "/about/team",
        },
        {
          title: "Refunds",
          url: "#",
        },
        {
          title: "Declines",
          url: "#",
        },
        {
          title: "Payouts",
          url: "#",
        },
      ],
    },

    {
      title: "Posts",
      url: "/posts",
      icon: Posts,
      items: [
        {
          title: "All Posts",
          url: "/#",
        },
        {
          title: "Add New Post",
          url: "/dashboard/posts/add",
        },
      ],
    },

    {
      title: "Videos",
      url: "/video",
      icon: Video,
      items: [
        {
          title: "All Videos",
          url: "/#",
        },
        {
          title: "Add New Video",
          url: "/dashboard/videos/add",
        },
      ],
    },
  ],

  settings: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "Settings",
          url: "/Settings",
        },
        {
          title: "Profile",
          url: "/Profile",
        },
      ],
    },
  ],
};

export default function AppSidebar({
  onSectionChange,
  activeSection,
  activeParent,
  ...props
}) {
  return (
    <Sidebar collapsible="icon" className="" {...props}>
      <SidebarHeader>
        <UserSwitcher data={data.userInfo} />
      </SidebarHeader>

      <SidebarContent>
        <hr className="h-[2px] bg-[#2D2F39] w-5/6 mx-auto rounded-lg mt-3" />
        <DynamicNav
          data={data.navMain}
          onSectionChange={onSectionChange}
          activeSection={activeSection}
          activeParent={activeParent}
        />
        <hr className="h-[3px] bg-[#2D2F39] w-5/6 mx-auto rounded-lg mt-3" />
        <DynamicNav
          data={data.settings}
          onSectionChange={onSectionChange}
          activeSection={activeSection}
          activeParent={activeParent}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter data={data.footer} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
