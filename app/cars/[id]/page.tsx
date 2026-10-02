import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import CarDetailsView from "@/components/CarDetailsView";
import { getAllCars } from "@/utils/car-store";
import { getCarId } from "@/utils/car-storage";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const decodedId = decodeURIComponent(params.id);
  let title = "Car Details | Car Showroom";

  try {
    const cars = await getAllCars();
    const targetId = decodedId.toLowerCase();
    const found = cars.find(
      (c) => String(c.id).toLowerCase() === targetId || getCarId(c).toLowerCase() === targetId
    );
    if (found) {
      title = `${found.name || `${found.make} ${found.model} ${found.year}`} | Car Showroom`;
    }
  } catch {}

  return {
    title,
    description: "Complete vehicle details, specifications, and image gallery.",
  };
}

export default async function CarDetailsPage({ params }: { params: { id: string } }) {
  const decodedId = decodeURIComponent(params.id);
  let car = null;

  try {
    const cars = await getAllCars();
    const targetId = decodedId.toLowerCase();
    car =
      cars.find(
        (c) => String(c.id).toLowerCase() === targetId || getCarId(c).toLowerCase() === targetId
      ) || null;
  } catch (err) {
    // Client hydration fallback
  }

  return (
    <main className="overflow-hidden min-h-screen pb-16">
      <Navbar />
      <CarDetailsView initialCar={car} carId={decodedId} />
    </main>
  );
}
