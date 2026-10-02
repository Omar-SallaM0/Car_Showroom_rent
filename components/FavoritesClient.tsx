"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CarProps } from "@/types";
import { useFavorites } from "@/context/FavoritesContext";
import { useLanguage } from "@/context/LanguageContext";
import { getStoredCars, getCarId } from "@/utils/car-storage";
import CarCard from "./CarCard";

export const FavoritesClient: React.FC = () => {
  const { favorites, isLoaded } = useFavorites();
  const { t } = useLanguage();
  const [cars, setCars] = useState<CarProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCars() {
      // 1. Immediate local cache retrieval
      const localCars = getStoredCars();

      // 2. Fetch from public API
      try {
        const response = await fetch("/api/cars");
        if (response.ok) {
          const apiCars: CarProps[] = await response.json();
          if (isMounted) {
            // Combine API cars and local storage cars, removing duplicates by ID
            const combinedMap = new Map<string, CarProps>();
            [...localCars, ...apiCars].forEach((c) => {
              const id = getCarId(c);
              if (!combinedMap.has(id)) {
                combinedMap.set(id, c);
              }
            });
            setCars(Array.from(combinedMap.values()));
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load cars from API, using local cars", err);
      }

      if (isMounted) {
        setCars(localCars);
        setIsLoading(false);
      }
    }

    loadCars();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter cars that are in favorites
  const favSet = new Set(favorites.map((f) => String(f).toLowerCase()));
  const favoriteCars = cars.filter((car) => {
    const id1 = String(car.id || "").toLowerCase();
    const id2 = getCarId(car).toLowerCase();
    return (id1 && favSet.has(id1)) || (id2 && favSet.has(id2));
  });

  // Breadcrumb
  const breadcrumb = (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
      <Link href="/" className="hover:text-primary-blue transition-colors">
        {t.carsPage.breadcrumbHome}
      </Link>
      <span>/</span>
      <span className="text-gray-800 dark:text-gray-200 font-medium">
        {t.favoritesPage.title}
      </span>
    </nav>
  );

  if (!isLoaded || isLoading) {
    return (
      <div className="padding-x py-8 max-width">
        {breadcrumb}
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
          <div className="w-10 h-10 border-4 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium">Loading favorites...</p>
        </div>
      </div>
    );
  }

  if (favoriteCars.length === 0) {
    return (
      <div className="padding-x py-8 max-width">
        {breadcrumb}
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50/70 dark:bg-slate-900/50 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 my-4 max-w-2xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 flex items-center justify-center mb-5 shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-black-100 dark:text-white mb-2">
            {t.favoritesPage.emptyTitle}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md leading-relaxed mb-8">
            {t.favoritesPage.emptySubtitle}
          </p>

          <Link
            href="/cars"
            className="px-6 py-3 rounded-full bg-primary-blue hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md inline-flex items-center gap-2"
          >
            {t.favoritesPage.browseCars}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 rtl:rotate-180">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="padding-x py-8 max-width">
      {breadcrumb}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-gray-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-black-100 dark:text-white transition-colors">
              {t.favoritesPage.title}
            </h1>
            <span className="shrink-0 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400 text-xs font-bold border border-red-200/50 dark:border-red-900/50">
              {t.favoritesPage.countBadge(favoriteCars.length)}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1 max-w-2xl text-sm sm:text-base transition-colors">
            {t.favoritesPage.subtitle}
          </p>
        </div>

        <Link
          href="/cars"
          className="text-sm font-semibold text-primary-blue hover:underline inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          {t.favoritesPage.browseCars}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 rtl:rotate-180">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Cars Grid */}
      <section className="mt-8">
        <div className="home__cars-wrapper">
          {favoriteCars.map((car, index) => (
            <CarCard
              key={`${getCarId(car, index)}-${index}`}
              car={car}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default FavoritesClient;
