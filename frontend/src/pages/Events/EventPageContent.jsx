import React from "react";

import EventHeroEnhanced from "@/components/ForPages/Events/EventHeroEnhanced/EventHeroEnhanced";
import ConnectNewsSection from "@/components/ForPages/Events/EventstNewsSection/EventstNewsSection";

function EventPageContent() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Start Hero */}
      <EventHeroEnhanced />
      {/* End Hero */}
      {/* Start Recommended News */}
      <ConnectNewsSection />
      {/* End Recommended News */}
    </div>
  );
}

export default EventPageContent;
