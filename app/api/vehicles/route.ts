import { NextResponse } from "next/server";
import { getAllCars } from "@/utils/car-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") || searchParams.get("limit") || "12", 10))
    );
    const search = (searchParams.get("search") || searchParams.get("q") || "").trim().toLowerCase();
    const status = (searchParams.get("status") || "all").trim().toLowerCase();
    const sortBy = (searchParams.get("sortBy") || "").trim();
    const sortOrder = (searchParams.get("sortOrder") || "asc").trim().toLowerCase();

    const allCars = await getAllCars();

    let filtered = allCars;
    if (status && status !== "all") {
      filtered = filtered.filter((c) => (c.status || "available").toLowerCase() === status);
    }

    if (search) {
      filtered = filtered.filter((c) => {
        const brand = (c.brand || c.make || "").toLowerCase();
        const model = (c.model || "").toLowerCase();
        const name = (c.name || "").toLowerCase();
        const year = String(c.year || "");
        const vehicleClass = (c.class || "").toLowerCase();
        return (
          brand.includes(search) ||
          model.includes(search) ||
          name.includes(search) ||
          year.includes(search) ||
          vehicleClass.includes(search)
        );
      });
    }

    if (sortBy) {
      const order = sortOrder === "desc" ? -1 : 1;
      filtered.sort((a, b) => {
        if (sortBy === "price") return ((Number(a.price) || 0) - (Number(b.price) || 0)) * order;
        if (sortBy === "year") return ((Number(a.year) || 0) - (Number(b.year) || 0)) * order;
        if (sortBy === "mileage") {
          const aM = Number(a.mileage ?? a.city_mpg) || 0;
          const bM = Number(b.mileage ?? b.city_mpg) || 0;
          return (aM - bM) * order;
        }
        if (sortBy === "brand" || sortBy === "make") {
          const aB = (a.brand || a.make || "").toLowerCase();
          const bB = (b.brand || b.make || "").toLowerCase();
          return aB.localeCompare(bB) * order;
        }
        if (sortBy === "model") {
          const aM = (a.model || "").toLowerCase();
          const bM = (b.model || "").toLowerCase();
          return aM.localeCompare(bM) * order;
        }
        return 0;
      });
    }

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedCars = filtered.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      cars: paginatedCars,
      pagination: {
        page: currentPage,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Unable to retrieve vehicles" }, { status: 500 });
  }
}
