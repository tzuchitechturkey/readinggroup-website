import * as React from "react";

import PropTypes from "prop-types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  FaHome,
  FaBookOpen,
  FaRegNewspaper,
  FaVideo,
  FaQuestionCircle,
  FaSignOutAlt,
  FaCog,
  FaUser,
} from "react-icons/fa";

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

function AppSidebar({
  onSectionChange,
  activeSection,
  activeParent,
  ...props
}) {
  const { t } = useTranslation();

  const data = useMemo(
    () => ({
      footer: [
        { title: t("Help"), icon: <FaQuestionCircle /> },
        { title: t("Logout"), icon: <FaSignOutAlt /> },
      ],
      userInfo: {
        plan: "web-developer",
        name: "MUSA AL AHMED",
        avatar: Avatar,
      },
      navMain: [
        {
          title: t("Home"),
          url: "/",
          icon: <FaHome className="w-5 h-5" />,
        },
        {
          title: t("Read"),
          url: "/about/history",
          icon: <FaBookOpen className="w-5 h-5" />,
          items: [
            { title: t("Team"), url: "/about/team" },
            { title: t("Refunds"), url: "#" },
            { title: t("Declines"), url: "#" },
            { title: t("Payouts"), url: "#" },
          ],
        },
        {
          title: t("Posts"),
          url: "/posts",
          icon: <FaRegNewspaper className="w-5 h-5" />,
          items: [
            { title: t("All Posts"), url: "/#" },
            { title: t("Add Post"), url: "/dashboard/posts/add" },
          ],
        },
        {
          title: t("Videos"),
          url: "/video",
          icon: <FaVideo className="w-5 h-5" />,
          items: [
            { title: t("All Videos"), url: "/#" },
            { title: t("Add Video"), url: "/dashboard/videos/add" },
          ],
        },
      ],
      settings: [
        {
          title: t("Settings"),
          url: "/settings",
          icon: <FaCog className="w-5 h-5" />,
          items: [
            { title: t("Settings"), url: "/settings" },
            {
              title: t("Profile"),
              url: "/profile",
              icon: <FaUser className="w-5 h-5" />,
            },
          ],
        },
      ],
    }),
    [t]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
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

AppSidebar.propTypes = {
  onSectionChange: PropTypes.func.isRequired,
  activeSection: PropTypes.string.isRequired,
  activeParent: PropTypes.string,
};

export default AppSidebar;
