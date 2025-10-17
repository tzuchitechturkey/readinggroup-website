import { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";

import { isUserAuthenticated } from "@/api/isAuth";
import RegisterForm from "@/components/ForPages/Auth/Register/RegisterForm";
import Footer from "@/components/Global/Footer/Footer";

function RegisterContent() {
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("userType");
    if (user) {
      setUserType(user);
    }
  }, []);

  if (isUserAuthenticated()) {
    if (userType === "admin") {
      return <Navigate to="/dashboard" replace={true} />;
    }
    return <Navigate to="/" replace={true} />;
  }
  return (
    <div
      className="w-full flex flex-col pt-200 relative border-0 outline-none min-h-screen"
      style={{
        backgroundImage: "url(/authback.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-cover bg-center w-full h-full opacity-60 z-0 bg-black" />
      <div className="relative z-1 mt-32">
        <RegisterForm />
      </div>
      <div className="flex  items-end  h-full z-10 mt-20 flex-1">
        <Footer authPages={true} />
      </div>
    </div>
  );
}

export default RegisterContent;
