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
import { getSectionKey } from "@/Utility/getSectionKey";

export function DynamicNav({
  data,
  onSectionChange,
  activeSection,
  activeParent,
}) {
  const { state } = useSidebar(); // 'expanded' | 'collapsed'

  return (
    <SidebarGroup>
      <SidebarGroupLabel>MAIN</SidebarGroupLabel>
      <SidebarMenu>
        {data.map((item) => {
          const sectionKey = getSectionKey(item.title);
          // تحقق من كون العنصر نشط (مباشرة أو كعنصر أساسي للفرعي النشط)
          const isActive =
            activeSection === sectionKey || activeParent === sectionKey;
          // تحقق من وجود عنصر فرعي نشط
          const hasActiveChild = item.items?.some(
            (subItem) => activeSection === getSectionKey(subItem.title)
          );

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive || hasActiveChild}
              className="group/collapsible"
            >
              <SidebarMenuItem className="">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={`text-sidebarText hover:text-sidebarTextHover py-5  gap-3 hover:bg-sidebarTextBgHover ${
                      state === "collapsed" ? "my-[2px]" : ""
                    } ${
                      isActive || hasActiveChild
                        ? "bg-sidebarTextBgHover text-sidebarTextHover"
                        : ""
                    }`}
                    tooltip={item.title}
                    tooltipChild={
                      item.items && item.items.length > 0 ? item.items : []
                    }
                    onClick={(e) => {
                      // إذا لم توجد عناصر فرعية، غير القسم النشط
                      if (!item.items || item.items.length === 0) {
                        e.preventDefault();
                        onSectionChange?.(sectionKey);
                      }
                    }}
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
                    {item.items?.map((subItem) => {
                      const subSectionKey = getSectionKey(subItem.title);
                      const isSubActive = activeSection === subSectionKey;

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <button
                              onClick={() =>
                                onSectionChange?.(subSectionKey, sectionKey)
                              }
                              className={`w-full text-left hover:text-sidebarTextHover ml-3 py-5 ${
                                isSubActive
                                  ? "bg-sidebarTextBgHover text-sidebarTextHover"
                                  : ""
                              }`}
                            >
                              <span>{subItem.title}</span>
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
