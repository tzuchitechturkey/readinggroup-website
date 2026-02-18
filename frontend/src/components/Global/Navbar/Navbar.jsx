import React from "react";

import Usernavbar from "@/components/Global/Usernavbar/Usernavbar";

function Navbar() {
  return (
    <header className="sticky top-0 z-[60] w-full bg-[var(--color-primary)]  ">
      <Usernavbar />
    </header>
  );
}

export default Navbar;
