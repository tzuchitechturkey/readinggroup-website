import React from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, ArrowLeft, Search, Book } from "lucide-react";

import { Button } from "@/components/ui/button";

function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goHome = () => {
    navigate("/");
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* Logo/Icon Section */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
            <Book className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-bold text-white/20 leading-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            {t("Page Not Found")}
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-md mx-auto leading-relaxed">
            {t(
              "Sorry, the page you are looking for doesn't exist or has been moved."
            )}
          </p>
        </div>

        {/* Start Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            onClick={goHome}
            className="bg-primary hover:bg-white text-white hover:text-primary border-[1px] border-primary px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 min-w-[160px]"
          >
            <Home className="w-5 h-5" />
            {t("Go Home")}
          </Button>

          <Button
            onClick={goBack}
            variant="outline"
            className="border-2 border-white/30 text-text hover:text-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 min-w-[160px]"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("Go Back")}
          </Button>
        </div>
        {/* End Action Buttons */}

        {/* Start Search Suggestion */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-white/60 text-sm">
            <Search className="w-4 h-4" />
            <span>
              {t("Try searching for what you need from the main page")}
            </span>
          </div>
        </div>
        {/* End Search Suggestion */}

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-20" />
      </div>
    </div>
  );
}

export default NotFound;
