"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Listbox, Transition } from "@headlessui/react";
import { CustomFilterProps } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

const CustomFilter = ({ title, options }: CustomFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, isAr } = useLanguage();

  const currentParamValue = searchParams.get(title) ?? "";
  const matchingOption = options.find(
    (opt) => opt.value.toLowerCase() === currentParamValue.toLowerCase()
  ) || options[0];

  const [selected, setSelected] = useState(matchingOption);

  useEffect(() => {
    setSelected(matchingOption);
  }, [currentParamValue]);

  const getOptionLabel = (option: { title: string; value: string }) => {
    if (title === "fuel") {
      const translated = t.filters.fuelOptions[option.value];
      if (translated) return translated;
      return option.title;
    }
    if (title === "year" && option.value === "") {
      return t.filters.yearDefaultTitle;
    }
    return option.title;
  };

  const handleUpdateParams = (e: { title: string; value: string }) => {
    const params = new URLSearchParams(window.location.search);
    if (e.value) {
      params.set(title, e.value.toLowerCase());
    } else {
      params.delete(title);
    }
    params.set("page", "1");

    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="w-fit">
      <Listbox
        value={selected}
        onChange={(e) => {
          setSelected(e);
          handleUpdateParams(e);
        }}
      >
        <div className='relative w-fit z-10'>
          <Listbox.Button className='custom-filter__btn ltr:text-left rtl:text-right'>
            <span className='block truncate'>{getOptionLabel(selected)}</span>
            <Image
              src='/chevron-up-down.svg'
              width={20}
              height={20}
              className='ltr:ml-4 rtl:mr-4 object-contain shrink-0'
              alt='chevron_up-down'
            />
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='custom-filter__options ltr:text-left rtl:text-right'>
              {options.map((option) => (
                <Listbox.Option
                  key={option.title}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-4 ${
                      active ? "bg-primary-blue text-white" : "text-gray-900"
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <span className={`block truncate ${selected ? "font-bold text-primary-blue" : "font-normal"}`}>
                      {getOptionLabel(option)}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default CustomFilter;