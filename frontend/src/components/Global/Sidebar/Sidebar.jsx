import { useState } from "react";

import { useTranslation } from "react-i18next";

import { DynamicNav } from "@/components/Global/Sidebar/DynamicNav";
import { UserSwitcher } from "@/components/Global/Sidebar/UserSwitcher";
import LogoutConfirmation from "@/components/Global/LogoutConfirmation/LogoutConfirmation";
import Modal from "@/components/Global/Modal/Modal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import DashboardIcon from "@/assets/icons/Home-simple-door.png";
import Posts from "@/assets/icons/Union.png";
import Video from "@/assets/icons/video-icon.png";
import LogOut from "@/assets/icons/Log-out.png";
import Settings from "@/assets/icons/Settings.png";
import WhoWeAre from "@/assets/icons/fluent_chat-32-regular.png";
import TV from "@/assets/icons/tv.png";
import { languages } from "@/constants/constants";

export default function AppSidebar({
  onSectionChange,
  activeSection,
  activeParent,
  ...props
}) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const handleLogout = () => {
    setOpenLogoutModal(true);
  };

  // This is sample data.
  const data = {
    footer: [
      {
        title: "Logout Account",
        icon: LogOut,
        onClick: handleLogout,
      },
    ],

    navMain: [
      {
        title: "Home",
        onClick: () => onSectionChange("Home"),
        icon: DashboardIcon,
      },
      {
        title: "Contents",
        onClick: () => onSectionChange("contents"),
        icon: Video,
        items: [
          {
            title: "All Contents",
            onClick: () => onSectionChange("contents"),
          },
          {
            title: "Add/Edit Content",
            onClick: () => onSectionChange("createOrEditContent"),
          },
          {
            title: "Contents Categories",
            onClick: () => onSectionChange("contentsCategories"),
          },
        ],
      },
      {
        title: "Posts",
        onClick: "#",
        icon: Posts,
        items: [
          {
            title: "All Posts",
            onClick: () => onSectionChange("posts"),
          },
          {
            title: "Add/Edit Post",
            onClick: () => onSectionChange("add-post"),
          },
          {
            title: "Posts Categories",
            onClick: () => onSectionChange("postsCategories"),
          },
        ],
      },
    
      {
        title: "Videos",
        onClick: () => onSectionChange("videos"),
        icon: Video,
        items: [
          {
            title: "All Videos",
            onClick: () => onSectionChange("videos"),
          },
          {
            title: "Add New Video",
            onClick: () => onSectionChange("createOrEditVideo"),
          },
          {
            title: "Videos Categories",
            onClick: () => onSectionChange("videosCategories"),
          },
          {
            title: "Series & Seasons",
            onClick: () => onSectionChange("seriesAndSeasons"),
          },
        ],
      },
  {
        title: "Events",
        onClick: "#",
        icon: TV,
        items: [
          {
            title: "All Events",
            onClick: () => onSectionChange("events"),
          },
          {
            title: "Add/Edit Event",
            onClick: () => onSectionChange("createOrEditEvent"),
          },
          {
            title: "Events Categories",
            onClick: () => onSectionChange("eventsCategories"),
          },
          {
            title: "Events Sections",
            onClick: () => onSectionChange("eventsSections"),
          },
        ],
      },
      {
        title: "About Us",
        onClick: () => onSectionChange("about"),
        icon: WhoWeAre,
        items: [
          {
            title: "History",
            onClick: () => onSectionChange("history"),
          },
          {
            title: "Our Team",
            onClick: () => onSectionChange("team"),
          },
          {
            title: "Positions",
            onClick: () => onSectionChange("positions"),
          },
        ],
      },
    ],

    settings: [
      {
        title: "Settings",
        onClick: "#",
        icon: Settings,
        items: [
          {
            title: "Sort Section",
            onClick: () => onSectionChange("sortSection"),
          },
          {
            title: "Website Info",
            onClick: () => onSectionChange("websiteInfo"),
          },
          {
            title: "Profile Settings",
            onClick: () => onSectionChange("settings"),
          },
        ],
      },
    ],
  };
  return (
    <Sidebar
      style={{ direction: isRtl ? "rtl" : "ltr" }}
      collapsible="icon"
      side={isRtl ? "right" : "left"}
      {...props}
    >
      <SidebarHeader>
        <UserSwitcher onSectionChange={onSectionChange} />
      </SidebarHeader>

      <SidebarContent>
        <hr className="h-[2px] bg-[#2D2F39] w-5/6 mx-auto rounded-lg mt-3" />
        <DynamicNav
          data={data.navMain}
          onSectionChange={onSectionChange}
          activeSection={activeSection}
          activeParent={activeParent}
          title={t("MAIN")}
        />
        <hr className="h-[3px] bg-[#2D2F39] w-5/6 mx-auto rounded-lg mt-3" />
        <DynamicNav
          data={data.settings}
          onSectionChange={onSectionChange}
          activeSection={activeSection}
          activeParent={activeParent}
          title={t("SETTINGS")}
        />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {data.footer.map((item) => {
            const isLanguage = item.type === "language";

            if (!isLanguage) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button
                      type="button"
                      className="w-full"
                      onClick={item.onClick}
                    >
                      {typeof item.icon === "string" ? (
                        <img
                          src={item.icon}
                          alt={item.title}
                          className="w-5 h-5 object-contain max-w-max"
                        />
                      ) : (
                        <span className="w-5 h-5 flex items-center justify-center">
                          {item.icon}
                        </span>
                      )}
                      <span className="truncate">{t(item.title)}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            return (
              <SidebarMenuItem key={item.title}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton asChild>
                      <button type="button" className="w-full">
                        {typeof item.icon === "string" ? (
                          <img
                            src={item.icon}
                            alt={item.title}
                            className="w-5 h-5 object-contain max-w-max"
                          />
                        ) : (
                          <span className="w-5 h-5 flex items-center justify-center">
                            {item.icon}
                          </span>
                        )}
                        <span className="truncate">{item.title}</span>
                        <span className="ml-auto text-xs opacity-80">
                          {getLanguageLabel(currentLang)}
                        </span>
                      </button>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    side="top"
                    align="start"
                    className="w-40"
                  >
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLangChange(lang.code)}
                        className={
                          currentLang === lang.code ? "font-medium" : undefined
                        }
                      >
                        {lang.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />

      {/* Start Logout Modal */}
      <Modal
        isOpen={openLogoutModal}
        onClose={() => setOpenLogoutModal(false)}
        title={t("Log Out")}
      >
        <LogoutConfirmation onCancel={() => setOpenLogoutModal(false)} />
      </Modal>
      {/* End Logout Modal */}
    </Sidebar>
  );
}
