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
import HistoryList from "@/components/ForPages/Dashboard/AboutUs/History/HistoryList";
import OurTeamList from "@/components/ForPages/Dashboard/AboutUs/OurTeam/OurTeamList";
import LearnCategoriesContent from "@/components/ForPages/Dashboard/Learn/LearnCategories/LearnCategoriesContent";
import VideosCategoriesContent from "@/components/ForPages/Dashboard/Videos/VideosCategories/VideosCategoriesContent";
import LiveStreamSchedulesList from "@/components/ForPages/Dashboard/Events/LiveStreamSchedules/LiveStreamSchedulesList/LiveStreamSchedulesList";
import SortSectionContent from "@/components/ForPages/Dashboard/SortSection/SortSectionContent";
import ContentsList from "@/components/ForPages/Dashboard/Contents/ContentList/ContentsList";
import CreateOrEditContent from "@/components/ForPages/Dashboard/Contents/CreateOrEditContent/CreateOrEditContent";
import WebSiteInfoContent from "@/components/ForPages/Dashboard/WebsiteInfo/WebSiteInfoContent";
import ContentsCategoriesContent from "@/components/ForPages/Dashboard/Contents/ContentsCategories/ContentsCategoriesContent";
import BookPage from "@/components/ForPages/Dashboard/AboutUs/Book/BookPage";
import CreateOrEditLearn from "@/components/ForPages/Dashboard/Learn/CreateOrEditLearn/CreateOrEditLearn";
import LearnList from "@/components/ForPages/Dashboard/Learn/LearnList/LearnList";
import PhotoCollectionsList from "@/components/ForPages/Dashboard/Events/PhotoCollection/PhotoCollectionsList";
import PhotoCollectionsCategoriesContent from "@/components/ForPages/Dashboard/Events/PhotoCollection/PhotoCollectionsCategories/PhotoCollectionsCategoriesContent";
import CreateOrEditPhotoCollection from "@/components/ForPages/Dashboard/Events/PhotoCollection/CreateOrEditPhotoCollection/CreateOrEditPhotoCollection";
import RelatedReportsList from "@/components/ForPages/Dashboard/Events/RelatedReports/RelatedReportsList";
import RelatedReportsCategoriesContent from "@/components/ForPages/Dashboard/Events/RelatedReports/RelatedReportsCategories/RelatedReportsCategoriesContent";
import CreateOrEditRelatedReports from "@/components/ForPages/Dashboard/Events/RelatedReports/CreateOrEditRelatedReports/CreateOrEditRelatedReports";
import NewsList from "@/components/ForPages/Dashboard/Events/News/NewsList";
import CreateOrEditLiveStreamSchedule from "@/components/ForPages/Dashboard/Events/LiveStreamSchedules/CreateOrEditLiveStreamSchedule/CreateOrEditLiveStreamSchedule";
import UploadImagesToNews from "@/components/ForPages/Dashboard/Events/News/UploadImagesToNews/UploadImagesToNews";

import ProfileContent from "../Profile/ProfileContent";
import SettingsContent from "../Settings/SettingsContent";
import UploadImagesToTeam from "@/components/ForPages/Dashboard/AboutUs/OurTeam/UploadImagesToTeam/UploadImagesToTeam";
import UploadImagesToReviews from "@/components/ForPages/Dashboard/AboutUs/Book/UploadImagesToReviews";
import UploadImagesToHistory from "@/components/ForPages/Dashboard/AboutUs/History/UploadImagesToHistory";

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
  const [selectedLearn, setSelectedLearn] = useState(() => {
    // استرجاع المقال المحفوظ إن وجد
    const saved = localStorage.getItem("dashboardSelectedLearn");
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedVideo, setSelectedVideo] = useState(() => {
    // استرجاع الفيديو المحفوظ إن وجد
    const saved = localStorage.getItem("dashboardSelectedVideo");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedLiveStream, setSelectedLiveStream] = useState(() => {
    // استرجاع الأحداث المحفوظة إن وجدت
    const saved = localStorage.getItem("dashboardSelectedLiveStream");
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedNews, setSelectedNews] = useState(() => {
    // استرجاع الأخبار المحفوظة إن وجدت
    const saved = localStorage.getItem("dashboardSelectedNews");
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedPhotoCollections, setSelectedPhotoCollections] = useState(
    () => {
      // استرجاع مجموعات الصور المحفوظة إن وجدت
      const saved = localStorage.getItem("dashboardSelectedPhotoCollections");
      return saved ? JSON.parse(saved) : null;
    },
  );
  const [selectedrelatedReports, setSelectedrelatedReports] = useState(() => {
    // استرجاع التقارير المرتبطة المحفوظة إن وجدت
    const saved = localStorage.getItem("dashboardSelectedrelatedReports");
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedWriter, setSelectedWriter] = useState(() => {
    // استرجاع الأحداث المحفوظة إن وجدت
    const saved = localStorage.getItem("dashboardSelectedWriter");
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedBook, setSelectedBook] = useState(() => {
    // استرجاع الأحداث المحفوظة إن وجدت
    const saved = localStorage.getItem("dashboardSelectedBook");
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedHistory, setSelectedHistory] = useState(() => {
    // استرجاع الأحداث المحفوظة إن وجدت
    const saved = localStorage.getItem("dashboardSelectedHistory");
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
    if (selectedLearn) {
      localStorage.setItem(
        "dashboardSelectedLearn",
        JSON.stringify(selectedLearn),
      );
    }
  }, [selectedLearn]);

  useEffect(() => {
    if (selectedVideo) {
      localStorage.setItem(
        "dashboardSelectedVideo",
        JSON.stringify(selectedVideo),
      );
    }
  }, [selectedVideo]);

  useEffect(() => {
    if (selectedLiveStream) {
      localStorage.setItem(
        "dashboardSelectedLiveStream",
        JSON.stringify(selectedLiveStream),
      );
    }
  }, [selectedLiveStream]);
  useEffect(() => {
    if (selectedNews) {
      localStorage.setItem(
        "dashboardSelectedNews",
        JSON.stringify(selectedNews),
      );
    }
  }, [selectedNews]);

  useEffect(() => {
    if (selectedPhotoCollections) {
      localStorage.setItem(
        "dashboardSelectedPhotoCollections",
        JSON.stringify(selectedPhotoCollections),
      );
    }
  }, [selectedPhotoCollections]);
  useEffect(() => {
    if (selectedrelatedReports) {
      localStorage.setItem(
        "dashboardSelectedRelatedReports",
        JSON.stringify(selectedrelatedReports),
      );
    }
  }, [selectedrelatedReports]);

  useEffect(() => {
    if (selectedWriter) {
      localStorage.setItem(
        "dashboardSelectedWriter",
        JSON.stringify(selectedWriter),
      );
    }
  }, [selectedWriter]);

  useEffect(() => {
    if (selectedBook) {
      localStorage.setItem(
        "dashboardSelectedBook",
        JSON.stringify(selectedBook),
      );
    }
  }, [selectedBook]);

  // دالة محدثة للتحكم في الأقسام مع دعم العناصر الفرعية
  const handleSectionChange = (section, data = null) => {
    setActiveSection(section);

    // مسح البيانات المحفوظة عند الرجوع للصفحة الرئيسية
    if (section === "home" || section === "Home") {
      localStorage.removeItem("dashboardSelectedLearn");
      localStorage.removeItem("dashboardSelectedVideo");
      localStorage.removeItem("dashboardSelectedContent");
      localStorage.removeItem("dashboardSelectedLiveStream");
      localStorage.removeItem("dashboardSelectedNews");
      localStorage.removeItem("dashboardSelectedPhotoCollections");
      localStorage.removeItem("dashboardSelectedRelatedReports");
      localStorage.removeItem("dashboardSelectedWriter");
      localStorage.removeItem("dashboardSelectedBook");
      setSelectedLearn(null);
      setSelectedVideo(null);
      setSelectedContent(null);
      setSelectedLiveStream(null);
      setSelectedNews(null);
      setSelectedrelatedReports(null);
      setSelectedPhotoCollections(null);
      setSelectedWriter(null);
      setSelectedBook(null);
      setSelectedHistory(null);
    }

    // إذا كان القسم createOrEditPost، احفظ بيانات المقال
    if (section === "createOrEditLearn") {
      setSelectedLearn(data);
    } else if (section === "createOrEditVideo") {
      setSelectedVideo(data);
    } else if (section === "createOrEditEvent") {
      setSelectedLiveStream(data);
    } else if (section === "createOrEditNews") {
      setSelectedNews(data);
    } else if (section === "createOrEditWriter") {
      setSelectedWriter(data);
    } else if (section === "createOrEditRelatedReports") {
      setSelectedrelatedReports(data);
    } else if (section === "createOrEditPhotoCollection") {
      setSelectedPhotoCollections(data);
    } else if (section === "createOrEditLiveStreamSchedule") {
      setSelectedLiveStream(data);
    } else if (section === "createOrEditReviews") {
      setSelectedBook(data);
    } else if (section === "createOrEditHistory") {
      setSelectedHistory(data);
    }

    let autoParent = data;
    if (typeof data === "object" || !autoParent) {
      const parentMap = {
        learn: "Learn",
        createOrEditLearn: "Learn",
        learnCategories: "Learn",
        // Videos
        videos: "Videos",
        createOrEditVideo: "Videos",
        videosCategories: "Videos",
        // Events
        // events: "Events",
        eventsCategories: "Events",
        createOrEditEvent: "Events",
        news: "Latest News",
        createOrEditNews: "Latest News",
        photoCollections: "Photo Collection",
        createOrEditPhotoCollection: "Photo Collection",
        photoCollectionsCategories: "Photo Collection",
        relatedReports: "Related Reports",
        relatedReportsCategories: "Related Reports",
        createOrEditRelatedReports: "Related Reports",
        // Live Stream Schedule
        liveStreamSchedules: "Live Stream Schedules",
        createOrEditLiveStreamSchedule: "Live Stream Schedules",

        // About Us
        history: "All History",
        createOrEditHistory: "All History",
        team: "Team Members",
        createOrEditTeam: "Team Members",
        positions: "About Us",
        book: "Book",
        createOrEditReviews: "Book",
        booksGroups: "About Us",
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

  console.log(activeSection);
  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <DashboardSections onSectionChange={handleSectionChange} />;
      // Learn
      case "learn":
        return <LearnList onSectionChange={handleSectionChange} />;
      case "createOrEditLearn":
        return (
          <CreateOrEditLearn
            onSectionChange={handleSectionChange}
            learn={selectedLearn}
          />
        );
      case "learnCategories":
        return <LearnCategoriesContent onSectionChange={handleSectionChange} />;

      // Videos
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
      // Live Stream Schedules
      case "liveStreamSchedules":
        return (
          <LiveStreamSchedulesList onSectionChange={handleSectionChange} />
        );
      case "createOrEditLiveStreamSchedule":
        return (
          <CreateOrEditLiveStreamSchedule
            liveStream={selectedLiveStream}
            onSectionChange={handleSectionChange}
          />
        );
      // Photo Collection
      case "photoCollections":
        return <PhotoCollectionsList onSectionChange={handleSectionChange} />;
      case "photoCollectionCategories":
        return (
          <PhotoCollectionsCategoriesContent
            onSectionChange={handleSectionChange}
          />
        );
      case "createOrEditPhotoCollection":
        return (
          <CreateOrEditPhotoCollection
            photoCollection={selectedPhotoCollections}
            onSectionChange={handleSectionChange}
          />
        );
      // Related Reports
      case "relatedReports":
        return <RelatedReportsList onSectionChange={handleSectionChange} />;
      case "relatedReportCategories":
        return (
          <RelatedReportsCategoriesContent
            onSectionChange={handleSectionChange}
          />
        );
      case "createOrEditRelatedReports":
        return (
          <CreateOrEditRelatedReports
            report={selectedrelatedReports}
            onSectionChange={handleSectionChange}
          />
        );
      // News
      case "news":
        return <NewsList onSectionChange={handleSectionChange} />;

      case "createOrEditNews":
        return (
          <UploadImagesToNews
            news={selectedNews}
            onSectionChange={handleSectionChange}
          />
        );

      // About Us
      case "history":
        return <HistoryList onSectionChange={handleSectionChange} />;
      case "createOrEditHistory":
        return <UploadImagesToHistory onSectionChange={handleSectionChange} />;
      case "team":
        return <OurTeamList onSectionChange={handleSectionChange} />;
      case "createOrEditTeam":
        return <UploadImagesToTeam onSectionChange={handleSectionChange} />;
      case "book":
        return <BookPage onSectionChange={handleSectionChange} />;
      case "createOrEditReviews":
        return <UploadImagesToReviews onSectionChange={handleSectionChange} />;

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
