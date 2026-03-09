import React from "react";

import { useTranslation } from "react-i18next";

const LearnSidebar = ({ categories, activeCategory, onCategoryClick }) => {
  const { t, i18n } = useTranslation();

  return (
    <aside className="h-full bg-[#d7eaff]">
      <div
        className={`pt-[39px] pb-10 ${i18n.language === "ar" ? "pr-[120px]" : "pl-[120px]"} pr-6`}
      >
        <div className="flex flex-col items-start justify-end mb-[38px]">
          <h1 className="text-[40px] font-black text-[#081945] leading-[1.2]">
            {t("Learn")}
          </h1>
        </div>

        <nav className="space-y-[16px]">
          {Object.entries(categories).map(([section, items]) => (
            <div key={section} className="flex flex-col gap-[4px]">
              <h2 className="text-[18px] font-bold text-[#285688] uppercase tracking-normal h-[40px] flex items-center">
                {t(section)}
              </h2>
              <ul className="space-y-[4px]">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => onCategoryClick(item)}
                      className={`w-[168px] text-left px-[12px] py-[12px] rounded-[4px] transition-all text-[16px] leading-[1.5] ${
                        activeCategory?.id === item.id
                          ? "bg-[#285688] text-white "
                          : "text-[#081945] hover:bg-[#285688]/10"
                      }`}
                    >
                      {t(item?.name)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default LearnSidebar;
