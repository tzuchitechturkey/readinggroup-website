import Dashboard from "@/pages/Dashboard/DashbboardContnt";
import Login from "@/pages/Auth/Login/LoginContent";
import Register from "@/pages/Auth/Register/RegisterContent";
import Home from "@/pages/Home/HomeContent";
import AboutHistory from "@/pages/AboutUs/History/HistoryContent";
import AboutTeam from "@/pages/AboutUs/Team/TeamContent";
import AboutUser from "@/pages/AboutUs/User/UserContent";
// import Pages404 from "@/pages/Pages404";

export const userRoutes = [
  { path: "/", element: <Home /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/about/history", element: <AboutHistory /> },
  { path: "/about/team", element: <AboutTeam /> },
  { path: "/about/user", element: <AboutUser /> },
];

export const authRoutes = [
  { path: "/auth/login", element: <Login /> },
  { path: "/auth/register", element: <Register /> },
  // { path: "/pages-404", element: <Pages404 /> },
];
