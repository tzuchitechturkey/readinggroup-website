import React from "react";

import { SearchInput } from "../SearchInput/SearchInput";
import AdminIcons from "../AdminIcons/AdminIcons";

function AdminNavbar() {
  return (
    <div className="grid grid-cols-[35%_65%] items-center shadow-md p-4 px-16 bg-bg ">
      {/* Start Search  */}
      <div className="flex items-center justify-center">
        <SearchInput />
      </div>
      {/* End Search  */}
      {/* Start User Icons */}
      <AdminIcons />
      {/* End User Icons */}
    </div>
  );
}

export default AdminNavbar;
