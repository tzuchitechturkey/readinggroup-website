import { ChevronRight } from "lucide-react";

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

export function DynamicNav({ data }) {
  const { state } = useSidebar(); // 'expanded' | 'collapsed'

  return (
    <SidebarGroup>
      <SidebarGroupLabel>MAIN</SidebarGroupLabel>
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
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-5 h-5 object-contain max-w-max"
                  />
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
