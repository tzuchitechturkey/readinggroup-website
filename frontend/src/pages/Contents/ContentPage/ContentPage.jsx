import React from "react";

import ConnectNewsSection from "@/components/ForPages/Events/EventstNewsSection/EventstNewsSection";
import ContentHeroEnhanced from "@/components/ForPages/Events/EventHeroEnhanced/EventHeroEnhanced";

function ContentPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Start Hero */}
      <ContentHeroEnhanced />
      {/* End Hero */}
      {/* Start Recommended News */}
      <ConnectNewsSection />
      {/* End Recommended News */}
    </div>
  );
}

export default ContentPage;
