import "server-only";
import { CarProps, FilterProps } from "@/types";
import { getAllCars } from "@/utils/car-store";

export async function fetchCars(filters: FilterProps) {
  const { manufacturer, year, fuel, model } = filters;
  const result: CarProps[] = await getAllCars();
  const normalize = (value?: string | null) => (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const normalizedManufacturer = normalize(manufacturer);
  const normalizedModel = normalize(model);
  const normalizedFuel = normalize(fuel);

  return result.filter((car) => {
    const carMake = normalize(car.make || car.brand);
    const carModel = normalize(car.model);
    const carFuel = normalize(car.fuel_type || car.fuel);

    const matchesManufacturer = !normalizedManufacturer || carMake.includes(normalizedManufacturer);
    const matchesModel = !normalizedModel || carModel.includes(normalizedModel);
    const matchesYear = !year || car.year === Number(year);
    const matchesFuel = !normalizedFuel || carFuel.includes(normalizedFuel);

    return matchesManufacturer && matchesModel && matchesYear && matchesFuel;
  });
}