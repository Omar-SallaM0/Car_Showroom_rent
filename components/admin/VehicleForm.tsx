"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CarStatus, ManagedCar } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

interface VehicleFormProps {
  mode: "add" | "edit";
  carId?: string;
}

type GalleryItem =
  | { id: string; type: "existing"; url: string }
  | { id: string; type: "new"; file: File; previewUrl: string };

type VehicleFormData = {
  name: string;
  make: string;
  model: string;
  year: string;
  price: string;
  status: CarStatus;
  fuel_type: string;
  transmission: string;
  drive: string;
  city_mpg: string;
  highway_mpg: string;
  cylinders: string;
  displacement: string;
  class: string;
  color: string;
  horsepower: string;
  features: string;
  description: string;
};

const blankFormData: VehicleFormData = {
  name: "",
  make: "",
  model: "",
  year: String(new Date().getFullYear()),
  price: "",
  status: "available",
  fuel_type: "Gas",
  transmission: "a",
  drive: "fwd",
  city_mpg: "28",
  highway_mpg: "36",
  cylinders: "4",
  displacement: "2.0",
  class: "Sedan",
  color: "Metallic Silver",
  horsepower: "180",
  features: "Bluetooth\nBackup Camera\nApple CarPlay / Android Auto\nCruise Control",
  description: "",
};

const statuses: CarStatus[] = ["available", "rented", "maintenance"];

const parseLines = (text: string) =>
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

export const VehicleForm: React.FC<VehicleFormProps> = ({ mode, carId }) => {
  const router = useRouter();
  const { t, isAr } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<VehicleFormData>(blankFormData);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [vehicleNotFound, setVehicleNotFound] = useState(false);
  const [originalCarName, setOriginalCarName] = useState("");

  // Load car data in edit mode
  useEffect(() => {
    if (mode !== "edit" || !carId) return;

    let active = true;
    setLoading(true);
    setError("");

    fetch(`/api/admin/cars/${encodeURIComponent(carId)}`, { cache: "no-store" })
      .then(async (res) => {
        if (res.status === 404) {
          throw new Error("NOT_FOUND");
        }
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || t.adminDashboard.loadError);
        }
        return res.json() as Promise<ManagedCar>;
      })
      .then((car) => {
        if (!active) return;
        setOriginalCarName(car.name || `${car.make} ${car.model}`);
        setForm({
          name: car.name || "",
          make: car.make || "",
          model: car.model || "",
          year: String(car.year || new Date().getFullYear()),
          price: String(car.price || ""),
          status: car.status || "available",
          fuel_type: car.fuel_type || "Gas",
          transmission: car.transmission || "a",
          drive: car.drive || "fwd",
          city_mpg: String(car.city_mpg ?? "28"),
          highway_mpg: String(car.highway_mpg ?? "36"),
          cylinders: String(car.cylinders ?? "4"),
          displacement: String(car.displacement ?? "2.0"),
          class: car.class || "Sedan",
          color: (car as any).color || "Metallic Silver",
          horsepower: String(car.horsepower ?? "180"),
          features: Array.isArray(car.features) ? car.features.join("\n") : "",
          description: car.description || "",
        });

        // Initialize gallery with existing images
        const existingUrls = Array.isArray(car.images) && car.images.length > 0
          ? car.images
          : car.img_url
          ? [car.img_url]
          : [];

        const initialGallery: GalleryItem[] = existingUrls.map((url, idx) => ({
          id: `existing-${idx}-${url}`,
          type: "existing",
          url,
        }));

        setGallery(initialGallery);
      })
      .catch((err: Error) => {
        if (!active) return;
        if (err.message === "NOT_FOUND") {
          setVehicleNotFound(true);
        } else {
          setError(err.message || t.adminDashboard.loadError);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [mode, carId, t.adminDashboard.loadError]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      gallery.forEach((item) => {
        if (item.type === "new") {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [gallery]);

  const updateField = (field: keyof VehicleFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Add files from device
  const handleFilesAdded = (files: FileList | File[]) => {
    setError("");
    const newItems: GalleryItem[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setError(`"${file.name}" is not an image file.`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(`"${file.name}" exceeds the 10MB limit.`);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      newItems.push({
        id: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type: "new",
        file,
        previewUrl,
      });
    });

    if (newItems.length > 0) {
      setGallery((prev) => [...prev, ...newItems]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesAdded(e.target.files);
      // Reset input value so same file can be re-selected if removed
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const removeGalleryItem = (id: string) => {
    setGallery((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target && target.type === "new") {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const setAsCoverItem = (index: number) => {
    if (index === 0) return;
    setGallery((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.make.trim() || !form.model.trim()) {
      setError("Please fill in the Vehicle Name, Brand/Make, and Model.");
      return;
    }

    if (Number(form.price) < 0 || isNaN(Number(form.price))) {
      setError("Please enter a valid price.");
      return;
    }

    if (gallery.length === 0) {
      setError(t.adminDashboard.imagesRequiredError || "Please select at least one photo for the vehicle from your device.");
      return;
    }

    setSaving(true);

    try {
      // 1. Upload new files if any
      const newItems = gallery.filter((item): item is Extract<GalleryItem, { type: "new" }> => item.type === "new");
      const uploadedMap = new Map<string, string>();

      if (newItems.length > 0) {
        const uploadFormData = new FormData();
        newItems.forEach((item) => {
          uploadFormData.append("files", item.file);
        });

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadResult.error || "Failed to upload images");
        }

        const urls: string[] = uploadResult.urls || [];
        newItems.forEach((item, idx) => {
          if (urls[idx]) {
            uploadedMap.set(item.id, urls[idx]);
          }
        });
      }

      // 2. Build final images array in the EXACT order chosen in gallery
      const finalImages: string[] = [];
      gallery.forEach((item) => {
        if (item.type === "existing") {
          finalImages.push(item.url);
        } else {
          const uploadedUrl = uploadedMap.get(item.id);
          if (uploadedUrl) {
            finalImages.push(uploadedUrl);
          }
        }
      });

      // 3. Prepare payload
      const payload = {
        name: form.name.trim(),
        make: form.make.trim(),
        model: form.model.trim(),
        year: Number(form.year),
        price: Number(form.price),
        status: form.status,
        fuel_type: form.fuel_type.trim() || "Gas",
        transmission: form.transmission,
        drive: form.drive.trim() || "fwd",
        city_mpg: Number(form.city_mpg) || 0,
        highway_mpg: Number(form.highway_mpg) || 0,
        cylinders: Number(form.cylinders) || 4,
        displacement: Number(form.displacement) || 2.0,
        class: form.class.trim() || "Sedan",
        color: form.color.trim() || "Metallic Silver",
        horsepower: Number(form.horsepower) || 180,
        images: finalImages,
        img_url: finalImages[0] || "",
        features: parseLines(form.features),
        description: form.description.trim(),
      };

      // 4. Save to API
      const endpoint = mode === "edit" && carId
        ? `/api/admin/cars/${encodeURIComponent(carId)}`
        : "/api/admin/cars";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || t.adminDashboard.saveError);
      }

      // 5. Navigate back to dashboard with success message
      const successNotice = mode === "edit"
        ? t.adminDashboard.updatedNotice
        : t.adminDashboard.addedNotice;

      router.push(`/admin?notice=${encodeURIComponent(successNotice)}`);
    } catch (err: any) {
      console.error("Save vehicle error:", err);
      setError(err instanceof Error ? err.message : t.adminDashboard.saveError);
      setSaving(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      window.location.assign("/admin/login");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-slate-950 text-black-100 dark:text-gray-100 transition-colors flex flex-col">
        <header className="border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-10">
            <div>
              <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">{t.adminDashboard.brand}</p>
              <h1 className="text-xl font-extrabold dark:text-white">{t.adminDashboard.dashboardTitle}</h1>
            </div>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-12 h-12 border-4 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{t.adminDashboard.loading}</p>
        </div>
      </main>
    );
  }

  if (vehicleNotFound) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-slate-950 text-black-100 dark:text-gray-100 transition-colors flex flex-col">
        <header className="border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-10">
            <div>
              <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">{t.adminDashboard.brand}</p>
              <h1 className="text-xl font-extrabold dark:text-white">{t.adminDashboard.dashboardTitle}</h1>
            </div>
            <Link
              href="/admin"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-blue transition"
            >
              {t.adminDashboard.backToDashboard}
            </Link>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t.adminDashboard.vehicleNotFound}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {t.adminDashboard.vehicleNotFoundDesc} (ID: {carId})
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary-blue text-white font-semibold text-sm hover:bg-blue-700 transition shadow-sm"
            >
              {t.adminDashboard.backToDashboard}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const pageTitle = mode === "edit"
    ? `${t.adminDashboard.editVehicleTitle}${originalCarName ? `: ${originalCarName}` : ""}`
    : t.adminDashboard.addVehicleTitle;

  const pageDesc = mode === "edit"
    ? t.adminDashboard.editVehicleDesc
    : t.adminDashboard.addVehicleDesc;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 text-black-100 dark:text-gray-100 transition-colors pb-16">
      {/* Top Header */}
      <header className="border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30 transition-colors shadow-xs">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-10 gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary-blue dark:hover:text-blue-400 transition"
              title={t.adminDashboard.backToDashboard}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`}>
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span className="hidden sm:inline">{t.adminDashboard.backToDashboard}</span>
            </Link>
            <span className="text-gray-300 dark:text-slate-700">|</span>
            <div>
              <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">{t.adminDashboard.brand}</p>
              <h1 className="text-lg sm:text-xl font-extrabold dark:text-white truncate max-w-[280px] sm:max-w-md">
                {pageTitle}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-block text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-blue transition"
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

      {/* Main Container */}
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        {/* Navigation Breadcrumb & Intro */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              <Link href="/admin" className="hover:text-primary-blue transition">
                {t.adminDashboard.dashboardTitle}
              </Link>
              <span>/</span>
              <span className="text-primary-blue font-bold">
                {mode === "edit" ? t.adminDashboard.editVehicleTitle : t.adminDashboard.addVehicleTitle}
              </span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {pageTitle}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {pageDesc}
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-lg border border-gray-300 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition shadow-xs"
          >
            {t.adminDashboard.cancel}
          </Link>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-800 dark:text-red-300 shadow-xs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div className="flex-1 font-medium">{error}</div>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700 font-bold text-base leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: VEHICLE IMAGES (FROM DEVICE) */}
          <section className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-primary-blue flex items-center justify-center font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t.adminDashboard.imagesSection}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-primary-blue">
                {t.adminDashboard.selectedImages(gallery.length)}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
              {t.adminDashboard.imagesSectionDesc}
            </p>

            {/* Dropzone & Picker Button */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                isDragOver
                  ? "border-primary-blue bg-blue-50/60 dark:bg-blue-950/30 scale-[1.005]"
                  : "border-gray-300 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/40 hover:border-primary-blue hover:bg-blue-50/30 dark:hover:bg-slate-800/80"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                id="vehicle-images-input"
              />

              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-primary-blue">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-blue px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    {t.adminDashboard.chooseImages}
                  </button>
                  <p className="mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                    {t.adminDashboard.dragDropImages}
                  </p>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {t.adminDashboard.uploadHint}
                </p>
              </div>
            </div>

            {/* Gallery Grid of Selected Images */}
            {gallery.length > 0 ? (
              <div className="mt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {gallery.map((item, index) => {
                    const isCover = index === 0;
                    const displayUrl = item.type === "existing" ? item.url : item.previewUrl;

                    return (
                      <div
                        key={item.id}
                        className={`group relative rounded-xl overflow-hidden border-2 bg-gray-100 dark:bg-slate-800 transition-all shadow-xs ${
                          isCover
                            ? "border-primary-blue ring-2 ring-primary-blue/30"
                            : "border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-600"
                        }`}
                      >
                        {/* Thumbnail aspect ratio box */}
                        <div className="relative aspect-[4/3] w-full bg-slate-900/10 dark:bg-black/30">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={displayUrl}
                            alt={`Vehicle photo ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />

                          {/* Cover badge */}
                          {isCover && (
                            <div className="absolute top-2 ltr:left-2 rtl:right-2 z-10 flex items-center gap-1 bg-primary-blue text-white px-2 py-0.5 rounded-md text-[11px] font-bold shadow-md">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                              <span>{t.adminDashboard.mainCover}</span>
                            </div>
                          )}

                          {/* Item type badge (New vs Existing) */}
                          <div className={`absolute bottom-2 ltr:left-2 rtl:right-2 z-10 px-1.5 py-0.5 rounded text-[10px] font-semibold backdrop-blur-md ${
                            item.type === "new"
                              ? "bg-emerald-600/90 text-white"
                              : "bg-slate-900/80 text-gray-200"
                          }`}>
                            {item.type === "new" ? t.adminDashboard.newPhotoBadge : t.adminDashboard.existingPhotoBadge}
                          </div>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeGalleryItem(item.id);
                            }}
                            aria-label={t.adminDashboard.removePhoto}
                            title={t.adminDashboard.removePhoto}
                            className="absolute top-2 ltr:right-2 rtl:left-2 z-20 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 shadow-md transition transform active:scale-90"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                              <line x1="18" y1="6" x2="6" y2="18"/>
                              <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        </div>

                        {/* Footer Card Action: Set as Cover */}
                        {!isCover && (
                          <div className="p-2 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
                            <button
                              type="button"
                              onClick={() => setAsCoverItem(index)}
                              className="w-full text-center text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-blue dark:hover:text-blue-400 py-1 rounded transition"
                            >
                              {t.adminDashboard.setAsCover}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-4 p-6 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t.adminDashboard.noImagesSelected}
                </p>
              </div>
            )}
          </section>

          {/* SECTION 2: BASIC INFORMATION */}
          <section className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs transition-colors">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t.adminDashboard.basicInfoSection}
              </h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.name} <span className="text-red-500">*</span>
                <input
                  required
                  type="text"
                  placeholder="e.g. Toyota Camry XSE"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                />
              </label>

              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.brand} <span className="text-red-500">*</span>
                <input
                  required
                  type="text"
                  placeholder="e.g. Toyota"
                  value={form.make}
                  onChange={(e) => updateField("make", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                />
              </label>

              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.model} <span className="text-red-500">*</span>
                <input
                  required
                  type="text"
                  placeholder="e.g. Camry"
                  value={form.model}
                  onChange={(e) => updateField("model", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                />
              </label>

              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.year} <span className="text-red-500">*</span>
                <input
                  required
                  type="number"
                  min="1886"
                  max={new Date().getFullYear() + 2}
                  value={form.year}
                  onChange={(e) => updateField("year", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                />
              </label>

              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.vehicleClass}
                <input
                  type="text"
                  placeholder="e.g. Sedan, SUV, Coupe"
                  value={form.class}
                  onChange={(e) => updateField("class", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                />
              </label>

              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.color}
                <input
                  type="text"
                  placeholder="e.g. Midnight Black"
                  value={form.color}
                  onChange={(e) => updateField("color", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                />
              </label>
            </div>
          </section>

          {/* SECTION 3: PRICING & STATUS */}
          <section className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs transition-colors">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t.adminDashboard.pricingStatusSection}
              </h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.price} <span className="text-red-500">*</span>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center px-3 text-gray-400 font-bold">
                    $
                  </span>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="35000"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 ltr:pl-8 rtl:pr-8 pr-3 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                  />
                </div>
              </label>

              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.availability} <span className="text-red-500">*</span>
                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value as CarStatus)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {t.carDetails.values[status] || status}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          {/* SECTION 4: TECHNICAL SPECIFICATIONS */}
          <section className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs transition-colors">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t.adminDashboard.performanceSection}
              </h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.fuelType}
                <input
                  type="text"
                  placeholder="e.g. Gas, Hybrid, Electric"
                  value={form.fuel_type}
                  onChange={(e) => updateField("fuel_type", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                />
              </label>

              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.transmission}
                <select
                  value={form.transmission}
                  onChange={(e) => updateField("transmission", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                >
                  <option value="a">{t.adminDashboard.fields.automatic}</option>
                  <option value="m">{t.adminDashboard.fields.manual}</option>
                </select>
              </label>

              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.drive}
                <input
                  type="text"
                  placeholder="e.g. fwd, rwd, awd, 4wd"
                  value={form.drive}
                  onChange={(e) => updateField("drive", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                />
              </label>

              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.horsepower}
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 250"
                  value={form.horsepower}
                  onChange={(e) => updateField("horsepower", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                />
              </label>

              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.cityMpg}
                <input
                  type="number"
                  min="0"
                  placeholder="28"
                  value={form.city_mpg}
                  onChange={(e) => updateField("city_mpg", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                />
              </label>

              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.highwayMpg}
                <input
                  type="number"
                  min="0"
                  placeholder="36"
                  value={form.highway_mpg}
                  onChange={(e) => updateField("highway_mpg", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                />
              </label>

              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.cylinders}
                <input
                  type="number"
                  min="0"
                  placeholder="4"
                  value={form.cylinders}
                  onChange={(e) => updateField("cylinders", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                />
              </label>

              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.displacement}
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="2.0"
                  value={form.displacement}
                  onChange={(e) => updateField("displacement", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                />
              </label>
            </div>
          </section>

          {/* SECTION 5: FEATURES & DESCRIPTION */}
          <section className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs transition-colors">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t.adminDashboard.featuresDescSection}
              </h3>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.features}
                <textarea
                  rows={4}
                  placeholder={t.adminDashboard.fields.featuresPlaceholder}
                  value={form.features}
                  onChange={(e) => updateField("features", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                />
              </label>

              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t.adminDashboard.fields.description}
                <textarea
                  rows={4}
                  placeholder="Comprehensive description of the vehicle condition, history, options..."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 font-normal text-sm focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none dark:text-white transition"
                />
              </label>
            </div>
          </section>

          {/* ACTION BUTTONS BAR */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-slate-800">
            <Link
              href="/admin"
              className="rounded-xl border border-gray-300 dark:border-slate-700 px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              {t.adminDashboard.cancel}
            </Link>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-blue px-7 py-3 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-60 shadow-md active:scale-98"
              >
                {saving && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {saving
                  ? t.adminDashboard.savingVehicle
                  : mode === "edit"
                  ? t.adminDashboard.saveChanges
                  : t.adminDashboard.saveVehicle}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default VehicleForm;
