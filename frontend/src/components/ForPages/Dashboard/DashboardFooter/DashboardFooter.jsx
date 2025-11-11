import React from "react";
import { useTranslation } from "react-i18next";

function DashboardFooter() {
  const { t, i18n } = useTranslation();
  const lang = i18n?.language || 'en';
  const dir = typeof i18n?.dir === 'function' ? i18n.dir(lang) : (lang && ['ar', 'he', 'fa', 'ur'].includes(lang.split('-')[0]) ? 'rtl' : 'ltr');
  const rowDirectionClass = dir === 'rtl' ? 'flex-row-reverse' : 'flex-row';
  const textAlignClass = dir === 'rtl' ? 'text-right' : 'text-left';

  return (
    <footer
      dir={dir}
      lang={lang}
      className={`bg-white px-3 pb-2 py-4 mt-5 flex items-center justify-center ${rowDirectionClass}`}
    >
      <div className={`text-[10px] text-[#989898] flex items-center gap-4 mx-2 ${textAlignClass}`}>
        <a href="/privacy" className="hover:underline">{t('Privacy Policy')}</a>
        <a href="/terms" className="hover:underline">{t('Terms of Use')}</a>
      </div>
      <div className={`text-[10px] text-[#5B6B79] mx-2 ${textAlignClass}`}>
        © {new Date().getFullYear()} {t('• by Tzu Chi TR Design.')}
      </div>
    </footer>
  );
}
export default DashboardFooter;