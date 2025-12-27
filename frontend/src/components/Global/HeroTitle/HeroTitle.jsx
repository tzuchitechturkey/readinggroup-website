import ShowHideText from "../ShowHideText/ShowHideText";

function HeroTitle({
  t,
  i18n,
  h1Line1,
  h1Line2Prefix,
  h1Line2Under,
  description,
  titleClassName = "",
}) {
  return (
    <div>
      <h1
        className={` text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.06] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] ${
          i18n?.language === "ar" ? "rtl" : "ltr"
        } max-w-3xl ${titleClassName} `}
      >
        <span className="block">{h1Line1}</span>
        <span className="block">
          {h1Line2Prefix}{" "}
          {h1Line2Under ? (
            <span className="relative inline-block underline decoration-2 decoration-[#2ea5ff] underline-offset-6">
              {h1Line2Under}
            </span>
          ) : null}
        </span>
      </h1>

      <p
        className={`mt-4 text-sm md:text-base text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] ${
          i18n?.language === "ar" ? "text-right" : "text-left"
        } max-w-2xl`}
      >
        <ShowHideText text={description} t={t} count={150} allowHtml={true} />
      </p>
    </div>
  );
}

export default HeroTitle;
