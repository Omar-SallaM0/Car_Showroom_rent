import { CarProps, StoredCar } from "@/types";

export const CARS_STORAGE_KEY = "showroom_cars";

/**
 * Extracts a deterministic, unique ID for any car object.
 */
export function getCarId(car: Partial<CarProps>, index = 0): string {
  if (car.id !== undefined && car.id !== null && String(car.id).trim() !== "") {
    return String(car.id);
  }
  const brand = String(car.brand || car.make || "car").trim();
  const model = String(car.model || "unknown").trim();
  const year = car.year || 2024;
  return `car-${brand}-${model}-${year}-${index}`.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Normalizes any car object into a consistent, future-database-ready StoredCar model.
 * Provides a 1-to-1 mapping with all fields displayed in the Car Details UI.
 */
export function normalizeCarToStorage(car: Partial<CarProps> | StoredCar, index = 0): StoredCar {
  const brand = String(car.brand || car.make || "Unknown").trim();
  const model = String(car.model || "Unknown").trim();
  const name = String(car.name || `${brand} ${model}`).trim();
  const id = getCarId(car, index);

  const images = Array.isArray(car.images) && car.images.length
    ? car.images
    : car.img_url
    ? [car.img_url]
    : [];

  const cityMpg = Number(car.city_mpg !== undefined ? car.city_mpg : car.mileage) || 0;
  const mileage = Number(car.mileage !== undefined ? car.mileage : car.city_mpg) || 0;
  const fuelType = String(car.fuel_type || car.fuel || "Gas").trim();

  return {
    id,
    name,
    brand,
    make: brand, // alias for brand
    model,
    year: Number(car.year) || new Date().getFullYear(),
    price: Number(car.price) || 0,
    fuel: fuelType,
    fuel_type: fuelType, // alias for fuel
    transmission: String(car.transmission || "a"),
    mileage,
    city_mpg: cityMpg, // alias for mileage
    highway_mpg: Number(car.highway_mpg) || 0,
    combination_mpg: Number(car.combination_mpg) || cityMpg,
    color: String(car.color || "Metallic Silver"),
    drive: String(car.drive || "fwd"),
    class: String(car.class || "Car"),
    cylinders: Number(car.cylinders) || 4,
    displacement: Number(car.displacement) || 2.0,
    horsepower: Number(car.horsepower) || 180,
    status: car.status || "available",
    description: String(car.description || "").trim(),
    features: Array.isArray(car.features) ? car.features : [],
    images,
    img_url: images[0] || car.img_url || "",
  };
}

/**
 * Reads all stored cars from localStorage.
 */
export function getStoredCars(): StoredCar[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CARS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item, idx) => normalizeCarToStorage(item, idx));
    }
  } catch {
    // Return empty on error
  }
  return [];
}

/**
 * Saves cars array to localStorage.
 */
export function saveStoredCars(cars: StoredCar[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(cars));
  } catch {
    // Fail silently in private browsing
  }
}

/**
 * Finds a car by ID in localStorage.
 */
export function getStoredCarById(id: string): StoredCar | null {
  const cars = getStoredCars();
  return cars.find((c) => c.id === id) || null;
}

/**
 * Ensures the given car is normalized and synchronized into localStorage.
 * Upserts the car if already present or appends it.
 */
export function syncCarToLocalStorage(car: Partial<CarProps>): StoredCar {
  const normalized = normalizeCarToStorage(car);
  if (typeof window === "undefined") return normalized;

  try {
    const existing = getStoredCars();
    const index = existing.findIndex((c) => c.id === normalized.id);
    if (index >= 0) {
      existing[index] = { ...existing[index], ...normalized };
    } else {
      existing.push(normalized);
    }
    saveStoredCars(existing);
  } catch {
    // Ignore storage errors
  }

  return normalized;
}
