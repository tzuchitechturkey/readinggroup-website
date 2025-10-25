import React from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import NotFoundImg from "@/assets/icons/img/404.png";

function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-start justify-start w-full">
      <div
        className="flex-1 w-full flex flex-row items-center justify-between px-8 md:px-20 lg:px-32 xl:px-48 py-8"
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        {/* Left: Texts */}
        <div
          className="flex-1 flex flex-col items-start justify-center text-left pl-0 md:pl-0 mt-[-40px]"
          style={{ alignItems: "flex-start", maxWidth: 460 }}
        >
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-4"
            style={{ letterSpacing: "-1px" }}
          >
            {t("Ooops...")}
          </h1>
          <h2 className="text-3xl md:text-4xl font-normal text-black mb-4">
            {t("Page Not Found")}
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
            {t("Sorry, the content you're looking for doesn't exist.")}
            <br />
            {t("Either it was removed, or you mistyped the link.")}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="text-white font-semibold px-10 py-3 rounded-lg shadow-md border transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 hover:scale-105 hover:shadow-lg"
            style={{
              minWidth: 170,
              background: "#0b63d6",
              borderColor: "#0b63d6",
            }}
          >
            {t("Go Back")}
          </button>
        </div>
        {/* Center: Image */}
        <div
          className="flex-1 flex justify-center items-start py-0 md:py-0"
          style={{ minHeight: 700, maxWidth: 600 }}
        >
          <img
            src={NotFoundImg}
            alt="404 Not Found"
            className="w-96 h-96 md:w-[28rem] md:h-[28rem] object-contain"
            style={{ maxWidth: 448 }}
          />
        </div>
        {/* Right: Large 404 */}
        <div
          className="hidden md:flex flex-col items-center justify-center flex-1 h-full"
          style={{ minHeight: 500, maxWidth: 100 }}
        >
          <div
            className="text-[10rem] lg:text-[14rem] font-extrabold text-white/60 select-none tracking-tight leading-none"
            style={{
              WebkitTextStroke: "3px #0b63d6",
              color: "transparent",
              lineHeight: 1,
            }}
          >
            <span style={{ display: "block", lineHeight: 1 }}>4</span>
            <span style={{ display: "block", lineHeight: 1 }}>0</span>
            <span style={{ display: "block", lineHeight: 1 }}>4</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
