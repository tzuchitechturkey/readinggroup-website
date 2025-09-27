import React from "react";

import GuidingReadingcard from "@/components/Global/GuidingReadingcard/GuidingReadingcard";
import { readings } from "@/mock/reading";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";

const GuidedReading = () => {
  return (
    <div className="mt-12">
      <DynamicSection
        title="This Week's Guided Reading"
        data={readings}
        isSlider={true}
        cardName={GuidingReadingcard}
      />
    </div>
  );
};

export default GuidedReading;
