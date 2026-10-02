import { MouseEventHandler } from "react";

export interface CustomButtonProps {
  title: string;
  containerStyles?: String;
  handleClick: MouseEventHandler<HTMLButtonElement>;
  btnType: "button" | "submit";
  textStyles?: String;
  rightIcon?: string;
  isDisabled?: boolean;
}

export interface LoginButtonProps {
  title: string;
  containerStyles?: String;
  handleClick: MouseEventHandler<HTMLButtonElement>;
  btnType: "button" | "submit";
  textStyles?: String;
  rightIcon?: string;
  isDisabled?: boolean;
}

export interface SearchManufacturerProps {
  manufacturers: string;
  setManufacturer: (manufacturer: string) => void;
}

export interface CarProps {
  city_mpg: number;
  class: string;
  combination_mpg: number;
  cylinders: number;
  displacement: number;
  drive: string;
  fuel_type: string;
  highway_mpg: number;
  make: string;
  model: string;
  transmission: string;
  year: number;
  img_url: string;
  price: number;
  id?: string | number;
  name?: string;
  brand?: string;
  fuel?: string;
  mileage?: number;
  color?: string;
  horsepower?: number;
  images?: string[];
  description?: string;
  features?: string[];
  status?: CarStatus;
}

export type CarStatus = "available" | "rented" | "maintenance";

export interface StoredCar {
  id: string;
  name: string;
  brand: string;
  make: string;
  model: string;
  year: number;
  price: number;
  fuel: string;
  fuel_type: string;
  transmission: string;
  mileage: number;
  city_mpg: number;
  highway_mpg: number;
  combination_mpg: number;
  color: string;
  drive: string;
  class: string;
  cylinders: number;
  displacement: number;
  horsepower: number;
  status: CarStatus;
  description: string;
  features: string[];
  images: string[];
  img_url: string;
}

export interface ManagedCar extends CarProps {
  id: string;
  name: string;
  images: string[];
  description: string;
  features: string[];
  status: CarStatus;
}

export interface FilterProps {
    manufacturer: string;
    year: number;
    fuel: string;
    limit: number;
    model:string;
}

export interface CustomFilterProps {
    title: string;
    options: OptionProps[];
}

export interface OptionProps {
    title: string;
    value: string;
}

export interface SearchManuFacturerProps {
    manufacturer: string;
    setManuFacturer: (manufacturer: string) => void;
}

export interface ShowMoreProps {
    pageNumber: number;
    isNext: boolean;
  }
