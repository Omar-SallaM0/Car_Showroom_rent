"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CarProps, CarStatus, ManagedCar } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import CarCard from "@/components/CarCard";

const statuses: CarStatus[] = ["available", "rented", "maintenance"];
const PAGE_SIZE = 12;

function AdminDashboardContent() {
  const { t, isAr } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [cars, setCars] = useState<ManagedCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [counts, setCounts] = useState({
    total: 0,
    available: 0,
    rented: 0,
    maintenance: 0,
  });

  // Notice query parameter check (e.g. redirected from Add or Edit)
  useEffect(() => {
    const urlNotice = searchParams.get("notice");
    if (urlNotice) {
      setNotice(urlNotice);
      router.replace("/admin");
    }
  }, [searchParams, router]);

  // Debounce search input to avoid hitting API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1); // Reset to page 1 on new search
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch paginated, searched, and sorted vehicles from the backend
  const fetchCarsFromServer = () => {
    let active = true;
    setLoading(true);
    setError("");

    const query = new URLSearchParams();
    query.set("page", String(page));
    query.set("pageSize", String(PAGE_SIZE));

    if (debouncedSearch) {
      query.set("search", debouncedSearch);
    }
    if (statusFilter && statusFilter !== "all") {
      query.set("status", statusFilter);
    }
    if (sortBy) {
      query.set("sortBy", sortBy);
      query.set("sortOrder", sortOrder);
    }

    fetch(`/api/admin/cars?${query.toString()}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || t.adminDashboard.loadError);
        }
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        if (data.cars) {
          setCars(data.cars);
          setPagination(data.pagination);
          if (data.counts) {
            setCounts(data.counts);
          }
        } else if (Array.isArray(data)) {
          setCars(data.slice(0, PAGE_SIZE));
        }
      })
      .catch((err: Error) => {
        if (active) setError(err.message || t.adminDashboard.loadError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  };

  useEffect(() => {
    const cleanup = fetchCarsFromServer();
    return cleanup;
  }, [page, debouncedSearch, statusFilter, sortBy, sortOrder, t.adminDashboard.loadError]);

  const changeStatus = async (car: CarProps | ManagedCar, newStatus: CarStatus) => {
    setError("");
    const carId = String(car.id);
    const carName = car.name || `${car.make || ""} ${car.model || ""}`.trim() || "Vehicle";
    try {
      const response = await fetch(`/api/admin/cars/${encodeURIComponent(carId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...car, status: newStatus }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t.adminDashboard.statusError);

      setCars((current) =>
        current.map((item) => (String(item.id) === carId ? (result as ManagedCar) : item))
      );

      // Update counters locally
      setCounts((prev) => {
        const oldStatus = car.status || "available";
        return {
          ...prev,
          [oldStatus]: Math.max(0, (prev as any)[oldStatus] - 1),
          [newStatus]: ((prev as any)[newStatus] || 0) + 1,
        };
      });

      const translatedStatus = t.carDetails.values[newStatus] || newStatus;
      setNotice(t.adminDashboard.statusNotice(carName, translatedStatus));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t.adminDashboard.statusError);
    }
  };

  const deleteCar = async (car: CarProps | ManagedCar) => {
    const carId = String(car.id);
    const carName = car.name || `${car.make || ""} ${car.model || ""}`.trim() || "Vehicle";
    if (!window.confirm(t.adminDashboard.confirmDelete(carName))) return;

    setError("");
    try {
      const response = await fetch(`/api/admin/cars/${encodeURIComponent(carId)}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t.adminDashboard.deleteError);

      setNotice(t.adminDashboard.deletedNotice(carName));
      // Re-fetch from server to accurately populate current page and total count
      fetchCarsFromServer();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t.adminDashboard.deleteError);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      window.location.assign("/admin/login");
    }
  };

  const fromCount = pagination.totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const toCount = Math.min(page * PAGE_SIZE, pagination.totalCount);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 text-black-100 dark:text-gray-100 transition-colors pb-16">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors sticky top-0 z-30 shadow-xs">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-10 gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
              {t.adminDashboard.brand}
            </p>
            <h1 className="text-xl font-extrabold dark:text-white">
              {t.adminDashboard.dashboardTitle}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link
              href="/"
              target="_blank"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-blue transition"
            >
              {t.adminDashboard.viewSite}
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded border border-gray-300 dark:border-slate-700 px-3 py-1.5 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 dark:text-gray-200 transition"
            >
              {t.adminDashboard.logout}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-10">
        {/* Intro & Add Action */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {t.adminDashboard.dashboardTitle}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t.adminDashboard.manageDesc}
            </p>
          </div>
          <Link
            href="/admin/vehicles/add"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 shadow-md transition active:scale-98"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {t.adminDashboard.addCar}
          </Link>
        </div>

        {/* Inventory Statistics */}
        <section aria-label="Inventory statistics" className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            [t.adminDashboard.stats.totalCars, counts.total, "text-gray-900 dark:text-white"],
            [t.adminDashboard.stats.available, counts.available, "text-emerald-600 dark:text-emerald-400"],
            [t.adminDashboard.stats.rented, counts.rented, "text-amber-600 dark:text-amber-400"],
            [t.adminDashboard.stats.maintenance, counts.maintenance, "text-rose-600 dark:text-rose-400"],
          ].map(([label, value, textColor]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {label}
              </p>
              <p className={`mt-1.5 text-3xl font-black ${textColor}`}>
                {Number(value).toLocaleString()}
              </p>
            </div>
          ))}
        </section>

        {/* Global Notifications */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-center justify-between rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-800 dark:text-red-300"
          >
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} className="font-bold ml-2">
              ×
            </button>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-6 flex items-center justify-between rounded-xl border border-green-200 dark:border-green-900/60 bg-green-50 dark:bg-green-950/30 px-4 py-3 text-sm text-green-800 dark:text-green-300 shadow-xs"
          >
            <div className="flex items-center gap-2 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-green-600 dark:text-green-400"
              >
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>{notice}</span>
            </div>
            <button type="button" onClick={() => setNotice("")} className="font-bold ml-2">
              ×
            </button>
          </div>
        )}

        {/* Server-Side Controls Bar: Search, Status Filter, Sorting */}
        <section className="mb-6 rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs transition-colors">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input (Server-Side) */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 ltr:left-3 rtl:right-3 flex items-center text-gray-400 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.adminDashboard.searchPlaceholder}
                aria-label={t.adminDashboard.searchAria}
                className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50/60 dark:bg-slate-800/80 ltr:pl-9 rtl:pr-9 pr-8 py-2.5 text-xs sm:text-sm font-medium focus:border-primary-blue focus:bg-white dark:focus:bg-slate-800 outline-none dark:text-white transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 ltr:right-3 rtl:left-3 flex items-center text-gray-400 hover:text-gray-600 font-bold"
                >
                  ×
                </button>
              )}
            </div>

            {/* Filter & Sorting Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter (Server-Side) */}
              <div className="flex items-center gap-1.5">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1); // Reset page on filter change
                  }}
                  aria-label={t.adminDashboard.filterAria}
                  className="rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 focus:border-primary-blue outline-none transition"
                >
                  <option value="all">{t.adminDashboard.allStatuses}</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {t.carDetails.values[status] || status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sorting Controls (Server-Side) */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 hidden sm:inline">
                  {t.adminDashboard.sortByLabel}
                </span>
                <select
                  value={`${sortBy}:${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split(":");
                    setSortBy(newSortBy || "");
                    setSortOrder((newSortOrder as "asc" | "desc") || "asc");
                    setPage(1); // Reset page on sort change
                  }}
                  aria-label={t.adminDashboard.sortByLabel}
                  className="rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 focus:border-primary-blue outline-none transition"
                >
                  <option value=":">{t.adminDashboard.sortOptions.default}</option>
                  <option value="price:asc">{t.adminDashboard.sortOptions.priceAsc}</option>
                  <option value="price:desc">{t.adminDashboard.sortOptions.priceDesc}</option>
                  <option value="year:desc">{t.adminDashboard.sortOptions.yearDesc}</option>
                  <option value="year:asc">{t.adminDashboard.sortOptions.yearAsc}</option>
                  <option value="mileage:asc">{t.adminDashboard.sortOptions.mileageAsc}</option>
                  <option value="brand:asc">{t.adminDashboard.sortOptions.brandAsc}</option>
                  <option value="brand:desc">{t.adminDashboard.sortOptions.brandDesc}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
            <span>
              {t.adminDashboard.showingResults(fromCount, toCount, pagination.totalCount)}
            </span>
            {loading && (
              <span className="flex items-center gap-1 text-primary-blue font-semibold">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-primary-blue border-t-transparent animate-spin" />
                {t.adminDashboard.loading}
              </span>
            )}
          </div>
        </section>

        {/* Vehicles Display — SAME Vehicle Card Structure as Home Page */}
        <section aria-label="Vehicles inventory grid">
          {loading && cars.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t.adminDashboard.loading}
              </p>
            </div>
          ) : cars.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center shadow-xs">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {t.adminDashboard.noCars}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  isAdmin={true}
                  onChangeStatus={changeStatus}
                  onDelete={deleteCar}
                />
              ))}
            </div>
          )}
        </section>

        {/* Server-Side Pagination Controls */}
        {pagination.totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs"
          >
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              {t.adminDashboard.pageOf(page, pagination.totalPages)}
            </p>

            <div className="flex items-center gap-1.5">
              {/* Previous Page Button */}
              <button
                type="button"
                disabled={!pagination.hasPrevPage || loading}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span className={`text-sm ${isAr ? "rotate-180" : ""}`}>←</span>
                <span>{t.adminDashboard.prev}</span>
              </button>

              {/* Page Number Chips */}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    // Show current page, edges, and immediate neighbors
                    return (
                      p === 1 ||
                      p === pagination.totalPages ||
                      Math.abs(p - page) <= 1
                    );
                  })
                  .map((p, idx, arr) => {
                    const prevP = arr[idx - 1];
                    const showEllipsis = prevP && p - prevP > 1;

                    return (
                      <span key={p} className="flex items-center">
                        {showEllipsis && (
                          <span className="px-1 text-xs text-gray-400">…</span>
                        )}
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                            p === page
                              ? "bg-primary-blue text-white shadow-xs"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    );
                  })}
              </div>

              {/* Next Page Button */}
              <button
                type="button"
                disabled={!pagination.hasNextPage || loading}
                onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span>{t.adminDashboard.next}</span>
                <span className={`text-sm ${isAr ? "rotate-180" : ""}`}>→</span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </main>
  );
}

export function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary-blue border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}

export default AdminDashboard;