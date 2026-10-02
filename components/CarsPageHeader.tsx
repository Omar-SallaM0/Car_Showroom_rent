"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export const CarsPageHeader: React.FC<{ totalCount?: number }> = ({ totalCount }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-primary-blue transition-colors">
          {t.carsPage.breadcrumbHome}
        </Link>
        <span>/</span>
        <span className="text-gray-800 dark:text-gray-200 font-medium">
          {t.carsPage.breadcrumbCars}
        </span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-4xl font-extrabold text-black-100 dark:text-white transition-colors">
            {t.carsPage.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 max-w-2xl text-base transition-colors">
            {t.carsPage.subtitle}
          </p>
        </div>

        {totalCount !== undefined && totalCount > 0 && (
          <span className="shrink-0 px-3 py-1 rounded-full bg-primary-blue/10 dark:bg-primary-blue/20 text-primary-blue text-xs font-bold w-fit">
            {totalCount} {t.navbar.cars}
          </span>
        )}
      </div>
    </div>
  );
};

export default CarsPageHeader;
