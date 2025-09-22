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

export default function LanguageDropdown() {
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
      <DropdownMenuTrigger className="px-3 py-2 border-none outline-none rounded-md  ">
        <GrLanguage className="cursor-pointer text-xl hover:scale-110 transition-all duration-200 " />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.keys(languages).map((key) => {
          const lang = languages[key]; // lang الآن الكائن الصحيح
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center justify-between `}
            >
              <span>{lang.label}</span>
              {selectedLang === lang.code ? "✓" : ""}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
