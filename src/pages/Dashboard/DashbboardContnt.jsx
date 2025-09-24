import Sidebar from "@/components/Global/Sidebar/Sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AdminNavbar from "@/components/Global/AdminNavbar/AdminNavbar";
import DashboardFooter from "@/components/ForPages/Dashboard/DashboardFooter/DashboardFooter";
import DashboardSections from "@/components/ForPages/Dashboard/DashboardSections/DashboardSections";

import SettingsContent from "../Settings/SettingsContent";
import ProfileContent from "../Profile/ProfileContent";

export default function Page() {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <header className="z-50 flex  h-16  shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="w-full mt-7 ">
            <AdminNavbar />
            <div className="absolute top-8 -left-2  h-px w-full z-10">
              <SidebarTrigger className="" />
            </div>
            <div className="flex items-center gap-2 px-4 ">
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb className="text-sm mt-4 ">
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Settings</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </header>
        {/* <NexaDashboard /> */}
        <div className="border min-h-screen bg-[#F8F9FA] p-3 pt-10">
          {/* <SettingsContent /> */}
          <ProfileContent />
        </div>
        {/* Start Footer small note */}
        <div className=" ">
          <DashboardFooter />
        </div>
        {/* Start Footer small note */}
      </SidebarInset>
    </SidebarProvider>
  );
}
