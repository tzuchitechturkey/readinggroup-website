import { useEffect, useState, useCallback } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    const shouldShow = window.pageYOffset > 300;
    setVisible(shouldShow);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToTop();
    }
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      title="Scroll to top"
      onClick={scrollToTop}
      onKeyDown={onKeyDown}
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 p-2 shadow-lg transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      <i className="fa fa-chevron-up text-gray-800  " aria-hidden="true" />
    </button>
  );
}
