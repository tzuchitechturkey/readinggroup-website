import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function HeadingBlock({ title, description, ctaLabel, to = "#" }) {
  const { t } = useTranslation();
  const label = ctaLabel ?? t("See more");

  return (
    <div>
      <h3 className="text-[40px] md:text-[56px] leading-[1.02] font-serif font-bold mb-4 md:mb-6">
        {title}
      </h3>
      {description ? (
        <p className="text-base md:text-lg mb-6 md:mb-8 max-w-xl text-slate-700">
          {description}
        </p>
      ) : null}
      <Link
        to={to}
        className="inline-flex items-center bg-[#0b63d6] hover:bg-[#0956b8] text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg shadow-md text-sm md:text-base font-semibold transition"
        aria-label={label}
      >
        {label}
      </Link>
    </div>
  );
}

export default HeadingBlock;
