"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export const ViewAllCarsButton: React.FC = () => {
  const { isAr } = useLanguage();

  return (
    <div className="flex justify-center mt-10 mb-4">
      <Link
        href="/cars"
        className="px-8 py-3.5 rounded-full bg-primary-blue hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 group"
      >
        <span>{isAr ? "استكشف جميع السيارات المتاحة" : "Explore All Available Cars"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
};

export default ViewAllCarsButton;
