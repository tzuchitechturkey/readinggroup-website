import React from "react";

import { Link } from "react-router-dom";

function HomeContent() {
  return (
    <div>
      <button className="border-2 border-blue-500 p-2 rounded m-10">
        <Link to="/dashboard">Go to Login dashboard</Link>
      </button>
    </div>
  );
}

export default HomeContent;
