"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Locale, TranslationDictionary, translations } from "@/translations";

interface LanguageContextType {
  locale: Locale;
  direction: "rtl" | "ltr";
  isAr: boolean;
  t: TranslationDictionary;
  setLocale: (locale: Locale) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "showroom_locale";
const COOKIE_NAME = "showroom_locale";

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  initialLocale?: Locale;
}> = ({ children, initialLocale = "ar" }) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Sync client-side state on mount with localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved === "ar" || saved === "en") {
        if (saved !== locale) {
          setLocaleState(saved);
        }
        document.documentElement.lang = saved;
        document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
      } else {
        localStorage.setItem(STORAGE_KEY, initialLocale);
        setCookie(COOKIE_NAME, initialLocale);
        document.documentElement.lang = initialLocale;
        document.documentElement.dir = initialLocale === "ar" ? "rtl" : "ltr";
      }
    } catch {
      // Ignore localStorage errors (e.g. private browsing)
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
      setCookie(COOKIE_NAME, newLocale);
      if (typeof document !== "undefined") {
        document.documentElement.lang = newLocale;
        document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
      }
    } catch {
      // Fallback
    }
  };

  const toggleLanguage = () => {
    setLocale(locale === "ar" ? "en" : "ar");
  };

  const direction: "rtl" | "ltr" = locale === "ar" ? "rtl" : "ltr";
  const isAr = locale === "ar";
  const t = translations[locale];

  return (
    <LanguageContext.Provider
      value={{
        locale,
        direction,
        isAr,
        t,
        setLocale,
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
