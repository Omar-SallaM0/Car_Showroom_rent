import { NextResponse } from "next/server";
import { adminSessionCookie, destroyAdminSession } from "@/utils/admin-auth";

export async function POST() {
  await destroyAdminSession();
  const response = NextResponse.json({ success: true });
  response.cookies.set(adminSessionCookie.name, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}