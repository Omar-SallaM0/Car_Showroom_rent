"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/context/FavoritesContext";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { t } = useLanguage();
  const { favoritesCount } = useFavorites();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={`w-full z-30 transition-colors ${
        isHome
          ? "absolute top-0 left-0 right-0"
          : "sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-sm"
      }`}
    >
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4 gap-4">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex justify-center items-center">
            <Image
              src="/yusrilprayoga.svg"
              alt={t.navbar.logoAlt}
              width={118}
              height={18}
              className="object-contain dark:invert transition-all"
            />
          </Link>

          {/* Navigation link to dedicated Cars page */}
          <Link
            href="/cars"
            className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-blue dark:hover:text-primary-blue transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            {t.navbar.cars}
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Favorites Heart Icon button linking to /favorites */}
          <Link
            href="/favorites"
            aria-label={t.navbar.favorites}
            title={t.navbar.favorites}
            className="relative w-[38px] h-[38px] rounded-full border border-gray-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 shadow-sm backdrop-blur transition-all flex items-center justify-center shrink-0 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={favoritesCount > 0 ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={favoritesCount > 0 ? "0" : "2"}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-5 h-5 transition-colors ${
                favoritesCount > 0 ? "text-red-500 dark:text-red-400" : ""
              }`}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {favoritesCount > 0 && (
              <span className="absolute -top-1 ltr:-right-1 rtl:-left-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                {favoritesCount > 9 ? "9+" : favoritesCount}
              </span>
            )}
          </Link>

          <ThemeToggle />
          <LanguageSwitcher />

          {/* User/Profile icon button linking to Admin portal */}
          <Link
            href="/admin/login"
            aria-label={t.navbar.admin}
            title={t.navbar.admin}
            className="w-[38px] h-[38px] rounded-full border border-gray-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 text-gray-700 dark:text-gray-200 hover:text-primary-blue dark:hover:text-primary-blue shadow-sm backdrop-blur transition-all flex items-center justify-center shrink-0 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
