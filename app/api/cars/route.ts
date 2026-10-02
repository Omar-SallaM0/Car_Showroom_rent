import { NextResponse } from "next/server";
import { getAllCars } from "@/utils/car-store";
import { getCarId } from "@/utils/car-storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");
    const allCars = await getAllCars();

    if (idsParam) {
      const targetIds = new Set(idsParam.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
      const filtered = allCars.filter((car) => {
        const id1 = String(car.id || "").toLowerCase();
        const id2 = getCarId(car).toLowerCase();
        return targetIds.has(id1) || targetIds.has(id2);
      });
      return NextResponse.json(filtered);
    }

    return NextResponse.json(allCars);
  } catch (error) {
    return NextResponse.json({ error: "Unable to retrieve cars" }, { status: 500 });
  }
}
