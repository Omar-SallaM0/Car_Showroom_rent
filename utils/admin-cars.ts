import { randomUUID } from "crypto";
import { CarStatus, ManagedCar } from "@/types";

const statuses: CarStatus[] = ["available", "rented", "maintenance"];

function asText(value: unknown, maximumLength = 500): string {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

function asNumber(value: unknown, fallback = 0): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function asLines(value: unknown, maximumItems = 20): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => asText(item)).filter(Boolean).slice(0, maximumItems);
  }

  return typeof value === "string"
    ? value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean).slice(0, maximumItems)
    : [];
}

function isSafeImageUrl(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) {
    return true;
  }
  if (value.startsWith("data:image/")) {
    return true;
  }

  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export function parseManagedCar(input: unknown, id: string = randomUUID()): ManagedCar | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const value = input as Record<string, unknown>;
  const name = asText(value.name, 120);
  const make = asText(value.make, 80);
  const model = asText(value.model, 100);
  const year = asNumber(value.year);
  const price = asNumber(value.price, -1);
  const status = statuses.includes(value.status as CarStatus) ? value.status as CarStatus : null;
  const images = asLines(value.images).filter(isSafeImageUrl);

  if (!name || !make || !model || year < 1886 || year > new Date().getFullYear() + 2 || price < 0 || !status) {
    return null;
  }

  const cityMpg = asNumber(value.city_mpg);

  return {
    id,
    name,
    make,
    model,
    year,
    price,
    images,
    img_url: images[0] || "",
    description: asText(value.description, 2000),
    features: asLines(value.features),
    status,
    city_mpg: cityMpg,
    class: asText(value.class, 80) || "Car",
    combination_mpg: asNumber(value.combination_mpg, cityMpg),
    cylinders: asNumber(value.cylinders),
    displacement: asNumber(value.displacement),
    drive: asText(value.drive, 40),
    fuel_type: asText(value.fuel_type, 40),
    highway_mpg: asNumber(value.highway_mpg),
    transmission: asText(value.transmission, 40),
    color: asText(value.color, 50) || "Metallic Silver",
    horsepower: asNumber(value.horsepower),
  };
}