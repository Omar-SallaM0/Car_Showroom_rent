"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export const CatalogueHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="home__text-container">
      <h1 className="text-4xl font-extrabold dark:text-white transition-colors">{t.catalogue.title}</h1>
      <p className="text-gray-600 dark:text-gray-400 transition-colors">{t.catalogue.subtitle}</p>
    </div>
  );
};

export const EmptyState: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="home__error-container">
      <h2 className="text-black-100 dark:text-white text-xl font-bold transition-colors">{t.catalogue.noCarsTitle}</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">{t.catalogue.noCarsSubtitle}</p>
    </div>
  );
};

export default CatalogueHeader;
