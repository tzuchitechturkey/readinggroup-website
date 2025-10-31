import { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";

import LoginForm from "@/components/ForPages/Auth/Login/LoginForm";
import Footer from "@/components/Global/Footer/Footer";
import authback from "@/assets/authback.jpg";
import { isUserAuthenticated } from "@/api/isAuth";

function LoginContent() {
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
      className="w-full flex flex-col items-center justify-center pt-10 relative border-0 outline-none min-h-screen"
      style={{
        backgroundImage: `url(${authback})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-cover bg-center w-full h-full opacity-60 z-0 bg-black" />
      <div className="relative z-1 mt-10 flex justify-center items-center">
        <LoginForm />
      </div>
      <div className="flex items-end h-20 z-10 mt-6 flex-1 w-full">
        <Footer authPages={true} />
      </div>
    </div>
  );
}




export default LoginContent;