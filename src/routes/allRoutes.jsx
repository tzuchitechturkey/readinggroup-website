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
import GuidedReadingContent from "@/pages/GuidedReading/GuidedReadingContent";
import ConnectContent from "@/pages/Connect/ConnectContent";
import UserProfileContent from "@/pages/UserProfile/UserProfileContent";
import UserSettingContent from "@/pages/Auth/UserSetting/UserSettingContent";
// import Pages404 from "@/pages/Pages404";

export const userRoutes = [
  { path: "/", element: <Home /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/about", element: <AboutUs /> },
  { path: "/about/team/:id", element: <AboutMemberContent /> },
  { path: "/videos", element: <VideosPageContent /> },
  { path: "/videos/details/:id", element: <VideoDetails /> },
  { path: "/videos/:id", element: <VideoPage /> },
  { path: "/guiding-reading", element: <GuidedReadingContent /> },
  { path: "/cards-photos", element: <CardsAndPhotosContent /> },
  { path: "/connect", element: <ConnectContent /> },
  { path: "/profile", element: <UserProfileContent /> },
  { path: "/settings", element: <UserSettingContent /> },
];

export const authRoutes = [
  { path: "/auth/login", element: <Login /> },
  { path: "/auth/register", element: <Register /> },
  // { path: "/pages-404", element: <Pages404 /> },
];
