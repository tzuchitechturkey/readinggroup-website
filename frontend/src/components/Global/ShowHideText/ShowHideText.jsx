import React, { useState } from "react";

function ShowHideText({ text, t, count, allowHtml = false }) {
  const [showMore, setShowMore] = useState(false);
  const toggleShow = () => setShowMore((prev) => !prev);

  // Helper function to strip HTML tags for length calculation
  const stripHtml = (html) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  // Get text length (stripped of HTML if allowHtml is true)
  const textLength = allowHtml
    ? stripHtml(text || "").length
    : (text || "").length;
  const displayText = text || "";

  if (textLength <= count) {
    return allowHtml ? (
      <span
        className="fw-bold break-words"
        dangerouslySetInnerHTML={{ __html: displayText }}
      />
    ) : (
      <span className="fw-bold break-words">{displayText}</span>
    );
  }

  if (textLength > count) {
    const truncatedText = allowHtml
      ? text.slice(0, count) + " ......."
      : text.slice(0, count) + " .......";

    return (
      <>
        <span className="break-words">
          {allowHtml ? (
            <span
              className="break-words"
              dangerouslySetInnerHTML={{
                __html: showMore ? displayText : truncatedText,
              }}
            />
          ) : showMore ? (
            displayText
          ) : (
            truncatedText
          )}
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

  return <span className="break-words">{t("Not available")}</span>;
}

export default ShowHideText;
