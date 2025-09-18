import React from "react";

import RegisterForm from "@/components/ForPages/Auth/Register/RegisterForm";
import Footer from "@/components/Global/Footer/Footer";

function RegisterContent() {
  return (
    <div
      className="w-full flex flex-col  pt-16 relative border-0 outline-none"
      style={{
        backgroundImage: "url(../../../../../public/authback.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-cover bg-center w-full h-full opacity-30 z-0 bg-black" />
      <div className=" relative z-10">
        <RegisterForm />
      </div>
      <div className="flex flex-col justify-end h-full z-10 mt-10">
        <Footer />
      </div>
    </div>
  );
}

export default RegisterContent;
