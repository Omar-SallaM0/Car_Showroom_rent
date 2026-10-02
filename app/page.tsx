import { CarCard, Hero, Navbar, SearchBar, CatalogueHeader, EmptyState } from "@/components";
import CustomFilter from "./../components/CustomFilter";
import { fetchCars } from "@/utils/fetch-cars";
import { fuels, yearsOfProduction } from "@/constants";
import Pagination from "@/components/Pagination";
import ViewAllCarsButton from "@/components/ViewAllCarsButton";
import { getCarId } from "@/utils/car-storage";

export default async function Home({ searchParams }: { searchParams: any }) {
  const pageSize = 10;
  const requestedPage = Math.max(1, Number(searchParams.page) || 1);

  const allCars = await fetchCars({
    manufacturer: searchParams.manufacturer || "",
    year: Number(searchParams.year) || 0,
    fuel: searchParams.fuel || "",
    limit: pageSize,
    model: searchParams.model || "",
  });
  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;
  const totalPages = Math.ceil((allCars?.length || 0) / pageSize);
  const page = Math.min(requestedPage, totalPages || 1);
  const visibleCars = Array.isArray(allCars)
    ? allCars.slice((page - 1) * pageSize, page * pageSize)
    : [];

  return (
    <main className="overflow-hidden min-h-screen">
      <Navbar />
      <Hero />

      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <CatalogueHeader />

          <div className="home__filters">
            <SearchBar />

            <div className="home__filter-container">
              <CustomFilter title="fuel" options={fuels} />
              <CustomFilter title="year" options={yearsOfProduction} />
            </div>
          </div>
        </div>

        {!isDataEmpty ? (
          <section id="search-results">
            <div className="home__cars-wrapper">
              {visibleCars.map((car, index) => (
                <CarCard
                  key={`${getCarId(car, index)}-${index}`}
                  car={{ ...car, price: Math.floor(Number(car.price || 0) / 365) }}
                />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} />
            <ViewAllCarsButton />
          </section>
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
  );
}
