import { useState } from "react";

import { useTranslation } from "react-i18next";

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
import VideosList from "@/components/ForPages/Dashboard/Videos/VideosList/VideosList";
import CreateOrEditVideo from "@/components/ForPages/Dashboard/Videos/CreateOrEditVideo/CreateOrEditVideo";
import PostsList from "@/components/ForPages/Dashboard/Posts/PostsList/PostsList";
import CreateOrEditPost from "@/components/ForPages/Dashboard/Posts/CreateOrEditPost/CreateOrEditPost";

import SettingsContent from "../Settings/SettingsContent";
import ProfileContent from "../Profile/ProfileContent";

export default function Page() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("home");
  const [activeParent, setActiveParent] = useState(null); // للتحكم في العنصر الأساسي النشط

  // دالة محدثة للتحكم في الأقسام مع دعم العناصر الفرعية
  const handleSectionChange = (section, parent = null) => {
    setActiveSection(section);
    setActiveParent(parent);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <DashboardSections />;
      case "settings":
        return <SettingsContent />;
      case "profile":
        return <ProfileContent />;
      case "team":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold">فريق العمل</h2>
            <p>معلومات عن فريق العمل</p>
          </div>
        );
      case "refunds":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold">المبالغ المستردة</h2>
            <p>إدارة المبالغ المستردة</p>
          </div>
        );
      case "declines":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold">المرفوضات</h2>
            <p>إدارة العمليات المرفوضة</p>
          </div>
        );
      case "payouts":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold">المدفوعات</h2>
            <p>إدارة المدفوعات</p>
          </div>
        );
      case "read":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold">قسم القراءة</h2>
            <p>محتوى قسم القراءة هنا</p>
          </div>
        );
      case "videos":
        return <VideosList onSectionChange={handleSectionChange} />;
      case "createOrEditVideo":
        return <CreateOrEditVideo />;
      case "posts":
        return <PostsList onSectionChange={handleSectionChange} />;
      case "createOrEditPost":
        return <CreateOrEditPost />;
      default:
        return <DashboardSections />;
    }
  };
  return (
    <SidebarProvider>
      <Sidebar
        onSectionChange={handleSectionChange}
        activeSection={activeSection}
        activeParent={activeParent}
      />
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
                    <BreadcrumbLink href="#">{t("Home")} </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {t(
                        activeSection === "home"
                          ? "Dashboard"
                          : activeSection === "settings" ||
                            activeSection === "profile"
                          ? "Settings"
                          : activeSection === "read"
                          ? "Read"
                          : activeSection === "posts"
                          ? "Posts"
                          : "Dashboard"
                      )}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </header>
        <div className="border min-h-screen bg-[#F8F9FA] p-3 pt-10">
          {renderContent()}
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
