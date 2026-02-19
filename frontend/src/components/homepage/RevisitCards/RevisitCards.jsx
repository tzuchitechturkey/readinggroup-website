import React from "react";

import RevisitCard from "../shared/RevisitCard";
import BigRevisitCard from "../../../assets/bigrevisitCard2.jpg";
import RevisitCard1 from "../../../assets/revisitCard1.png";
import RevisitCard2 from "../../../assets/revisitCard.jpg";
// Mock data for revisit cards
const mockCardsData = [
  {
    id: 1,
    title: "Jing Si Aphorisms",
    image: RevisitCard2,
    category: "Wisdom",
  },
  {
    id: 2,
    title: "Words of Encouragement",
    image: RevisitCard1,
    category: "Inspiration",
  },
  {
    id: 3,
    title: "Slogan",
    image: BigRevisitCard,
    category: "Messages",
  },
];

const RevisitCards = ({ t }) => {
  return (
    <div className="bg-[#1b2d58] h-auto md:h-[654px] relative">
      <div className=" flex-col  gap-[16px] sm:gap-[20px] md:gap-[24px] lg:gap-[24px] items-start w-full max-w-7xl px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-10 md:py-12 lg:py-16 mx-auto">
        {/* Section Header - White Style */}
        <div className="flex gap-[12px] sm:gap-[14px] md:gap-[16px] lg:gap-[16px] items-center w-full mb-6">
          {/* Icon Line */}
          <div className="h-[24px] sm:h-[28px] md:h-[32px] lg:h-[36px] w-0 relative shrink-0">
            <div className="absolute inset-[0_-4px]">
              <svg
                width="8"
                height="100%"
                viewBox="0 0 8 36"
                fill="none"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="8" height="36" fill="white" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <p className="font-['Noto_Sans_TC:Bold',sans-serif] font-bold leading-[1.5] text-[16px] sm:text-[18px] md:text-[22px] lg:text-[24px] text-white shrink-0">
            {t("REVISIT CARDS FROM LIVESTREAMS")}
          </p>

          <hr className="h-[1px] sm:h-[1.5px] md:h-[2px] lg:h-[2px] flex-1 bg-[#fff]" />
        </div>
        <div className="grid gap-8 grid-cols-2 lg:grid-cols-4 w-full">
          <RevisitCard card={mockCardsData[0]} size="small" t={t} />
          <RevisitCard card={mockCardsData[1]} size="small" t={t} />

          <div className="col-span-2 lg:col-span-2  ">
            <RevisitCard card={mockCardsData[2]} size="large" t={t} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevisitCards;
