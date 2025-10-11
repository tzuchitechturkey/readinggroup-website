import React, { useState } from "react";

function ShowHideText({ text, t, count }) {
  const [showMore, setShowMore] = useState(false);
  const toggleShow = () => setShowMore((prev) => !prev);

  if (text && text.length <= count) {
    return <span className="fw-bold">{text}</span>;
  }

  if (text && text.length > count) {
    return (
      <>
        <span className="">
          {showMore ? text : text.slice(0, count) + " ......."}
        </span>
        <button
          type="button"
          className="  "
          onClick={toggleShow}
          style={{
            verticalAlign: "baseline",
            textDecoration: "none",
            fontSize: "0.875rem",
          }}
          onMouseEnter={(e) => {
            e.target.style.textDecoration = "underline";
            e.target.style.color = "var(--color-primary)";
          }}
          onMouseLeave={(e) => {
            e.target.style.textDecoration = "none";
            e.target.style.color = "var(--color-text)";
          }}
        >
          {showMore ? t("Show less") : t("SHOW MORE")}
        </button>
      </>
    );
  }

  return <span>{t("Not available")}</span>;
}

export default ShowHideText;
