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
}) {
  const { state } = useSidebar(); // 'expanded' | 'collapsed'
  const { t } = useTranslation();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("MAIN")}</SidebarGroupLabel>
      <SidebarMenu>
        {data.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem className="">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  className={`text-sidebarText hover:text-sidebarTextHover py-5  gap-3 hover:bg-sidebarTextBgHover ${
                    state === "collapsed" ? "my-[2px]" : ""
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
                  <span>{item.title}</span>
                  {item.items && item.items.length > 0 && (
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a
                          href={subItem.url}
                          className="  hover:text-sidebarTextHover ml-3 py-5"
                        >
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
