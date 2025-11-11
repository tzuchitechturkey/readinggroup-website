import Dashboard from "@/pages/Dashboard/DashboardContent";
import Login from "@/pages/Auth/Login/LoginContent";
import Register from "@/pages/Auth/Register/RegisterContent";
import Home from "@/pages/Home/HomeContent";
import AboutUs from "@/pages/AboutUs/AboutUsContent";
import AboutMemberContent from "@/pages/AboutUs/Member/MemberContent";
import VideosPageContent from "@/pages/Videos/VideosPage/VideosPageContent";
import VideoPage from "@/pages/Videos/VideoPage/VideoPageContent";
import CardsAndPhotosContent from "@/pages/CardsAndPhotos/CardsAndPhotos/CardsAndPhotosContent";
import ContentsContent from "@/pages/Contents/ContentsPageContent";
import PostDetailsPageContent from "@/components/Global/PostDetailsPageContent/PostDetailsPageContent";
import EventsContent from "@/pages/Events/EventsPageContent";
import UserProfileContent from "@/pages/UserProfile/UserProfileContent";
import UserSettingContent from "@/pages/Auth/UserSetting/UserSettingContent";
import EventPageContent from "@/pages/Events/EventPageContent";
import Pages404 from "@/pages/NotFound/NotFound";
import EventsVideoPage from "@/components/ForPages/Events/EventsVideoPage/EventsVideoPage";
import TOTPSetup from "@/components/ForPages/Auth/TOTPSetup/TOTPSetup";
import MyListContent from "@/pages/MyList/MyListContent";

export const userRoutes = [
  { path: "/", element: <Home /> },
  { path: "/dashboard", element: <Dashboard /> },
  // About Us Routes
  { path: "/about", element: <AboutUs /> },
  { path: "/about/team/:id", element: <AboutMemberContent /> },
  // Videos Routes
  { path: "/videos", element: <VideosPageContent /> },
  { path: "/videos/:id", element: <VideoPage /> },
  { path: "/my-list", element: <MyListContent /> },
  // Contents Routes
  { path: "/contents", element: <ContentsContent /> },
  { path: "/contents/content/:id", element: <PostDetailsPageContent /> },
  // Cards And Photos Routes
  { path: "/cards-photos/card/:id", element: <PostDetailsPageContent /> },
  { path: "/cards-photos", element: <CardsAndPhotosContent /> },
  // { path: "/cards-photos/photos/:id", element: <PhotoDetailsContent /> },

  // Events Routes
  { path: "/events", element: <EventsContent /> },
  { path: "/events/report/:id", element: <EventPageContent /> },
  { path: "/events/video/:id", element: <EventsVideoPage /> },

  { path: "/profile/:id", element: <UserProfileContent /> },
  { path: "/settings", element: <UserSettingContent /> },

  // Catch-all route for 404 - يجب أن يكون في النهاية
  { path: "*", element: <Pages404 /> },
];

export const authRoutes = [
  { path: "/auth/login", element: <Login /> },
  { path: "/auth/register", element: <Register /> },
  { path: "/auth/totp-setup", element: <TOTPSetup /> },
  { path: "/pages-404", element: <Pages404 /> },
];
