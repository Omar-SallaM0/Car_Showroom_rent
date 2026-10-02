"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Dark mode (click to switch to light mode)" : "Light mode (click to switch to dark mode)"}
      className={`relative inline-flex items-center justify-center w-[38px] h-[38px] rounded-full bg-white/90 dark:bg-slate-800/90 border border-gray-200/90 dark:border-slate-700/80 shadow-sm backdrop-blur-md transition-all duration-200 focus:outline-none select-none shrink-0 hover:border-gray-300 dark:hover:border-slate-600 ${className}`}
    >
      {isDark ? (
        /* Moon icon only (Dark Mode) */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-blue-400 transition-transform duration-200 hover:scale-110"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ) : (
        /* Sun icon only (Light Mode) */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-amber-500 transition-transform duration-200 hover:scale-110"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
