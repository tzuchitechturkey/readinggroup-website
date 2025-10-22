import React from "react";

import NewsList from "./News/NewsList/NewsList";

const TV = ({ onSectionChange }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NewsList onSectionChange={onSectionChange} />
    </div>
  );
};

export default TV;
