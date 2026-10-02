import { NextResponse } from "next/server";
import {
  adminSessionCookie,
  createAdminSession,
  isAdminAccessCodeConfigured,
  validateAdminAccessCode,
} from "@/utils/admin-auth";

const maxAttempts = 5;
const lockoutMs = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }
  }

  if (!isAdminAccessCodeConfigured()) {
    return NextResponse.json({ error: "Admin access is not configured on the server." }, { status: 503 });
  }

  const key = clientKey(request);
  const now = Date.now();
  const current = attempts.get(key);
  if (current && current.resetAt > now && current.count >= maxAttempts) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  let candidate: unknown;
  try {
    candidate = (await request.json()).accessCode;
  } catch {
    return NextResponse.json({ error: "Enter the 8-character admin access code." }, { status: 400 });
  }

  if (!validateAdminAccessCode(candidate)) {
    const count = current && current.resetAt > now ? current.count + 1 : 1;
    attempts.set(key, { count, resetAt: now + lockoutMs });
    return NextResponse.json({ error: "Incorrect admin access code." }, { status: 401 });
  }

  attempts.delete(key);
  try {
    const session = await createAdminSession();
    const response = NextResponse.json({ success: true });
    response.cookies.set(adminSessionCookie.name, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(session.expiresAt),
      maxAge: adminSessionCookie.maxAgeSeconds,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to start an admin session." }, { status: 500 });
  }
}