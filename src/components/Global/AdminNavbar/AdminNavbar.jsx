import React from "react";

import { SearchInput } from "../SearchInput/SearchInput";

function AdminNavbar() {
  return (
    <div className="grid grid-cols-[35%_65%] items-center shadow-md p-4">
      {/* Start Search  */}
      <SearchInput />
      {/* End Search  */}
      {/* Start User Icons */}
      <AdminIcons />
      {/* End User Icons */}
    </div>
  );
}

export default AdminNavbar;
