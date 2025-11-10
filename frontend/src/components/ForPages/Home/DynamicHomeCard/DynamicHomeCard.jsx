import React from "react";

import { useTranslation } from "react-i18next";

import HeadingBlock from "@/components/ForPages/Home/HeadingBlock/HeadingBlock";
import Band from "@/components/ForPages/Home/Band/Band";

const DynamicHomeCard = ({
  title,
  index,
  description,
  href,
  cardName,
  item,
  propsToCard,
}) => {
  const Card = cardName;
  const { t } = useTranslation();

  const isOdd = index % 2 !== 0; // تحقق هل الفهرس فردي

  return (
    <Band tone="blue">
      <div
        className={`${
          isOdd ? "flex-row-reverse " : ""
        } lg:flex items-center justify-around `}
      >
        <div>
          <HeadingBlock
            title={title}
            description={description}
            to={href}
            ctaLabel={t("See more")}
          />
        </div>

        <div className="relative lg:flex lg:justify-end mt-5 p-0 ">
          <div className="relative  md:w-[460px]">
            {/* <div className="absolute -right-3 -top-3 w-full h-full rounded-[32px] bg-gradient-to-br from-[#eef6ff] to-[#e6f0ff] shadow-[0_40px_80px_rgba(40,80,160,0.12)]" /> */}
            <div className="relative z-10">
              <Card item={item} {...propsToCard} />
            </div>
          </div>
        </div>
      </div>
    </Band>
  );
};

export default DynamicHomeCard;
