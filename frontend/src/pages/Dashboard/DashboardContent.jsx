import { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import Sidebar from "@/components/Global/Sidebar/Sidebar";
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
import SeriesAndSeasonsList from "@/components/ForPages/Dashboard/Videos/SeriesAndSeasons/SeriesAndSeasonsList";
import PostsList from "@/components/ForPages/Dashboard/Posts/PostsList/PostsList";
import CreateOrEditPost from "@/components/ForPages/Dashboard/Posts/CreateOrEditPost/CreateOrEditPost";
import HistoryList from "@/components/ForPages/Dashboard/AboutUs/History/HistoryList";
import OurTeam from "@/components/ForPages/Dashboard/AboutUs/OurTeam/OurTeam";
import PositionsContent from "@/components/ForPages/Dashboard/AboutUs/Positions/PositionsContent";
import PostsCategoriesContent from "@/components/ForPages/Dashboard/Posts/PostsCategories/PostsCategoriesContent";
import VideosCategoriesContent from "@/components/ForPages/Dashboard/Videos/VideosCategories/VideosCategoriesContent";
import EventsList from "@/components/ForPages/Dashboard/Events/EventsList/EventsList";
import CreateOrEditEvent from "@/components/ForPages/Dashboard/Events/CreateOrEditEvent/CreateOrEditEvent";
import EventCategoriesContent from "@/components/ForPages/Dashboard/Events/EventsCategories/EventCategoriesContent";
import EventSectionsContent from "@/components/ForPages/Dashboard/Events/EventsSections/EventSectionsContent";
import SortSectionContent from "@/components/ForPages/Dashboard/SortSection/SortSectionContent";
import ContentsList from "@/components/ForPages/Dashboard/Contents/ContentList/ContentsList";
import CreateOrEditContent from "@/components/ForPages/Dashboard/Contents/CreateOrEditContent/CreateOrEditContent";
import WebSiteInfoContent from "@/components/ForPages/Dashboard/WebsiteInfo/WebSiteInfoContent";
import ContentsCategoriesContent from "@/components/ForPages/Dashboard/Contents/ContentsCategories/ContentsCategoriesContent";
import BookContent from "@/components/ForPages/Dashboard/AboutUs/Book/BookContent";
import CreateorEditWriter from "@/components/ForPages/Dashboard/Writers/CreateorEditWriter/CreateorEditWriter";
import WritersList from "@/components/ForPages/Dashboard/Writers/WritersList";

import ProfileContent from "../Profile/ProfileContent";
import SettingsContent from "../Settings/SettingsContent";

export default function Page() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const direction = isRtl ? "rtl" : "ltr";

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
  const [selectedContent, setSelectedContent] = useState(() => {
    // استرجاع المحتوى المحفوظ إن وجد
    const saved = localStorage.getItem("dashboardSelectedContent");
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedEvent, setSelectedEvent] = useState(() => {
    // استرجاع الأحداث المحفوظة إن وجدت
    const saved = localStorage.getItem("dashboardSelectedEvent");
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedWriter, setSelectedWriter] = useState(() => {
    // استرجاع الأحداث المحفوظة إن وجدت
    const saved = localStorage.getItem("dashboardSelectedWriter");
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
  useEffect(() => {
    if (selectedWriter) {
      localStorage.setItem(
        "dashboardSelectedWriter",
        JSON.stringify(selectedWriter)
      );
    }
  }, [selectedWriter]);

  // دالة محدثة للتحكم في الأقسام مع دعم العناصر الفرعية
  const handleSectionChange = (section, data = null) => {
    setActiveSection(section);

    // مسح البيانات المحفوظة عند الرجوع للصفحة الرئيسية
    if (section === "home" || section === "Home") {
      localStorage.removeItem("dashboardSelectedPost");
      localStorage.removeItem("dashboardSelectedVideo");
      localStorage.removeItem("dashboardSelectedContent");
      localStorage.removeItem("dashboardSelectedEvent");
      localStorage.removeItem("dashboardSelectedWriter");
      setSelectedPost(null);
      setSelectedVideo(null);
      setSelectedContent(null);
      setSelectedEvent(null);
      setSelectedWriter(null);
    }

    // إذا كان القسم createOrEditPost، احفظ بيانات المقال
    if (section === "createOrEditPost") {
      setSelectedPost(data);
    } else if (section === "createOrEditVideo") {
      setSelectedVideo(data);
    } else if (section === "createOrEditContent") {
      setSelectedContent(data);
    } else if (section === "createOrEditEvent") {
      setSelectedEvent(data);
    } else if (section === "createOrEditWriter") {
      setSelectedWriter(data);
    }

    let autoParent = data;
    if (typeof data === "object" || !autoParent) {
      const parentMap = {
        // Posts
        cards: "Cards Or Photos",
        // photos: "Cards Or Photos",
        posts: "Posts",
        createOrEditPost: "Posts",
        postsCategories: "Posts",
        // Videos
        videos: "Videos",
        createOrEditVideo: "Videos",
        videosCategories: "Videos",
        seriesAndSeasons: "Videos",
        // Contents
        contents: "Contents",
        createOrEditContent: "Contents",
        ContentsCategories: "Contents",
        // Events
        events: "Events",
        eventsCategories: "Events",
        createOrEditEvent: "Events",
        eventsSections: "Events",
        // About Us
        history: "About Us",
        team: "About Us",
        positions: "About Us",
        book: "THe Book",
        // Settings && Profile
        profileSettings: "Settings",
        profile: "Settings",
        // Website Info
        websiteInfo: "Settings",
        sortSection: "Settings",
      };
      autoParent = parentMap[section] || null;
    }

    setActiveParent(autoParent);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <DashboardSections onSectionChange={handleSectionChange} />;
      // posts
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

      // Videos
      case "videos":
        return <VideosList onSectionChange={handleSectionChange} />;
      case "videosCategories":
        return (
          <VideosCategoriesContent onSectionChange={handleSectionChange} />
        );
      case "seriesAndSeasons":
        return <SeriesAndSeasonsList onSectionChange={handleSectionChange} />;
      case "createOrEditVideo":
        return (
          <CreateOrEditVideo
            onSectionChange={handleSectionChange}
            video={selectedVideo}
          />
        );
      // contents
      case "contents":
        return <ContentsList onSectionChange={handleSectionChange} />;
      case "contentsCategories":
        return (
          <ContentsCategoriesContent onSectionChange={handleSectionChange} />
        );
      case "createOrEditContent":
        return (
          <CreateOrEditContent
            content={selectedContent}
            onSectionChange={handleSectionChange}
          />
        );
      // Events
      case "events":
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
      // Writers
      case "writers":
        return <WritersList onSectionChange={handleSectionChange} />;
      case "createOrEditWriter":
        return (
          <CreateorEditWriter
            onSectionChange={handleSectionChange}
            selectedWriter={selectedWriter}
          />
        );
      // About Us
      case "history":
        return <HistoryList onSectionChange={handleSectionChange} />;
      case "team":
        return <OurTeam onSectionChange={handleSectionChange} />;
      case "positions":
        return <PositionsContent onSectionChange={handleSectionChange} />;
      case "book":
        return <BookContent onSectionChange={handleSectionChange} />;
      default:
        return <DashboardSections />;
      // Profile && Settings
      case "profileSettings":
        return <SettingsContent onSectionChange={handleSectionChange} />;
      case "profile":
        return <ProfileContent onSectionChange={handleSectionChange} />;
      // Website Info
      case "websiteInfo":
        return <WebSiteInfoContent onSectionChange={handleSectionChange} />;
      case "sortSection":
        return <SortSectionContent onSectionChange={handleSectionChange} />;
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("userType");
    if (!user || user !== "admin") {
      localStorage.setItem("redirectAfterLogin", "/dashboard");
      window.location.href = "/auth/login";
    }
  }, []);

  return (
    <div dir={direction} className="min-h-screen">
      <SidebarProvider>
        <Sidebar
          onSectionChange={handleSectionChange}
          activeSection={activeSection}
          activeParent={activeParent}
        />
        <SidebarInset>
          <header className="  z-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="w-full mt-7">
              <AdminNavbar />
              <div
                className={`absolute top-6 lg:top-8 h-px  z-10 ${
                  isRtl ? "right-0" : "left-0"
                }`}
              >
                <SidebarTrigger className="" />
              </div>
              <div
                className={`flex items-center gap-2 px-4 ${
                  isRtl ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
              </div>
            </div>
          </header>
          <div className="  min-h-screen bg-[#F8F9FA] lg:p-3 py-5 lg:pt-10">
            {renderContent()}
          </div>
          {/* Start Footer small note */}
          <div className=" ">
            <DashboardFooter />
          </div>
          {/* Start Footer small note */}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
