import { useEffect, useState } from "react";

import { GrLanguage } from "react-icons/gr";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import i18n from "@/i18n/i18n";
import languages from "@/i18n/languages";

export default function LanguageDropdown({ iconColor }) {
  const [selectedLang, setSelectedLang] = useState("");

  useEffect(() => {
    const currentLanguage = localStorage.getItem("I18N_LANGUAGE") || "en";
    setSelectedLang(currentLanguage);
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("I18N_LANGUAGE", lang);
    setSelectedLang(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-2 py-2 border-none outline-none rounded-md  ">
        <GrLanguage
          className="cursor-pointer text-xl hover:scale-110 transition-all duration-200 "
          style={{ color: iconColor || undefined }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[160px] rounded-xl shadow-lg border border-gray-100 bg-white/95 py-2 px-1">
        {Object.keys(languages).map((key) => {
          const lang = languages[key];
          const isSelected = selectedLang === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center gap-2 justify-between px-4 py-2 rounded-lg text-[16px] font-medium cursor-pointer transition-colors duration-150
                hover:bg-[var(--color-primary)] focus:bg-[var(--color-primary)]
                ${
                  isSelected
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-gray-800"
                }
              `}
            >
              <span className="flex-1">{lang.label}</span>
              {isSelected && (
                <span className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-white bg-white/80">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="#4680FF"
                      strokeWidth="2"
                      fill="white"
                    />
                    <circle cx="8" cy="8" r="3" fill="#4680FF" />
                  </svg>
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
