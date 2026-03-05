import { useEffect, useState } from "react";

import { Globe, Check } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const currentLanguage = localStorage.getItem("I18N_LANGUAGE") || "en";
    setSelectedLang(currentLanguage);
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("I18N_LANGUAGE", lang);
    setSelectedLang(lang);
    setIsOpen(false);
  };

  const selectedLabel = languages[selectedLang]?.label || "English";

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="outline-none mx-2 border-none ring-0 focus:ring-0">
        <div
          className="flex items-center gap-[8px] bg-[#fcfdff] cursor-pointer transition-all duration-200 rounded-[38px] px-[12px] py-[8px]"
          style={{
            boxShadow: isOpen ? "0px 4px 12px rgba(0, 0, 0, 0.05)" : "none",
          }}
        >
          <div className="w-[24px] h-[24px] flex items-center justify-center text-[#285688]">
            <Globe size={24} strokeWidth={1} />
          </div>
          <span className="text-[#285688] text-[18px] font-normal leading-[1.5] font-['Noto_Sans']">
            {selectedLabel}
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-[200px] bg-[#fcfdff] rounded-[16px] p-[8px] flex flex-col gap-[8px] shadow-lg border-none mt-2"
        align="end"
      >
        {Object.keys(languages).map((key) => {
          const lang = languages[key];
          const isSelected = selectedLang === lang.code;

          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="flex items-center gap-[8px] p-[8px] rounded-lg cursor-pointer outline-none focus:bg-[#f3f4f6]"
            >
              <div className="w-[24px] h-[24px] flex-shrink-0 flex items-center justify-center text-[#285688]">
                {isSelected && <Check size={24} strokeWidth={1.5} />}
              </div>
              <span
                className={`text-[16px] font-normal leading-[1.5] font-['Noto_Sans'] ${
                  isSelected ? "text-[#285688]" : "text-[#081945]"
                }`}
              >
                {lang.label}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
