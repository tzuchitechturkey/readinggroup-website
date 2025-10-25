import Dashboard from "@/pages/Dashboard/DashbboardContnt";
import Login from "@/pages/Auth/Login/LoginContent";
import Register from "@/pages/Auth/Register/RegisterContent";
import Home from "@/pages/Home/HomeContent";
import AboutUs from "@/pages/AboutUs/AboutUsContent";
import AboutMemberContent from "@/pages/AboutUs/Member/MemberContent";
import VideosPageContent from "@/pages/Videos/VideosPage/VideosPageContent";
import VideoDetails from "@/pages/Videos/VideoDetails/VideoDetailsContent";
import VideoPage from "@/pages/Videos/VideoPage/VideoPageContent";
import CardsAndPhotosContent from "@/pages/CardsAndPhotos/CardsAndPhotos/CardsAndPhotosContent";
import GuidedReadingContent from "@/pages/GuidedReading/GuidedReadingPageContent";
import CardDetailsContent from "@/pages/GuidedReading/CardDetails/CardDetailsPageContent";
import PhotoDetailsContent from "@/pages/Photos/PhotoDetails/PhotoDetailsContent";
import EventsContent from "@/pages/Events/EventsPageContent";
import UserProfileContent from "@/pages/UserProfile/UserProfileContent";
import UserSettingContent from "@/pages/Auth/UserSetting/UserSettingContent";
import NewsContent from "@/pages/Events/News/NewsContent";
import Pages404 from "@/pages/NotFound/NotFound";
import SearchContent from "@/pages/Search/SearchPageContent";

export const userRoutes = [
  { path: "/", element: <Home /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/about", element: <AboutUs /> },
  { path: "/about/team/:id", element: <AboutMemberContent /> },
  { path: "/videos", element: <VideosPageContent /> },
  { path: "/videos/details/:id", element: <VideoDetails /> },
  { path: "/videos/:id", element: <VideoPage /> },
  { path: "/guiding-reading", element: <GuidedReadingContent /> },
  { path: "/cards-photos/card/:id", element: <CardDetailsContent /> },
  { path: "/cards-photos", element: <CardsAndPhotosContent /> },
  { path: "/cards-photos/card/:id", element: <CardDetailsContent /> },
  { path: "/cards-photos/photos/:id", element: <PhotoDetailsContent /> },
  {
    path: "/guiding-reading/weekly-moments/:id",
    element: <CardDetailsContent />,
  },
  { path: "/events", element: <EventsContent /> },
  { path: "/events/:id", element: <NewsContent /> },
  { path: "/profile", element: <UserProfileContent /> },
  { path: "/settings", element: <UserSettingContent /> },
  { path: "/search", element: <SearchContent /> },

  // Catch-all route for 404 - يجب أن يكون في النهاية
  { path: "*", element: <Pages404 /> },
];

export const authRoutes = [
  { path: "/auth/login", element: <Login /> },
  { path: "/auth/register", element: <Register /> },
  { path: "/pages-404", element: <Pages404 /> },
];
