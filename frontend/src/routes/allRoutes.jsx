import { lazy } from "react";

import ContentPage from "../pages/Contents/ContentPage/ContentPage";

// Lazy load all page components
const Dashboard = lazy(() => import("@/pages/Dashboard/DashboardContent"));
const Login = lazy(() => import("@/pages/Auth/Login/LoginContent"));
const Register = lazy(() => import("@/pages/Auth/Register/RegisterContent"));
const Home = lazy(() => import("@/pages/Home/HomeContent"));
const AboutUs = lazy(() => import("@/pages/AboutUs/AboutUsContent"));
const AboutMemberContent = lazy(() =>
  import("@/pages/AboutUs/Member/MemberContent")
);
const VideosPageContent = lazy(() =>
  import("@/pages/Videos/VideosPage/VideosPageContent")
);
const VideoPage = lazy(() =>
  import("@/pages/Videos/VideoPage/VideoPageContent")
);
const CardsAndPhotosContent = lazy(() =>
  import("@/pages/CardsAndPhotos/CardsAndPhotos/CardsAndPhotosContent")
);
const ContentsContent = lazy(() =>
  import("@/pages/Contents/ContentsPageContent")
);
const PostDetailsPageContent = lazy(() =>
  import("@/components/Global/PostDetailsPageContent/PostDetailsPageContent")
);
const EventsContent = lazy(() => import("@/pages/Events/EventsPageContent"));
const UserProfileContent = lazy(() =>
  import("@/pages/UserProfile/UserProfileContent")
);
const UserSettingContent = lazy(() =>
  import("@/pages/Auth/UserSetting/UserSettingContent")
);
const EventPageContent = lazy(() => import("@/pages/Events/EventPageContent"));
const Pages404 = lazy(() => import("@/pages/NotFound/NotFound"));
const EventsVideoPage = lazy(() =>
  import("@/components/ForPages/Events/EventsVideoPage/EventsVideoPage")
);
const TOTPSetup = lazy(() =>
  import("@/components/ForPages/Auth/TOTPSetup/TOTPSetup")
);
const MyListContent = lazy(() => import("@/pages/MyList/MyListContent"));

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
  { path: "/contents/content/:id", element: <ContentPage /> },
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
