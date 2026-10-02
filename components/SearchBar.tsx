"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchManufacturer from "./SearchManufacturer";
import { useLanguage } from "@/context/LanguageContext";

const SearchButton = ({ otherClasses, altText }: { otherClasses?: string; altText: string }) => (
  <button
    type='submit'
    className={`z-10 focus:outline-none flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-transform ${otherClasses || ""}`}
    aria-label={altText}
    title={altText}
  >
    <Image
      src={"/magnifying-glass.svg"}
      alt={altText}
      width={40}
      height={40}
      className='object-contain drop-shadow-sm'
    />
  </button>
);

const SearchBar = () => {
  const [manufacturer, setManuFacturer] = useState("");
  const [model, setModel] = useState("");
  const { t } = useLanguage();

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentManufacturer = searchParams.get("manufacturer") ?? "";
  const currentModel = searchParams.get("model") ?? "";
  const currentSearch = searchParams.toString();

  useEffect(() => {
    setManuFacturer(currentManufacturer);
    setModel(currentModel);
  }, [currentManufacturer, currentModel]);

  useEffect(() => {
    if (window.location.hash !== "#search-results") {
      return;
    }

    requestAnimationFrame(() => {
      const results = document.getElementById("search-results");
      if (results) {
        window.scrollTo({
          top: results.getBoundingClientRect().top + window.scrollY,
          behavior: "instant",
        });
      }
    });
  }, [currentSearch]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const manufacturerValue = String(formData.get("manufacturer") ?? "").trim();
    const modelValue = String(formData.get("model") ?? "").trim();

    updateSearchParams(modelValue.toLowerCase(), manufacturerValue.toLowerCase());
  };

  const updateSearchParams = (model: string, manufacturer: string) => {
    const searchParams = new URLSearchParams(window.location.search);

    if (model) {
      searchParams.set("model", model);
    } else {
      searchParams.delete("model");
    }

    if (manufacturer) {
      searchParams.set("manufacturer", manufacturer);
    } else {
      searchParams.delete("manufacturer");
    }

    searchParams.set("page", "1");

    const newPathname = `${window.location.pathname}?${searchParams.toString()}`;
    const destination = `${newPathname}#search-results`;

    if (destination === `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      const results = document.getElementById("search-results");
      if (results) {
        window.scrollTo({
          top: results.getBoundingClientRect().top + window.scrollY,
          behavior: "instant",
        });
      }
      return;
    }

    router.push(destination, { scroll: false });
  };

  return (
    <form className='searchbar' onSubmit={handleSearch}>
      {/* 1. First Input: Model */}
      <div className='searchbar__item'>
        <SearchManufacturer
          manufacturer={manufacturer}
          setManuFacturer={setManuFacturer}
        />
      </div>
      <div className='searchbar__item'>
        <Image
          src='/model-icon.png'
          width={25}
          height={25}
          className='absolute w-[20px] h-[20px] ltr:ml-4 rtl:mr-4 ltr:left-0 rtl:right-0 z-10 pointer-events-none'
          alt={t.catalogue.carModelAlt}
        />
        <input
          type='text'
          name='model'
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder={t.catalogue.searchModelPlaceholder}
          className='searchbar__input ltr:pl-12 rtl:pr-12 ltr:pr-4 rtl:pl-4'
        />
      </div>

      {/* Search Button placed directly between Model and Brand */}
      <SearchButton altText={t.catalogue.searchBtnAlt} />

      {/* 2. Second Input: Brand */}
    </form>
  );
};

export default SearchBar;