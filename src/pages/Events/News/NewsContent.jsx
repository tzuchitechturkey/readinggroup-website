import React from "react";

import NewsHeroEnhanced from "@/components/ForPages/News/NewsHeroEnhanced";
import ConnectNewsSection from "@/components/ForPages/Connect/EventstNewsSection/EventstNewsSection";

function NewsContent() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Start Hero */}
      <NewsHeroEnhanced />
      {/* End Hero */}
      {/* Start Recommended News */}
      <ConnectNewsSection />
      {/* End Recommended News */}
    </div>
  );
}

export default NewsContent;
