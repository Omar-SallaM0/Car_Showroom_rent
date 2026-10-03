"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CarProps, CarStatus, ManagedCar } from "@/types";
import { generateCarImageUrl } from "@/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/context/FavoritesContext";
import { getCarId } from "@/utils/car-storage";

export interface CarCardProps {
  car: CarProps | ManagedCar;
  isAdmin?: boolean;
  onEdit?: (car: CarProps | ManagedCar) => void;
  onDelete?: (car: CarProps | ManagedCar) => void;
  onChangeStatus?: (car: CarProps | ManagedCar, status: CarStatus) => void;
}

const statuses: CarStatus[] = ["available", "rented", "maintenance"];

export const CarCard: React.FC<CarCardProps> = ({
  car,
  isAdmin = false,
  onEdit,
  onDelete,
  onChangeStatus,
}) => {
  const router = useRouter();
  const { t, isAr } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();

  const carId = getCarId(car);
  const favorited = isFavorite(carId);

  const { year, make, brand, model, transmission, img_url, price, mileage, city_mpg } = car;
  const brandName = brand || make || "Vehicle";
  const modelName = model || car.name || "Model";
  const resolvedMileage = mileage !== undefined && mileage !== null ? mileage : city_mpg || 0;

  const availableImages = Array.isArray(car.images) ? car.images.filter(Boolean) : [];
  const imageUrl =
    (availableImages.length > 1 && availableImages[1]) ||
    generateCarImageUrl(car, "29");

  const displayStatus = car.status ? t.carCard.statuses[car.status] || car.status : null;

  const handleNavigateToDetails = () => {
    router.push(`/cars/${encodeURIComponent(carId)}`);
  };

  return (
    <article
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ltr:text-left rtl:text-right"
    >
      {/* 1. IMAGE CONTAINER SECTION (Top of Card) */}
      <div
        className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-slate-800 cursor-pointer"
        onClick={handleNavigateToDetails}
      >
        {/* Full-bleed vehicle cover image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={`${brandName} ${modelName}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Controls Overlay */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
          {/* Status Badge */}
          {displayStatus ? (
            <span
              className={`pointer-events-auto px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${
                car.status === "available"
                  ? "bg-emerald-500/90 text-white border-emerald-400/40"
                  : car.status === "rented"
                  ? "bg-amber-500/90 text-white border-amber-400/40"
                  : "bg-rose-500/90 text-white border-rose-400/40"
              }`}
            >
              {displayStatus}
            </span>
          ) : (
            <div />
          )}

          {/* Favorite Button (Public) */}
          {!isAdmin && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleFavorite(carId);
              }}
              aria-label={favorited ? t.carCard.removeFromFavorites : t.carCard.addToFavorites}
              title={favorited ? t.carCard.removeFromFavorites : t.carCard.addToFavorites}
              className={`pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-sm border ${
                favorited
                  ? "bg-red-50/90 dark:bg-red-950/80 border-red-200 dark:border-red-900/60 text-red-500 scale-105"
                  : "bg-white/85 dark:bg-slate-800/85 border-gray-200/70 dark:border-slate-700/70 text-gray-500 hover:text-red-500 hover:scale-105"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={favorited ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={favorited ? "0" : "2"}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 transition-transform active:scale-75"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}

          {/* Quick Year Pill (Admin) */}
          {isAdmin && (
            <span className="pointer-events-auto px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-900/80 text-white backdrop-blur-md shadow-xs border border-white/10">
              {car.year}
            </span>
          )}
        </div>
      </div>

      {/* 2. VEHICLE INFORMATION SECTION */}
      <div className="flex flex-col flex-1 justify-between p-5">
        <div>
          {/* Brand (Subtle & Smaller) */}
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 truncate">
            {brandName}
          </p>

          {/* Model (Main Visual Element) */}
          <h3
            onClick={handleNavigateToDetails}
            className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white truncate mt-0.5 hover:text-primary-blue transition-colors cursor-pointer"
            title={`${brandName} ${modelName}`}
          >
            {modelName}
          </h3>

          {/* Year | Mileage Metadata Row */}
          <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-gray-600 dark:text-gray-300">
            {/* Year */}
            <div className="flex items-center gap-1.5 shrink-0" title="Year">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5 text-gray-400"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>{year}</span>
            </div>

            <span className="text-gray-300 dark:text-slate-700">•</span>

            {/* Mileage */}
            <div className="flex items-center gap-1.5 truncate" title="Mileage / Fuel Efficiency">
              <Image
                src="/tire.svg"
                alt="mileage"
                width={14}
                height={14}
                className="dark:brightness-200 shrink-0"
              />
              <span className="truncate">
                {resolvedMileage} {t.carCard.mpg}
              </span>
            </div>

            {/* Transmission */}
            {transmission && (
              <>
                <span className="text-gray-300 dark:text-slate-700 hidden sm:inline">•</span>
                <div className="hidden sm:flex items-center gap-1.5 shrink-0" title="Transmission">
                  <Image
                    src="/steering-wheel.svg"
                    alt="transmission"
                    width={14}
                    height={14}
                    className="dark:brightness-200"
                  />
                  <span>
                    {transmission === "a" ? t.carCard.automatic : t.carCard.manual}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 3. PRICE SECTION (Visually Separated) */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block">
              {t.adminDashboard?.fields?.price || "Price"}
            </span>
            <p className="text-xl sm:text-2xl font-black text-primary-blue dark:text-blue-400 flex items-baseline gap-1">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                {t.carCard.currency}
              </span>
              <span>{Number(price || 0).toLocaleString()}</span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {t.carCard.perDay}
              </span>
            </p>
          </div>

          {!isAdmin && (
            <button
              type="button"
              onClick={handleNavigateToDetails}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-primary-blue dark:text-blue-400 text-xs font-bold hover:bg-primary-blue hover:text-white dark:hover:bg-primary-blue dark:hover:text-white transition-all shadow-2xs"
            >
              <span>{t.carCard.viewDetails}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-3 h-3 ${isAr ? "rotate-180" : ""}`}
              >
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          )}
        </div>

        {/* 4. ADMIN MANAGEMENT CONTROLS (Only visible in Admin Dashboard) */}
        {isAdmin && (
          <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <select
                aria-label={`Status for ${car.name}`}
                value={car.status || "available"}
                onChange={(e) => onChangeStatus?.(car, e.target.value as CarStatus)}
                className="w-full text-xs font-semibold rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-2.5 py-1.5 text-gray-700 dark:text-gray-200 focus:border-primary-blue outline-none transition"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {t.carDetails.values[st] || st}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <Link
                href={`/cars/${encodeURIComponent(carId)}`}
                target="_blank"
                className="text-center rounded-lg border border-gray-300 dark:border-slate-700 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition truncate px-1"
              >
                {t.carCard.viewDetails}
              </Link>
              <Link
                href={`/admin/vehicles/edit/${encodeURIComponent(carId)}`}
                className="text-center rounded-lg bg-primary-blue hover:bg-blue-700 py-1.5 text-xs font-bold text-white shadow-xs transition truncate px-1"
              >
                {t.adminDashboard.edit}
              </Link>
              <button
                type="button"
                onClick={() => onDelete?.(car)}
                className="rounded-lg border border-red-200 dark:border-red-900/60 py-1.5 text-xs font-bold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition truncate px-1"
              >
                {t.adminDashboard.delete}
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default CarCard;