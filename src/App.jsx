import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import NonAuthLayout from "@/components/ForPages/Auth/NonAuthLayout/NonAuthLayout";
import Navbar from "@/components/Global/Navbar/Navbar";

import { userRoutes, authRoutes } from "./routes/allRoutes";
import Footer from "./components/Global/Footer/Footer";

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  return (
    <div className="min-h-[100vh]">
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
      <ToastContainer />
    </div>
  );
}

export default App;
