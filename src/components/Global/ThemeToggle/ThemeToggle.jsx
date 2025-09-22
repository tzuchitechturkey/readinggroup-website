import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-12 h-7 flex items-center rounded-full border border-gray-300 bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none"
      aria-label="Toggle theme"
    >
      <span
        className={`absolute left-1 top-[2px] w-5 h-5 flex items-center justify-center rounded-full transition-transform duration-300 bg-white shadow-md text-lg
          ${
            theme === "dark"
              ? "translate-x-4 bg-gray-800 text-yellow-400"
              : "translate-x-0 bg-white text-yellow-500"
          }`}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
      <span className="w-full h-full opacity-0">
        {theme === "dark" ? "Dark" : "Light"}
      </span>
    </button>
  );
}
