import React from "react";

import { SearchInput } from "../SearchInput/SearchInput";
import AdminIcons from "../AdminIcons/AdminIcons";

function AdminNavbar() {
  return (
    // Use a two-column layout where the left column sizes to content so the
    <div className="grid grid-cols-[auto_1fr] items-center shadow-md p-4 px-16 bg-bg relative">
      {/* Start Search  */}
      <div className="flex items-center justify-start">
        <div className="relative -ml-6 z-20">{/* <SearchInput /> */}</div>
      </div>
      {/* End Search  */}
      {/* Start User Icons */}
      <div className="flex justify-end">
        <div className="flex items-center gap-4">
          <AdminIcons />
        </div>
      </div>
      {/* End User Icons */}
    </div>
  );
}

export default AdminNavbar;
