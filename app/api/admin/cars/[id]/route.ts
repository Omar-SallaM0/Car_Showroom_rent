import { NextResponse } from "next/server";
import { hasAdminSession } from "@/utils/admin-auth";
import { parseManagedCar } from "@/utils/admin-cars";
import { getAllCars, saveAllCars } from "@/utils/car-store";
import { getCarId } from "@/utils/car-storage";

interface RouteContext {
  params: { id: string };
}

export async function GET(_request: Request, { params }: RouteContext) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Forbidden: Admin session required" }, { status: 403 });
  }

  try {
    const rawId = decodeURIComponent(params.id || "").trim();
    const targetId = rawId.toLowerCase();
    const cars = await getAllCars();

    const car = cars.find((c) => {
      const id1 = String(c.id || "").toLowerCase();
      const id2 = getCarId(c).toLowerCase();
      return id1 === targetId || id2 === targetId;
    });

    if (!car) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error("Error retrieving vehicle:", error);
    return NextResponse.json({ error: "Unable to retrieve vehicle" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Forbidden: Admin session required" }, { status: 403 });
  }

  try {
    const rawId = decodeURIComponent(params.id || "").trim();
    const targetId = rawId.toLowerCase();
    const cars = await getAllCars();

    const index = cars.findIndex((c) => {
      const id1 = String(c.id || "").toLowerCase();
      const id2 = getCarId(c).toLowerCase();
      return id1 === targetId || id2 === targetId;
    });

    if (index < 0) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    const matchedCarId = String(cars[index].id || rawId);
    const body = await request.json();

    const updatedCar = parseManagedCar(body, matchedCarId);
    if (!updatedCar) {
      return NextResponse.json({ error: "Please provide valid vehicle details" }, { status: 400 });
    }

    cars[index] = updatedCar;
    await saveAllCars(cars);
    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json({ error: "Unable to update vehicle" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Forbidden: Admin session required" }, { status: 403 });
  }

  try {
    const rawId = decodeURIComponent(params.id || "").trim();
    const targetId = rawId.toLowerCase();
    const cars = await getAllCars();

    const updatedCars = cars.filter((c) => {
      const id1 = String(c.id || "").toLowerCase();
      const id2 = getCarId(c).toLowerCase();
      return id1 !== targetId && id2 !== targetId;
    });

    if (updatedCars.length === cars.length) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    await saveAllCars(updatedCars);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return NextResponse.json({ error: "Unable to delete vehicle" }, { status: 500 });
  }
}