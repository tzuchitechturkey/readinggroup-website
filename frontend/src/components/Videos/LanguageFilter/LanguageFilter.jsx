import React, { useState, useEffect } from "react";

import { Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { allLanguages, languages } from "@/constants/constants";
import { GetVideosByFilter } from "@/api/videos";
import { GetEvents } from "@/api/events";

const LanguageFilter = ({
  filters,
  openDropdowns,
  onToggleDropdown,
  onLanguageChange,
  fromLiveStream = false,
}) => {
  const { t } = useTranslation();
  const [languageCounts, setLanguageCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      const langs = fromLiveStream ? allLanguages : languages;
      const fetchFn = fromLiveStream ? GetEvents : GetVideosByFilter;
      
      try {
        const counts = {};
        const promises = langs.map(async (langObj) => {
          try {
            const res = await fetchFn(1, 0, { language: langObj.code });
            counts[langObj.code] = res.data?.count || 0;
          } catch (error) {
            console.error(`Failed to fetch count for ${langObj.code}`, error);
            counts[langObj.code] = 0;
          }
        });
        
        await Promise.all(promises);
        setLanguageCounts(counts);
      } catch (error) {
        console.error("Failed to fetch language counts", error);
      }
    };
    
    fetchCounts();
  }, [fromLiveStream]);

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
        <div
          className={`absolute top-full overflow-y-auto ${fromLiveStream ? "h-56" : "h-auto"} left-0 -mt-2 w-full bg-white rounded-b-[17px] z-50 p-4`}
        >
          <hr className="bg-[#FCFDFF] rounded-2xl mb-3" />
          <div className="flex flex-col gap-2.5">
            {(fromLiveStream ? allLanguages : languages).map((langObj) => {
              const isSelected = filters.language === langObj.code;
              return (
                <div
                  key={langObj.code}
                  className={`flex items-center justify-between gap-2 cursor-pointer w-full ${
                    isSelected ? "text-[#285688]" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLanguageChange(langObj.code);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                    <p className="font-normal text-base">{langObj.label}</p>
                  </div>
                  {languageCounts[langObj.code] !== undefined && (
                    <span className="text-sm text-gray-500">
                      ({languageCounts[langObj.code]})
                    </span>
                  )}
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
