import React from "react";

import { useLocation } from "react-router-dom";

import Usernavbar from "@/components/Global/Usernavbar/Usernavbar";


function Navbar() {
  const location = useLocation();
  
  // إخفاء الـ Navbar في صفحات الـ dashboard
  if (location.pathname.startsWith('/dashboard')) {
    return null;
  }
  
  return (
    <div>
      <Usernavbar />
    </div>
  );
}

export default Navbar;
