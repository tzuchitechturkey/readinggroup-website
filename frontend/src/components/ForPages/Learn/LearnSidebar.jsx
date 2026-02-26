import React from "react";
import { useTranslation } from "react-i18next";

const LearnSidebar = ({ categories, activeCategory, onCategoryClick }) => {
  const { t } = useTranslation();

  return (
    <aside className="h-full bg-transparent">
      <div className="py-10 px-6">
        <h1 className="text-3xl font-bold mb-10 text-gray-900 leading-none">
          {t("Learn")}
        </h1>

        <nav className="space-y-10">
          {Object.entries(categories).map(([section, items]) => (
            <div key={section} className="space-y-4">
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
                {t(section)}
              </h2>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => onCategoryClick(item)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                        activeCategory === item
                          ? "bg-gray-300 text-gray-900 font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {t(item)}
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
