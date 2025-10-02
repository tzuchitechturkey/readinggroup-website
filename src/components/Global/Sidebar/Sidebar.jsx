

import i18n from "@/i18n/i18n";
import { DynamicNav } from "@/components/Global/Sidebar/DynamicNav";
import { UserSwitcher } from "@/components/Global/Sidebar/UserSwitcher";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// تأكد من صحة المسار (اسم الملف يحتوي مسافة)
import Avatar from "../../../../src/assets/Beared Guy02-min 1.png";
import DashboardIcon from "../../../../src/assets/icons/Home-simple-door.png";
import Posts from "../../../../src/assets/icons/Union.png";
import Video from "../../../../src/assets/icons/video-icon.png";
import Help from "../../../../src/assets/icons/Help.png";
import LogOut from "../../../../src/assets/icons/Log-out.png";
import Reading from "../../../../src/assets/icons/Page.png";
import Settings from "../../../../src/assets/icons/Settings.png";
import VaadinHealth from "../../../../src/assets/icons/vaadin_health-card.png";
import CardsOrPhotos from "../../../../src/assets/icons/cardsOrphoto-icon.png";
import WhoWeAre from "../../../../src/assets/icons/fluent_chat-32-regular.png";
import TV from "../../../../src/assets/icons/tv.png";

export default function AppSidebar({
  onSectionChange,
  activeSection,
  activeParent,
  ...props
}) {
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
        onClick: () => onSectionChange("Home"),
        icon: DashboardIcon,
      },
      {
        title: "Read",
        onClick: () => onSectionChange("read"),
        icon: Reading,
        items: [
          {
            title: "Refunds",
            onClick: () => onSectionChange("refunds"),
          },
          {
            title: "Declines",
            onClick: () => onSectionChange("declines"),
          },
          {
            title: "Payouts",
            onClick: () => onSectionChange("payouts"),
          },
        ],
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
        <SidebarMenu>
          {data.footer.map((item) => {
            const isLanguage = item.type === "language";

            if (!isLanguage) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button type="button" className="w-full">
                      {item.icon}
                      <span className="truncate">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            // عنصر اللغة: Dropdown بنفس تنسيق أزرار القائمة
            return (
              <SidebarMenuItem key={item.title}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton asChild>
                      <button type="button" className="w-full">
                        {item.icon}
                        <span className="truncate">{item.title}</span>
                        {/* إظهار اللغة الحالية بمحاذاة اليمين بنفس سلوك العناصر */}
                        <span className="ml-auto text-xs opacity-80">
                          {getLanguageLabel(currentLang)}
                        </span>
                      </button>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent side="top" align="start" className="w-40">
                    {LANGUAGES.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLangChange(lang.code)}
                        className={currentLang === lang.code ? "font-medium" : undefined}
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
    </Sidebar>
  );
}
