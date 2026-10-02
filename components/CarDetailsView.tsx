"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CarProps } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/context/FavoritesContext";
import { generateCarImageUrl } from "@/utils";
import { getStoredCars, syncCarToLocalStorage, normalizeCarToStorage, getCarId } from "@/utils/car-storage";

interface CarDetailsViewProps {
  initialCar?: CarProps | null;
  carId: string;
}

export const CarDetailsView: React.FC<CarDetailsViewProps> = ({ initialCar, carId }) => {
  const router = useRouter();
  const { t, isAr } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [car, setCar] = useState<CarProps | null>(initialCar || null);
  const [isLoading, setIsLoading] = useState(!initialCar);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rentBooked, setRentBooked] = useState(false);

  useEffect(() => {
    if (initialCar) {
      setCar(initialCar);
      syncCarToLocalStorage(initialCar);
      setIsLoading(false);
      return;
    }

    // Try finding in local storage first
    const stored = getStoredCars();
    const targetId = carId.toLowerCase();
    const localMatch = stored.find(
      (c) => String(c.id).toLowerCase() === targetId || getCarId(c).toLowerCase() === targetId
    );

    if (localMatch) {
      setCar(localMatch);
      setIsLoading(false);
      return;
    }

    // Fetch from API
    fetch(`/api/cars?ids=${encodeURIComponent(carId)}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((cars: CarProps[]) => {
        if (cars && cars.length > 0) {
          setCar(cars[0]);
          syncCarToLocalStorage(cars[0]);
        }
      })
      .catch((err) => console.error("Error fetching car:", err))
      .finally(() => setIsLoading(false));
  }, [initialCar, carId]);

  // Reset current index when car changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [carId]);

  if (isLoading) {
    return (
      <div className="padding-x py-16 max-width flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading car details...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="padding-x py-16 max-width">
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gray-50 dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-black-100 dark:text-white mb-2">
            {t.carDetailsPage.carNotFound}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-sm">
            {t.carDetailsPage.carNotFoundDesc}
          </p>
          <Link
            href="/cars"
            className="px-6 py-3 rounded-full bg-primary-blue text-white font-semibold text-sm hover:bg-blue-700 transition shadow-md"
          >
            {t.carDetailsPage.backToCars}
          </Link>
        </div>
      </div>
    );
  }

  const storedCar = normalizeCarToStorage(car);
  const resolvedCarId = getCarId(car);
  const favorited = isFavorite(resolvedCarId);

  // Dynamic image extraction:
  // - If the car data has multiple images, use all of them.
  // - If only 1 image or empty, supplement with the existing multi-angle generator views ("29", "33", "13").
  // - Filter out empty/invalid URLs and eliminate duplicates while preserving order.
  const rawImages: string[] = (
    Array.isArray(storedCar.images) && storedCar.images.length > 1
      ? storedCar.images
      : [
          (storedCar.images && storedCar.images[0]) || storedCar.img_url || generateCarImageUrl(storedCar),
          generateCarImageUrl(storedCar, "29"),
          generateCarImageUrl(storedCar, "33"),
          generateCarImageUrl(storedCar, "13"),
        ]
  )
    .map((src) => (typeof src === "string" ? src.trim() : ""))
    .filter(Boolean);

  const images: string[] = rawImages.filter((img, idx) => rawImages.indexOf(img) === idx);
  const hasMultipleImages = images.length > 1;
  const activeIndex = currentIndex >= images.length ? 0 : currentIndex;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation for carousel
  useEffect(() => {
    if (!hasMultipleImages) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        if (isAr) handleNext();
        else handlePrev();
      } else if (e.key === "ArrowRight") {
        if (isAr) handlePrev();
        else handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasMultipleImages, isAr, handlePrev, handleNext]);

  const specRows = [
    { label: t.carDetails.specLabels.brand || t.carDetails.specLabels.make || "Brand", value: storedCar.brand },
    { label: t.carDetails.specLabels.model || "Model", value: storedCar.model },
    { label: t.carDetails.specLabels.year || "Year", value: String(storedCar.year) },
    { label: t.carDetails.specLabels.transmission || "Transmission", value: storedCar.transmission === "a" ? t.carDetails.values.a : t.carDetails.values.m },
    { label: t.carDetails.specLabels.fuel || t.carDetails.specLabels.fuel_type || "Fuel", value: t.carDetails.values[storedCar.fuel?.toLowerCase()] || storedCar.fuel },
    { label: t.carDetails.specLabels.drive || "Drive", value: t.carDetails.values[storedCar.drive?.toLowerCase()] || storedCar.drive?.toUpperCase() },
    { label: t.carDetails.specLabels.mileage || "Mileage", value: `${storedCar.mileage} ${t.carCard.mpg}` },
    { label: t.carDetails.specLabels.color || "Color", value: storedCar.color },
    { label: t.carDetails.specLabels.class || "Class", value: storedCar.class },
    { label: t.carDetails.specLabels.horsepower || "Horsepower", value: `${storedCar.horsepower} HP` },
    { label: t.carDetails.specLabels.cylinders || "Cylinders", value: String(storedCar.cylinders) },
    { label: t.carDetails.specLabels.displacement || "Displacement", value: `${storedCar.displacement} L` },
    { label: t.carDetails.specLabels.highway_mpg || "Highway MPG", value: `${storedCar.highway_mpg} ${t.carCard.mpg}` },
    { label: t.carDetails.specLabels.status || "Status", value: t.carDetails.values[storedCar.status] || storedCar.status },
  ];

  const calculatedDailyRate = Math.round(Number(storedCar.price) / (60 * 30)) || 50;

  return (
    <div className="padding-x py-6 sm:py-8 max-width">
      {/* Top Bar: Breadcrumb + Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-slate-800">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-primary-blue transition-colors">
            {t.carsPage.breadcrumbHome}
          </Link>
          <span>/</span>
          <Link href="/cars" className="hover:text-primary-blue transition-colors">
            {t.carsPage.breadcrumbCars}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100 font-semibold truncate max-w-[200px] sm:max-w-xs">
            {storedCar.name}
          </span>
        </nav>

        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-blue dark:hover:text-primary-blue transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 rtl:rotate-180">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span>{t.carDetailsPage.backToCars}</span>
        </button>
      </div>

      {/* Main Content Layout: Two Approximately Equal Halves (50% / 50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-start mt-8">
        {/* Left Column: Car Image Gallery (Large, Visually Dominant, Clean Empty Space, No Heavy Card) */}
        <div className="w-full flex flex-col items-center justify-center lg:sticky lg:top-24">
          {/* Main Car Image Area */}
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[480px] xl:h-[500px] flex items-center justify-center select-none">
            <Image
              src={images[activeIndex] || images[0]}
              alt={`${storedCar.name} - view ${activeIndex + 1}`}
              fill
              priority
              unoptimized
              className="object-contain transition-opacity duration-300"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Previous and Next Controls (Minimal, Clean, Near Edges, Only when multiple images) */}
            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous image"
                  className="absolute top-1/2 -translate-y-1/2 ltr:left-1 sm:ltr:left-3 rtl:right-1 sm:rtl:right-3 z-10 w-10 h-10 rounded-full bg-white/85 dark:bg-slate-800/85 hover:bg-white dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200/60 dark:border-slate-700/60 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-blue backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 rtl:rotate-180">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next image"
                  className="absolute top-1/2 -translate-y-1/2 ltr:right-1 sm:ltr:right-3 rtl:left-1 sm:rtl:left-3 z-10 w-10 h-10 rounded-full bg-white/85 dark:bg-slate-800/85 hover:bg-white dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200/60 dark:border-slate-700/60 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-blue backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 rtl:rotate-180">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>

                {/* Subtle Image Counter Badge */}
                <div className="absolute bottom-2 ltr:right-2 rtl:left-2 z-10 px-2.5 py-0.5 rounded-full bg-black/40 dark:bg-black/60 backdrop-blur-sm text-white text-xs font-medium tracking-wide">
                  {activeIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Optional Thumbnail Navigation: Small, Clean, Below Main Image */}
          {hasMultipleImages && (
            <div className="w-full flex items-center justify-center gap-2.5 sm:gap-3 overflow-x-auto py-4 px-2 max-w-full">
              {images.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`View image ${idx + 1}`}
                  aria-pressed={idx === activeIndex}
                  className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden shrink-0 transition-all focus:outline-none ${
                    idx === activeIndex
                      ? "ring-2 ring-primary-blue ring-offset-2 dark:ring-offset-slate-900 opacity-100 scale-100 shadow-sm"
                      : "opacity-45 hover:opacity-85 border border-gray-200 dark:border-slate-800 scale-95"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${storedCar.name} thumbnail ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Car Details & Information */}
        <div className="w-full flex flex-col gap-6">
          {/* Header Info: Status, Year, Make, Model & Actions */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-primary-blue dark:text-blue-400 text-xs font-semibold capitalize border border-blue-100 dark:border-blue-900/40">
                {t.carDetails.values[storedCar.status] || storedCar.status}
              </span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {storedCar.year} • {storedCar.class}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4 mt-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white capitalize tracking-tight">
                {storedCar.name}
              </h1>

              {/* Header Favorite Toggle */}
              <button
                type="button"
                onClick={() => toggleFavorite(resolvedCarId)}
                aria-label={favorited ? t.carCard.removeFromFavorites : t.carCard.addToFavorites}
                title={favorited ? t.carCard.removeFromFavorites : t.carCard.addToFavorites}
                className={`p-2.5 rounded-full border transition-all shrink-0 focus:outline-none ${
                  favorited
                    ? "bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-900 text-red-500 shadow-sm scale-105"
                    : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-400 hover:text-red-500 hover:border-red-200"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={favorited ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={favorited ? "0" : "2"}
                  className="w-5 h-5 transition-transform active:scale-75"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Daily Pricing Rate */}
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-xl font-bold text-primary-blue">{t.carCard.currency}</span>
              <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {calculatedDailyRate}
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                / {t.carDetailsPage.perDay}
              </span>
              {Number(storedCar.price) > 0 && (
                <span className="text-xs text-gray-400 dark:text-gray-500 ltr:ml-3 rtl:mr-3 border-l ltr:pl-3 rtl:border-r rtl:pr-3 border-gray-200 dark:border-slate-700">
                  {t.carDetails.specLabels.price || "Price"}: ${Number(storedCar.price).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Action CTAs: Rent / Book */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setRentBooked(true)}
              className={`flex-1 py-3.5 px-6 rounded-full font-bold text-sm transition-all shadow-sm focus:outline-none ${
                rentBooked
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-primary-blue hover:bg-blue-700 text-white hover:shadow-md"
              }`}
            >
              {rentBooked
                ? (isAr ? "تم إرسال طلب الحجز بنجاح ✓" : "Booking Request Received ✓")
                : t.carDetailsPage.rentNow}
            </button>
          </div>

          {/* Description Section */}
          {storedCar.description && (
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
              <h2 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-2">
                {t.carDetailsPage.overview}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {storedCar.description}
              </p>
            </div>
          )}

          {/* Features Section */}
          {storedCar.features && storedCar.features.length > 0 && (
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
              <h2 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-2.5">
                {t.carDetailsPage.features}
              </h2>
              <div className="flex flex-wrap gap-2">
                {storedCar.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300 text-xs font-medium border border-gray-200/60 dark:border-slate-700/60"
                  >
                    <span className="text-primary-blue font-bold">✓</span>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Technical Specifications Section */}
          <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
            <h2 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">
              {t.carDetailsPage.specifications}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {specRows.map((spec, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-800/60 text-sm"
                >
                  <span className="text-gray-500 dark:text-gray-400 font-normal">
                    {spec.label}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                    {spec.value || "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsView;

