import { useEffect, useRef } from "react";

const HtmlContent = ({ html, className = "" }) => {
  const htmlRef = useRef(null);
  useEffect(() => {
    if (htmlRef.current) {
      htmlRef.current.innerHTML = html;
    }
  }, [html]);
  return <div ref={htmlRef} className={className} />;
};

export default HtmlContent;
