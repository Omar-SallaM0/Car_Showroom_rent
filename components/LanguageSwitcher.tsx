"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { setLocale, isAr } = useLanguage();

  return (
    <div
      role="radiogroup"
      aria-label="Language selection"
      dir="ltr"
      className={`relative inline-flex items-center p-1 rounded-full bg-white/90 dark:bg-slate-800/90 border border-gray-200/90 dark:border-slate-700/80 shadow-sm backdrop-blur-md transition-all select-none ${className}`}
    >
      {/* Sliding Active Pill Indicator */}
      <span
        aria-hidden="true"
        className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-primary-blue shadow-md transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none ${
          isAr ? "translate-x-0" : "translate-x-full"
        }`}
      />

      {/* Option: عربي */}
      <button
        type="button"
        role="radio"
        aria-checked={isAr}
        onClick={() => setLocale("ar")}
        className={`relative z-10 min-w-[56px] px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-full transition-colors duration-200 flex items-center justify-center leading-none focus:outline-none ${
          isAr ? "text-white" : "text-gray-600 hover:text-black-100 dark:text-gray-400 dark:hover:text-white"
        }`}
      >
        عربي
      </button>

      {/* Option: EN */}
      <button
        type="button"
        role="radio"
        aria-checked={!isAr}
        onClick={() => setLocale("en")}
        className={`relative z-10 min-w-[56px] px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-full transition-colors duration-200 flex items-center justify-center leading-none focus:outline-none ${
          !isAr ? "text-white" : "text-gray-600 hover:text-black-100 dark:text-gray-400 dark:hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
