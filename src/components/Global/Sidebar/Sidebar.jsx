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
import Avatar from "@/assets/Beared Guy02-min 1.png";
import DashboardIcon from "@/assets/icons/Home-simple-door.png";
import Posts from "@/assets/icons/Union.png";
import Video from "@/assets/icons/video-icon.png";
import Help from "@/assets/icons/Help.png";
import LogOut from "@/assets/icons/Log-out.png";
import Reading from "@/assets/icons/Page.png";
import Settings from "@/assets/icons/Settings.png";
import VaadinHealth from "@/assets/icons/vaadin_health-card.png";
import CardsOrPhotos from "@/assets/icons/cardsOrphoto-icon.png";
import WhoWeAre from "@/assets/icons/fluent_chat-32-regular.png";
import TV from "@/assets/icons/tv.png";

export default function AppSidebar({
  onSectionChange,
  activeSection,
  activeParent,
  ...props
}) {
  const { t } = useTranslation();
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const handleLogout = () => {
    setOpenLogoutModal(true);
  };

  const handleHelp = () => {
    // يمكن إضافة وظيفة المساعدة هنا
    // eslint-disable-next-line no-console
    console.log("Help clicked");
  };

  // This is sample data.
  const data = {
    footer: [
      {
        title: "Help",
        icon: Help,
        onClick: handleHelp,
      },
      {
        title: "Logout Account",
        icon: LogOut,
        onClick: handleLogout,
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
        onClick: () => onSectionChange("Home"),
        icon: DashboardIcon,
      },

      {
        title: "Cards Or Photos",
        onClick: "#",
        icon: CardsOrPhotos,
        items: [
          {
            title: "All Cards",
            onClick: () => onSectionChange("cards"),
          },
          {
            title: "All Photos",
            onClick: () => onSectionChange("photos"),
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
            title: "Add New Post",
            onClick: () => onSectionChange("add-post"),
          },
        ],
      },
      {
        title: "Health Posts",
        onClick: () => onSectionChange("healthPosts"),
        icon: VaadinHealth,
      },
      {
        title: "TV",
        onClick: () => onSectionChange("tv"),
        icon: TV,
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
            title: "Settings",
            onClick: "#",
          },
          {
            title: "Profile",
            onClick: "#",
          },
        ],
      },
    ],
  };
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
                    {LANGUAGES.map((lang) => (
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

      {/* مودال تسجيل الخروج */}
      <Modal
        isOpen={openLogoutModal}
        onClose={() => setOpenLogoutModal(false)}
        title={t("Log Out")}
      >
        <LogoutConfirmation onCancel={() => setOpenLogoutModal(false)} />
      </Modal>
    </Sidebar>
  );
}
