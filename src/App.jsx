import { Routes, Route } from "react-router-dom";

import NonAuthLayout from "@/components/ForPages/Auth/NonAuthLayout/NonAuthLayout";
import Navbar from "@/components/Global/Navbar/Navbar";

import { userRoutes, authRoutes } from "./routes/allRoutes";

function App() {
  return (
    <div className=" border" style={{ minHeight: "100vh" }}>
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
    </div>
  );
}

export default App;
