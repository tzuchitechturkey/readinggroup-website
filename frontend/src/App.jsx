import { Suspense, lazy } from "react";

import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { AxiosInterceptor } from "@/api/AxiosInterceptor";
import ScrollToTop from "@/components/Global/ScrollToTop/ScrollToTop";

import { userRoutes, authRoutes } from "./routes/allRoutes";

// Lazy load components
const NonAuthLayout = lazy(() => import("@/components/ForPages/Auth/NonAuthLayout/NonAuthLayout"));
const Navbar = lazy(() => import("@/components/Global/Navbar/Navbar"));
const Footer = lazy(() => import("./components/Global/Footer/Footer"));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
  </div>
);

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  return (
    <div className="min-h-[100vh]">
      <AxiosInterceptor />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {authRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<NonAuthLayout>{route.element}</NonAuthLayout>}
              key={idx}
            />
          ))}

          {userRoutes?.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <>
                  {!isDashboard && <Navbar />}
                  {route.element}
                  {!isDashboard && (
                    <div className="md:12 lg:mt-24">
                      <Footer />
                    </div>
                  )}
                </>
              }
              key={idx}
            />
          ))}
        </Routes>
      </Suspense>

      <ScrollToTop />
      <ToastContainer />
    </div>
  );
}

export default App;
