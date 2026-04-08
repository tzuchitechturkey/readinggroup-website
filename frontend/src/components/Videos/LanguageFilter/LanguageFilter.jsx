import React from "react";

import { Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import languages from "@/i18n/languages";

const LanguageFilter = ({
  filters,
  openDropdowns,
  onToggleDropdown,
  onLanguageChange,
}) => {
  const { t } = useTranslation();

  const langEntries = Object.values(languages);
  const selectedLangObj = langEntries.find((l) => l.code === filters.language);

  return (
    <div
      onClick={() => onToggleDropdown("language")}
      className={`min-w-[160px] min-h-[43px] relative flex items-center justify-between cursor-pointer px-4 ${
        openDropdowns.language ? "rounded-t-[17px]" : "rounded-[17px]"
      } bg-white transition-colors`}
    >
      <div className="flex-1 flex items-center gap-2">
        <p className="text-lg font-bold text-[#081945] leading-tight">
          {t("Language")}
        </p>
        <p className="text-base font-normal text-[#285688] leading-tight">
          {selectedLangObj?.label}
        </p>
      </div>
      <ChevronDown className="text-[#081945] font-bold" />

      {openDropdowns?.language && (
        <div className="absolute top-full left-0 -mt-2 w-full bg-white rounded-b-[17px] z-50 p-4">
          <hr className="bg-[#FCFDFF] rounded-2xl mb-3" />
          <div className="flex flex-col gap-2.5">
            {Object.keys(languages).map((lang) => (
              <div
                key={lang}
                className={`flex items-center gap-2 cursor-pointer ${
                  filters.language === languages[lang].code
                    ? "text-[#285688]"
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onLanguageChange(languages[lang].code);
                }}
              >
                <div className="w-6 h-6">
                  {filters.language === languages[lang].code && <Check />}
                </div>
                <p className="font-normal text-base">{languages[lang].label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageFilter;
