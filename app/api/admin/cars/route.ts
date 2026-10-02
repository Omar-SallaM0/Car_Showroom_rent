import { NextResponse } from "next/server";
import { hasAdminSession } from "@/utils/admin-auth";
import { parseManagedCar } from "@/utils/admin-cars";
import { getAllCars, saveAllCars } from "@/utils/car-store";

export async function GET(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Forbidden: Admin session required" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const hasPaginationParams =
      searchParams.has("page") ||
      searchParams.has("pageSize") ||
      searchParams.has("search") ||
      searchParams.has("sortBy") ||
      searchParams.has("status");

    const allCars = await getAllCars();

    // If caller explicitly requested all without any query params (legacy fallback)
    if (!hasPaginationParams && searchParams.get("all") === "true") {
      return NextResponse.json(allCars);
    }

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") || searchParams.get("limit") || "12", 10))
    );
    const search = (searchParams.get("search") || searchParams.get("q") || "").trim().toLowerCase();
    const status = (searchParams.get("status") || "all").trim().toLowerCase();
    const sortBy = (searchParams.get("sortBy") || "").trim();
    const sortOrder = (searchParams.get("sortOrder") || "asc").trim().toLowerCase();

    // 1. Overall counts before search/status filter
    const counts = {
      total: allCars.length,
      available: allCars.filter((c) => c.status === "available").length,
      rented: allCars.filter((c) => c.status === "rented").length,
      maintenance: allCars.filter((c) => c.status === "maintenance").length,
    };

    // 2. Filter by status
    let filtered = allCars;
    if (status && status !== "all") {
      filtered = filtered.filter((c) => (c.status || "available").toLowerCase() === status);
    }

    // 3. Server-side search across brand/make, model, name, year, class, description
    if (search) {
      filtered = filtered.filter((c) => {
        const brand = (c.brand || c.make || "").toLowerCase();
        const model = (c.model || "").toLowerCase();
        const name = (c.name || "").toLowerCase();
        const year = String(c.year || "");
        const vehicleClass = (c.class || "").toLowerCase();
        const description = (c.description || "").toLowerCase();
        return (
          brand.includes(search) ||
          model.includes(search) ||
          name.includes(search) ||
          year.includes(search) ||
          vehicleClass.includes(search) ||
          description.includes(search)
        );
      });
    }

    // 4. Server-side sorting
    if (sortBy) {
      const order = sortOrder === "desc" ? -1 : 1;
      filtered.sort((a, b) => {
        if (sortBy === "price") {
          return ((Number(a.price) || 0) - (Number(b.price) || 0)) * order;
        }
        if (sortBy === "year") {
          return ((Number(a.year) || 0) - (Number(b.year) || 0)) * order;
        }
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
        if (sortBy === "name") {
          const aN = (a.name || "").toLowerCase();
          const bN = (b.name || "").toLowerCase();
          return aN.localeCompare(bN) * order;
        }
        return 0;
      });
    }

    // 5. Server-side pagination
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
      counts,
    });
  } catch (error) {
    console.error("Unable to load inventory:", error);
    return NextResponse.json({ error: "Unable to load inventory" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const car = parseManagedCar(await request.json());
    if (!car) {
      return NextResponse.json({ error: "Please provide valid car details" }, { status: 400 });
    }

    const cars = await getAllCars();
    cars.unshift(car);
    await saveAllCars(cars);
    return NextResponse.json(car, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create car" }, { status: 500 });
  }
}