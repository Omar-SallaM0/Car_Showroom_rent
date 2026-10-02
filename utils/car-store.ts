import { randomUUID } from "crypto";
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import { CarProps, ManagedCar } from "@/types";

const inventoryPath = process.env.CAR_DATA_FILE || path.join(process.cwd(), "data", "cars.json");
const sourceUrl = "https://private-anon-1f2c0378ab-carsapi1.apiary-mock.com/cars";

function normalizeCar(car: CarProps, index: number): ManagedCar {
  const images = car.images?.length ? car.images : car.img_url ? [car.img_url] : [];

  return {
    ...car,
    id: String(car.id || `source-${index}-${car.make}-${car.model}-${car.year}`),
    name: car.name || `${car.make} ${car.model}`,
    images,
    img_url: images[0] || car.img_url || "",
    description: car.description || "",
    features: car.features || [],
    status: car.status || "available",
  };
}

async function writeInventory(cars: ManagedCar[]) {
  await mkdir(path.dirname(inventoryPath), { recursive: true });
  const temporaryPath = `${inventoryPath}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(cars, null, 2), "utf8");
  await rename(temporaryPath, inventoryPath);
}

export async function getAllCars(): Promise<ManagedCar[]> {
  try {
    const stored = await readFile(inventoryPath, "utf8");
    const cars = JSON.parse(stored) as CarProps[];
    return cars.map(normalizeCar);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  const response = await fetch(sourceUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to initialize car inventory: ${response.status}`);
  }

  const sourceCars = (await response.json()) as CarProps[];
  const cars = sourceCars.map(normalizeCar);
  await writeInventory(cars);
  return cars;
}

export async function saveAllCars(cars: ManagedCar[]): Promise<void> {
  await writeInventory(cars);
}