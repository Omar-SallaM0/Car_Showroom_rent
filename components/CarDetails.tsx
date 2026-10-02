"use client";

import { CarProps } from '@/types';
import Image from 'next/image';
import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { generateCarImageUrl } from '@/utils';
import { useLanguage } from '@/context/LanguageContext';
import { syncCarToLocalStorage, normalizeCarToStorage } from '@/utils/car-storage';

interface carDetailsProps {
  isOpen: boolean;
  closeModal: () => void;
  car: CarProps;
}

const CarDetails = ({ isOpen, closeModal, car }: carDetailsProps) => {
  const { t, isAr } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Synchronize car to localStorage with 1-to-1 UI mapping
  const storedCar = normalizeCarToStorage(car);

  useEffect(() => {
    if (isOpen) {
      syncCarToLocalStorage(car);
      setCurrentIndex(0);
    }
  }, [isOpen, car]);

  // Images list for carousel
  const images: string[] = storedCar.images?.length
    ? storedCar.images
    : [
        storedCar.img_url || generateCarImageUrl(storedCar),
        generateCarImageUrl(storedCar, '29'),
        generateCarImageUrl(storedCar, '33'),
        generateCarImageUrl(storedCar, '13'),
      ].filter(Boolean);

  const hasMultipleImages = images.length > 1;

  const handlePrevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Structured 1-to-1 specification attributes matching localStorage StoredCar
  const specItems = [
    { key: "brand", label: t.carDetails.specLabels.brand || t.carDetails.specLabels.make || "Brand", value: storedCar.brand },
    { key: "model", label: t.carDetails.specLabels.model || "Model", value: storedCar.model },
    { key: "year", label: t.carDetails.specLabels.year || "Year", value: String(storedCar.year) },
    { key: "price", label: t.carDetails.specLabels.price || "Price", value: `$${(Number(storedCar.price) / 365).toLocaleString()}` },
    { key: "fuel", label: t.carDetails.specLabels.fuel || t.carDetails.specLabels.fuel_type || "Fuel", value: t.carDetails.values[storedCar.fuel] || storedCar.fuel },
    { key: "transmission", label: t.carDetails.specLabels.transmission || "Transmission", value: storedCar.transmission === "a" ? t.carDetails.values.a : t.carDetails.values.m },
    { key: "mileage", label: t.carDetails.specLabels.mileage || "Mileage", value: `${storedCar.mileage} ${t.carCard.mpg}` },
    { key: "color", label: t.carDetails.specLabels.color || "Color", value: storedCar.color },
    { key: "drive", label: t.carDetails.specLabels.drive || "Drive", value: t.carDetails.values[storedCar.drive?.toLowerCase()] || storedCar.drive?.toUpperCase() },
    { key: "class", label: t.carDetails.specLabels.class || "Class", value: storedCar.class },
    { key: "horsepower", label: t.carDetails.specLabels.horsepower || "Horsepower", value: `${storedCar.horsepower} HP` },
    { key: "status", label: t.carDetails.specLabels.status || "Status", value: t.carDetails.values[storedCar.status] || storedCar.status },
    { key: "cylinders", label: t.carDetails.specLabels.cylinders || "Cylinders", value: String(storedCar.cylinders) },
    { key: "displacement", label: t.carDetails.specLabels.displacement || "Displacement", value: `${storedCar.displacement} L` },
    { key: "highway_mpg", label: t.carDetails.specLabels.highway_mpg || "Highway MPG", value: `${storedCar.highway_mpg} ${t.carCard.mpg}` },
  ];

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className='fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-sm' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto transform rounded-2xl bg-white dark:bg-slate-900 dark:border dark:border-slate-800 p-6 ltr:text-left rtl:text-right shadow-2xl gap-5 transition-all flex flex-col">
                  {/* Close modal button */}
                  <button
                    className='absolute top-3 ltr:right-3 rtl:left-3 z-30 w-fit p-2 bg-primary-blue-100 dark:bg-slate-800 rounded-full hover:bg-primary-blue/20 dark:hover:bg-slate-700 transition'
                    type='button'
                    onClick={closeModal}
                    aria-label={t.carDetails.close}
                  >
                    <Image src="/close.svg" alt={t.carDetails.close} width={20} height={20} className='object-contain dark:invert' />
                  </button>

                  {/* Image Carousel Section */}
                  <div className='flex-1 flex flex-col gap-3'>
                    <div className='relative w-full bg-pattern bg-cover bg-center rounded-lg h-44 sm:h-52 dark:bg-slate-800/80 overflow-hidden group'>
                      <Image
                        src={images[currentIndex] || images[0]}
                        alt={`${storedCar.name} - image ${currentIndex + 1}`}
                        fill
                        priority
                        unoptimized
                        className="object-contain transition-all duration-300"
                      />

                      {/* Carousel controls: rendered ONLY if there are multiple images */}
                      {hasMultipleImages && (
                        <>
                          <button
                            type="button"
                            onClick={handlePrevImage}
                            aria-label="Previous image"
                            className="absolute top-1/2 -translate-y-1/2 ltr:left-2 rtl:right-2 z-20 w-8 h-8 rounded-full bg-white/85 dark:bg-slate-800/85 hover:bg-white dark:hover:bg-slate-700 text-black-100 dark:text-white shadow-md flex items-center justify-center transition-all focus:outline-none"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 rtl:rotate-180">
                              <path d="m15 18-6-6 6-6" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={handleNextImage}
                            aria-label="Next image"
                            className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 z-20 w-8 h-8 rounded-full bg-white/85 dark:bg-slate-800/85 hover:bg-white dark:hover:bg-slate-700 text-black-100 dark:text-white shadow-md flex items-center justify-center transition-all focus:outline-none"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 rtl:rotate-180">
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </button>

                          {/* Image Counter Badge */}
                          <div className="absolute bottom-2 ltr:right-2 rtl:left-2 z-20 rounded-full bg-black/60 backdrop-blur-sm text-white px-2.5 py-0.5 text-xs font-medium">
                            {currentIndex + 1} / {images.length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Interactive Thumbnails */}
                    {hasMultipleImages && (
                      <div className='flex gap-2 sm:gap-3 overflow-x-auto py-1'>
                        {images.map((image, index) => (
                          <button
                            key={image + index}
                            type="button"
                            onClick={() => setCurrentIndex(index)}
                            className={`flex-1 min-w-[70px] relative h-20 bg-primary-blue-100 dark:bg-slate-800 rounded-lg overflow-hidden transition-all focus:outline-none ${
                              index === currentIndex
                                ? "ring-2 ring-primary-blue ring-offset-2 dark:ring-offset-slate-900 shadow-md scale-95"
                                : "opacity-70 hover:opacity-100"
                            }`}
                          >
                            <Image
                              src={image}
                              alt={`${storedCar.name} thumbnail ${index + 1}`}
                              fill
                              priority
                              unoptimized
                              className="object-contain"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Header Title & Details Content */}
                  <div className='flex-1 flex flex-col gap-2 mt-1'>
                    <div className="flex items-center justify-between gap-3">
                      <h2 className='font-bold text-2xl capitalize text-black-100 dark:text-white transition-colors'>
                        {storedCar.name}
                      </h2>
                      <span className="shrink-0 rounded-full bg-primary-blue/10 dark:bg-primary-blue/20 text-primary-blue text-xs font-bold px-3 py-1 capitalize">
                        {t.carDetails.values[storedCar.status] || storedCar.status}
                      </span>
                    </div>

                    {/* Optional description */}
                    {storedCar.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                        {storedCar.description}
                      </p>
                    )}

                    {/* Optional features list */}
                    {storedCar.features && storedCar.features.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {storedCar.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs px-2.5 py-1 font-medium"
                          >
                            ✓ {feature}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 1-to-1 Mapped Details Specification Rows */}
                    <div className='mt-3 flex flex-col gap-2.5'>
                      {specItems.map((spec) => (
                        <div
                          className='flex justify-between items-center gap-5 w-full py-1.5 border-b border-gray-100 dark:border-slate-800 last:border-b-0'
                          key={spec.key}
                        >
                          <h4 className='capitalize text-grey dark:text-gray-400 text-sm font-medium'>
                            {spec.label}
                          </h4>
                          <p className='text-black-100 dark:text-gray-100 font-semibold text-sm'>
                            {spec.value || "-"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CarDetails;