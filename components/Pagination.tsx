"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

interface PaginationProps {
  page: number;
  totalPages: number;
}

const Pagination = ({ page, totalPages }: PaginationProps) => {
  const router = useRouter();
  const { t } = useLanguage();

  if (totalPages <= 1) {
    return null;
  }

  const navigateToPage = (nextPage: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", String(nextPage));
    router.push(`${window.location.pathname}?${searchParams.toString()}`);
  };

  return (
    <nav aria-label={t.pagination.ariaLabel} className="w-full flex-center gap-5 mt-10">
      <button
        type="button"
        onClick={() => navigateToPage(page - 1)}
        disabled={page <= 1}
        className="rounded-full bg-primary-blue px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t.pagination.prev}
      </button>
      <span aria-live="polite" className="text-sm font-medium text-gray-700">
        {t.pagination.pageOf(page, totalPages)}
      </span>
      <button
        type="button"
        onClick={() => navigateToPage(page + 1)}
        disabled={page >= totalPages}
        className="rounded-full bg-primary-blue px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t.pagination.next}
      </button>
    </nav>
  );
};

export default Pagination;