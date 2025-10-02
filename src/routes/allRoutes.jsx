import Dashboard from "@/pages/Dashboard/DashbboardContnt";
import Login from "@/pages/Auth/Login/LoginContent";
import Register from "@/pages/Auth/Register/RegisterContent";
import Home from "@/pages/Home/HomeContent";
import AboutHistory from "@/pages/AboutUs/History/HistoryContent";
import AboutTeam from "@/pages/AboutUs/Team/TeamContent";
import AboutUser from "@/pages/AboutUs/User/UserContent";
import VideosPageContent from "@/pages/Videos/VideosPage/VideosPageContent";
import VideoDetails from "@/pages/Videos/VideoDetails/VideoDetailsContent";
import VideoPage from "@/pages/Videos/VideoPage/VideoPageContent";
import CardsAndPhotosContent from "@/pages/CardsAndPhotos/CardsAndPhotos/CardsAndPhotosContent";
import GuidedReadingContent from "@/pages/GuidedReading/GuidedReadingContent";
import CardDetailsContent from "@/pages/GuidedReading/CardDetails/CardDetailsContent";
import PhotoDetailsContent from "@/pages/Photos/PhotoDetails/PhotoDetailsContent";
import ConnectContent from "@/pages/Connect/ConnectContent";
import UserProfileContent from "@/pages/UserProfile/UserProfileContent";
import UserSettingContent from "@/pages/Auth/UserSetting/UserSettingContent";
// import Pages404 from "@/pages/Pages404";

export const userRoutes = [
  { path: "/", element: <Home /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/about/history", element: <AboutHistory /> },
  { path: "/about/team", element: <AboutTeam /> },
  { path: "/about/user", element: <AboutUser /> },
  { path: "/videos", element: <VideosPageContent /> },
  { path: "/videos/details/:id", element: <VideoDetails /> },
  { path: "/videos/:id", element: <VideoPage /> },
  { path: "/guiding-reading", element: <GuidedReadingContent /> },
  { path: "//cards-photos/card/:id", element: <CardDetailsContent /> },
  { path: "/cards-photos", element: <CardsAndPhotosContent /> },
  { path: "/cards-photos/photos/:id", element: <PhotoDetailsContent /> },
  { path: "/connect", element: <ConnectContent /> },
  { path: "/profile", element: <UserProfileContent /> },
  { path: "/settings", element: <UserSettingContent /> },
];

export const authRoutes = [
  { path: "/auth/login", element: <Login /> },
  { path: "/auth/register", element: <Register /> },
  // { path: "/pages-404", element: <Pages404 /> },
];
