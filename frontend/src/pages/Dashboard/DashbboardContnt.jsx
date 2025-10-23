import { useState, useEffect } from "react";

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
import History from "@/components/ForPages/Dashboard/AboutUs/History/History";
import OurTeam from "@/components/ForPages/Dashboard/AboutUs/OurTeam/OurTeam";
import PositionsContent from "@/components/ForPages/Dashboard/AboutUs/Positions/PositionsContent";
import CardsList from "@/components/ForPages/Dashboard/CardsOrPhotos/CardsList/CardsList";
import PhotosList from "@/components/ForPages/Dashboard/CardsOrPhotos/PhotosList/PhotosList";
import HealthPosts from "@/components/ForPages/Dashboard/HealthPosts/HealthPosts";
import Tv from "@/components/ForPages/Dashboard/TV/TV";
import PostsCategoriesContent from "@/components/ForPages/Dashboard/Posts/PostsCategories/PostsCategoriesContent";
import NewsCategoriesContent from "@/components/ForPages/Dashboard/TV/News/NewsCategories/NewsCategoriesContent";
import VideosCategoriesContent from "@/components/ForPages/Dashboard/Videos/VideosCategories/VideosCategoriesContent";
import CreateOrEditNews from "@/components/ForPages/Dashboard/TV/News/CreateOrEditNews/CreateOrEditNews";
import EventsList from "@/components/ForPages/Dashboard/Events/EventsList/EventsList";
import CreateOrEditEvent from "@/components/ForPages/Dashboard/Events/CreateOrEditEvent/CreateOrEditEvent";
import EventCategoriesContent from "@/components/ForPages/Dashboard/Events/EventsCategories/EventCategoriesContent";
import EventSectionsContent from "@/components/ForPages/Dashboard/Events/EventsSections/EventSectionsContent";

import ProfileContent from "../Profile/ProfileContent";
import SettingsContent from "../Settings/SettingsContent";

export default function Page() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState(() => {
    // استرجاع الصفحة المحفوظة من localStorage عند التحميل
    return localStorage.getItem("dashboardActiveSection") || "home";
  });
  const [activeParent, setActiveParent] = useState(() => {
    // استرجاع العنصر الأساسي المحفوظ من localStorage
    return localStorage.getItem("dashboardActiveParent") || null;
  });
  const [selectedPost, setSelectedPost] = useState(() => {
    // استرجاع المقال المحفوظ إن وجد
    const saved = localStorage.getItem("dashboardSelectedPost");
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedVideo, setSelectedVideo] = useState(() => {
    // استرجاع الفيديو المحفوظ إن وجد
    const saved = localStorage.getItem("dashboardSelectedVideo");
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedNews, setSelectedNews] = useState(() => {
    // استرجاع الأخبار المحفوظة إن وجدت
    const saved = localStorage.getItem("dashboardSelectedNews");
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedEvent, setSelectedEvent] = useState(() => {
    // استرجاع الأحداث المحفوظة إن وجدت
    const saved = localStorage.getItem("dashboardSelectedEvent");
    return saved ? JSON.parse(saved) : null;
  });

  // حفظ الحالة في localStorage عند تغييرها
  useEffect(() => {
    localStorage.setItem("dashboardActiveSection", activeSection);
  }, [activeSection]);

  useEffect(() => {
    if (activeParent) {
      localStorage.setItem("dashboardActiveParent", activeParent);
    }
  }, [activeParent]);

  useEffect(() => {
    if (selectedPost) {
      localStorage.setItem(
        "dashboardSelectedPost",
        JSON.stringify(selectedPost)
      );
    }
  }, [selectedPost]);

  useEffect(() => {
    if (selectedVideo) {
      localStorage.setItem(
        "dashboardSelectedVideo",
        JSON.stringify(selectedVideo)
      );
    }
  }, [selectedVideo]);

  useEffect(() => {
    if (selectedNews) {
      localStorage.setItem(
        "dashboardSelectedNews",
        JSON.stringify(selectedNews)
      );
    }
  }, [selectedNews]);

  useEffect(() => {
    if (selectedEvent) {
      localStorage.setItem(
        "dashboardSelectedEvent",
        JSON.stringify(selectedEvent)
      );
    }
  }, [selectedEvent]);

  // دالة محدثة للتحكم في الأقسام مع دعم العناصر الفرعية
  const handleSectionChange = (section, data = null) => {
    setActiveSection(section);

    // مسح البيانات المحفوظة عند الرجوع للصفحة الرئيسية
    if (section === "home" || section === "Home") {
      localStorage.removeItem("dashboardSelectedPost");
      localStorage.removeItem("dashboardSelectedVideo");
      localStorage.removeItem("dashboardSelectedNews");
      localStorage.removeItem("dashboardSelectedEvent");
      setSelectedPost(null);
      setSelectedVideo(null);
      setSelectedNews(null);
      setSelectedEvent(null);
    }

    // إذا كان القسم createOrEditPost، احفظ بيانات المقال
    if (section === "createOrEditPost") {
      setSelectedPost(data);
    } else if (section === "createOrEditVideo") {
      setSelectedVideo(data);
    } else if (section === "createOrEditNews") {
      setSelectedNews(data);
    } else if (section === "createOrEditEvent") {
      setSelectedEvent(data);
    }

    let autoParent = data;
    if (typeof data === "object" || !autoParent) {
      const parentMap = {
        cards: "Cards Or Photos",
        // photos: "Cards Or Photos",
        posts: "Posts",
        createOrEditPost: "Posts",
        postsCategories: "Posts",
        videos: "Videos",
        createOrEditVideo: "Videos",
        videosCategories: "Videos",
        newsList: "Tv",
        createOrEditNews: "Tv",
        newsCategories: "Tv",
        events: "Events",
        eventsCategories: "Events",
        createOrEditEvent: "Events",
        eventsSections: "Events",
        history: "About Us",
        team: "About Us",
        positions: "About Us",
        settings: "Settings",
        profile: "Settings",
      };
      autoParent = parentMap[section] || null;
    }

    setActiveParent(autoParent);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <DashboardSections />;
      case "settings":
        return <SettingsContent />;
      case "profile":
        return <ProfileContent />;

      case "cards":
        return <CardsList onSectionChange={handleSectionChange} />;
      // case "photos":
      //   return <PhotosList onSectionChange={handleSectionChange} />;

      case "videos":
        return <VideosList onSectionChange={handleSectionChange} />;
      case "videosCategories":
        return (
          <VideosCategoriesContent onSectionChange={handleSectionChange} />
        );
      case "createOrEditVideo":
        return (
          <CreateOrEditVideo
            onSectionChange={handleSectionChange}
            video={selectedVideo}
          />
        );
      case "posts":
        return <PostsList onSectionChange={handleSectionChange} />;
      case "createOrEditPost":
        return (
          <CreateOrEditPost
            onSectionChange={handleSectionChange}
            post={selectedPost}
          />
        );
      case "postsCategories":
        return <PostsCategoriesContent onSectionChange={handleSectionChange} />;
      case "healthPosts":
        return <HealthPosts onSectionChange={handleSectionChange} />;
      case "newsList":
        return <Tv onSectionChange={handleSectionChange} />;
      case "newsCategories":
        return <NewsCategoriesContent onSectionChange={handleSectionChange} />;
      case "createOrEditNews":
        return (
          <CreateOrEditNews
            news={selectedNews}
            onSectionChange={handleSectionChange}
          />
        );
      case "eventsList":
        return <EventsList onSectionChange={handleSectionChange} />;
      case "createOrEditEvent":
        return (
          <CreateOrEditEvent
            event={selectedEvent}
            onSectionChange={handleSectionChange}
          />
        );
      case "eventsCategories":
        return <EventCategoriesContent onSectionChange={handleSectionChange} />;
      case "eventsSections":
        return <EventSectionsContent onSectionChange={handleSectionChange} />;
      case "history":
        return <History onSectionChange={handleSectionChange} />;
      case "team":
        return <OurTeam onSectionChange={handleSectionChange} />;
      case "positions":
        return <PositionsContent onSectionChange={handleSectionChange} />;
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
        <header className="z-0 flex  h-16  shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="w-full mt-7 ">
            <AdminNavbar />
            <div className="absolute top-8 -left-0  h-px w-full z-10">
              <SidebarTrigger className="" />
            </div>
            <div className="flex items-center gap-2 px-4 ">
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
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
