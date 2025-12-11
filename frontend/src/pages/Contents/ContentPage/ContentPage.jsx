import React from "react";

import ConnectNewsSection from "@/components/ForPages/Contents/ContenttNewsSection/ContenttNewsSection";
import ContentHeroEnhanced from "@/components/ForPages/Contents/ContentHeroEnhanced/ContentHeroEnhanced";

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
