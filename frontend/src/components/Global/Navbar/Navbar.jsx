import React from "react";

import { useLocation } from "react-router-dom";

import Usernavbar from "@/components/Global/Usernavbar/Usernavbar";

function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  
  const navbarBgClass = isHome ? "bg-[var(--color-primary)]" : "bg-white shadow-md";

  return (
    <header className={`sticky top-0 z-[60] w-full ${navbarBgClass}`}>
      <Usernavbar isHome={isHome} />
    </header>
  );
}

export default Navbar;
