import { useState } from "react";

import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getSectionKey } from "@/Utility/getSectionKey";

export function DynamicNav({
  data,
  onSectionChange,
  activeSection,
  activeParent,
  title,
}) {
  const { state } = useSidebar(); // 'expanded' | 'collapsed'
  const { t, i18n } = useTranslation();
  const [openItem, setOpenItem] = useState(activeParent || null);

  return (
    <SidebarGroup>
      <SidebarGroupLabel style={{ padding: 0 }}>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {data.map((item) => {
          const isOpen = openItem === item.title;

          return (
            <Collapsible
              key={item.title}
              asChild
              open={isOpen}
              onOpenChange={(open) => {
                if (open) {
                  setOpenItem(item.title);
                } else if (openItem === item.title) {
                  setOpenItem(null);
                }
              }}
              className="group/collapsible"
            >
              <SidebarMenuItem className="">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    onClick={() => {
                      if (!item.items || item.items.length === 0) {
                        const key = getSectionKey(item.title);
                        onSectionChange(key);
                      }
                    }}
                    onChildClick={(childTitle) => {
                      const key = getSectionKey(childTitle);
                      onSectionChange(key);
                    }}
                    onParentClick={(parentTitle) => {
                      const key = getSectionKey(parentTitle);
                      onSectionChange(key);
                    }}
                    activeSection={activeSection}
                    className={`py-5 gap-3 ${
                      state === "collapsed" ? "my-[2px]" : ""
                    } ${
                      activeParent === item.title ||
                      (!item.items &&
                        activeSection === getSectionKey(item.title))
                        ? "text-primary bg-sidebarTextBgHover "
                        : "hover:!text-primary hover:bg-sidebarTextBgHover"
                    }`}
                    tooltip={item.title}
                    tooltipChild={
                      item.items && item.items.length > 0 ? item.items : []
                    }
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
                    <span>{t(item.title)}</span>
                    {item.items && item.items.length > 0 && (
                      <ChevronRight
                        className={`${
                          i18n?.language === "ar" ? " mr-auto" : " ml-auto"
                        } transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90`}
                      />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <SidebarMenuSub i18n={i18n}>
                    {item.items?.map((subItem) => {
                      const key = getSectionKey(subItem.title);
                      const isActive = activeSection === key;

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <button
                              onClick={() => {
                                onSectionChange(key);
                              }}
                              className={`ml-3 py-5 ${
                                isActive
                                  ? " bg-sidebarTextBgHover !text-primary "
                                  : "text-sidebarText hover:!text-primary"
                              }`}
                            >
                              <span>{t(subItem.title)}</span>
                            </button>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
