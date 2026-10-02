"use client";

import Image from "next/image";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { manufacturers } from "@/constants";
import { SearchManuFacturerProps } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

const SearchManufacturer = ({ manufacturer, setManuFacturer }: SearchManuFacturerProps) => {
  const [query, setQuery] = useState("");
  const { t, isAr } = useLanguage();

  const filteredManufacturers =
    query === ""
      ? manufacturers
      : manufacturers.filter((item) =>
          item
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className='search-manufacturer'>
      <Combobox value={manufacturer} onChange={setManuFacturer}>
        <div className='relative w-full'>
          {/* Button for the combobox */}
          <Combobox.Button className='absolute top-[14px] ltr:left-0 rtl:right-0 z-10'>
            <Image
              src='/car-logo.svg'
              width={20}
              height={20}
              className='ltr:ml-4 rtl:mr-4'
              alt={t.catalogue.carLogoAlt}
            />
          </Combobox.Button>

          {/* Input field for searching */}
          <Combobox.Input
            name='manufacturer'
            className='search-manufacturer__input ltr:pl-12 rtl:pr-12 ltr:pr-4 rtl:pl-4'
            displayValue={(item: string) => item}
            onChange={(event) => {
              setQuery(event.target.value);
              setManuFacturer(event.target.value);
            }}
            placeholder={t.catalogue.searchBrandPlaceholder || t.catalogue.searchManufacturerPlaceholder}
          />

          {/* Transition for displaying the options */}
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options
              className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20 ltr:text-left rtl:text-right'
              static
            >
              {filteredManufacturers.length === 0 && query !== "" ? (
                <Combobox.Option
                  value={query}
                  className='search-manufacturer__option ltr:pl-10 rtl:pr-10'
                >
                  {isAr ? `إنشاء "${query}"` : `Create "${query}"`}
                </Combobox.Option>
              ) : (
                filteredManufacturers.map((item) => (
                  <Combobox.Option
                    key={item}
                    className={({ active }) =>
                      `relative search-manufacturer__option ltr:pl-10 rtl:pr-10 ${
                        active ? "bg-primary-blue text-white" : "text-gray-900"
                      }`
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                          {item}
                        </span>

                        {selected ? (
                          <span
                            className={`absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center ltr:pl-3 rtl:pr-3 ${
                              active ? "text-white" : "text-primary-blue"
                            }`}
                          >
                            ✓
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default SearchManufacturer;