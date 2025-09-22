import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import NonAuthLayout from "@/components/ForPages/Auth/NonAuthLayout/NonAuthLayout";
import Navbar from "@/components/Global/Navbar/Navbar";

import { userRoutes, authRoutes } from "./routes/allRoutes";

function App() {
  return (
    <div className="min-h-[100vh]">
      <Navbar />
      <Routes>
        {authRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<NonAuthLayout>{route.element}</NonAuthLayout>}
            key={idx}
            exact
          />
        ))}

        {userRoutes?.map((route, idx) => (
          <Route path={route.path} element={route.element} key={idx} exact />
        ))}
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
