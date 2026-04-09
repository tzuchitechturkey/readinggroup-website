import React from "react";

import { Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { allLanguages, languages } from "@/constants/constants";

const LanguageFilter = ({
  filters,
  openDropdowns,
  onToggleDropdown,
  onLanguageChange,
  fromLiveStream = false,
}) => {
  const { t } = useTranslation();

  const selectedLangObj = fromLiveStream
    ? allLanguages.find((l) => l.code === filters.language)
    : languages.find((l) => l.code === filters.language);
  return (
    <div
      onClick={() => onToggleDropdown("language")}
      className={`min-w-[160px] ${fromLiveStream ? "min-h-[57px]" : " min-h-[43px]"} relative flex items-center justify-between cursor-pointer px-4 ${
        openDropdowns.language ? "rounded-t-[17px]" : "rounded-[17px]"
      } bg-white transition-colors`}
    >
      <div className="flex-1 flex items-center gap-2">
        <p className="text-lg font-bold text-[#081945] leading-tight">
          {t("Language")}
        </p>
        <p className="text-base font-normal text-[#081945]/80 leading-tight">
          {selectedLangObj?.label}
        </p>
      </div>
      <ChevronDown className="font-bold" />

      {openDropdowns?.language && (
        <div className="absolute top-full overflow-y-scroll h-56 left-0 -mt-2 w-full bg-white rounded-b-[17px] z-50 p-4">
          <hr className="bg-[#FCFDFF] rounded-2xl mb-3" />
          <div className="flex flex-col gap-2.5">
            {(fromLiveStream ? allLanguages : languages).map((langObj) => {
              const isSelected = filters.language === langObj.code;
              return (
                <div
                  key={langObj.code}
                  className={`flex items-center gap-2 cursor-pointer ${
                    isSelected ? "text-[#285688]" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLanguageChange(langObj.code);
                  }}
                >
                  <div className="w-6 h-6">{isSelected && <Check />}</div>
                  <p className="font-normal text-base">{langObj.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageFilter;
