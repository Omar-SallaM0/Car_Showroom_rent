import { Metadata } from "next";
import { CarCard, Navbar, SearchBar, EmptyState } from "@/components";
import CustomFilter from "@/components/CustomFilter";
import { fetchCars } from "@/utils/fetch-cars";
import { fuels, yearsOfProduction } from "@/constants";
import Pagination from "@/components/Pagination";
import CarsPageHeader from "@/components/CarsPageHeader";
import { getCarId } from "@/utils/car-storage";

export const metadata: Metadata = {
  title: "Cars Inventory | أسطول السيارات | Car Showroom",
  description: "Browse all available cars for rent and booking | تصفح جميع السيارات المتاحة للحجز والاستئجار",
};

export default async function CarsPage({ searchParams }: { searchParams: any }) {
  const pageSize = 12;
  const requestedPage = Math.max(1, Number(searchParams?.page) || 1);

  const allCars = await fetchCars({
    manufacturer: searchParams?.manufacturer || "",
    year: Number(searchParams?.year) || 0,
    fuel: searchParams?.fuel || "",
    limit: pageSize,
    model: searchParams?.model || "",
  });

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1;
  const totalPages = Math.ceil((allCars?.length || 0) / pageSize);
  const page = Math.min(requestedPage, totalPages || 1);
  const visibleCars = Array.isArray(allCars)
    ? allCars.slice((page - 1) * pageSize, page * pageSize)
    : [];

  return (
    <main className="overflow-hidden min-h-screen pb-16">
      <Navbar />

      <div className="padding-x py-8 max-width">
        <CarsPageHeader totalCount={allCars?.length || 0} />

        <div className="home__filters mt-4">
          <SearchBar />

          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} />
            <CustomFilter title="year" options={yearsOfProduction} />
          </div>
        </div>

        {!isDataEmpty ? (
          <section id="search-results" className="mt-8">
            <div className="home__cars-wrapper">
              {visibleCars.map((car, index) => (
                <CarCard
                  key={`${getCarId(car, index)}-${index}`}
                  car={car}
                />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} />
          </section>
        ) : (
          <div className="mt-12">
            <EmptyState />
          </div>
        )}
      </div>
    </main>
  );
}
