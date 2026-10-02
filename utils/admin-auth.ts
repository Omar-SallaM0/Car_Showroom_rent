import { createHash, randomBytes, randomUUID, timingSafeEqual } from "crypto";
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieName = "showroom_admin_session";
const sessionDurationMs = 12 * 60 * 60 * 1000;
const sessionsPath = path.join(process.cwd(), "data", "admin-sessions.json");

interface AdminSession {
  tokenHash: string;
  expiresAt: number;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function readSessions(): Promise<AdminSession[]> {
  try {
    return JSON.parse(await readFile(sessionsPath, "utf8")) as AdminSession[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeSessions(sessions: AdminSession[]): Promise<void> {
  await mkdir(path.dirname(sessionsPath), { recursive: true });
  const temporaryPath = `${sessionsPath}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(sessions), { encoding: "utf8", mode: 0o600 });
  await rename(temporaryPath, sessionsPath);
}

export function isAdminAccessCodeConfigured(): boolean {
  return /^[A-Za-z0-9]{8}$/.test(process.env.ADMIN_ACCESS_CODE || "");
}

export function validateAdminAccessCode(candidate: unknown): boolean {
  const configuredCode = process.env.ADMIN_ACCESS_CODE || "";
  if (!/^[A-Za-z0-9]{8}$/.test(configuredCode) || typeof candidate !== "string" || !/^[A-Za-z0-9]{8}$/.test(candidate)) {
    return false;
  }

  return timingSafeEqual(Buffer.from(configuredCode), Buffer.from(candidate));
}

export async function createAdminSession(): Promise<{ token: string; expiresAt: number }> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = Date.now() + sessionDurationMs;
  const currentSessions = (await readSessions()).filter((session) => session.expiresAt > Date.now());
  currentSessions.push({ tokenHash: hashToken(token), expiresAt });
  await writeSessions(currentSessions);
  return { token, expiresAt };
}

export async function hasAdminSession(): Promise<boolean> {
  const token = cookies().get(cookieName)?.value;
  if (!token) return false;

  const sessions = await readSessions();
  const tokenHash = hashToken(token);
  const session = sessions.find((item) => item.tokenHash === tokenHash);
  if (!session) return false;
  if (session.expiresAt <= Date.now()) {
    await writeSessions(sessions.filter((item) => item.tokenHash !== tokenHash));
    return false;
  }

  return true;
}

export async function destroyAdminSession(): Promise<void> {
  const token = cookies().get(cookieName)?.value;
  if (!token) return;

  const tokenHash = hashToken(token);
  const sessions = await readSessions();
  await writeSessions(sessions.filter((session) => session.tokenHash !== tokenHash));
}

export async function requireAdminPage(): Promise<void> {
  if (!(await hasAdminSession())) redirect("/admin/login");
}

export const adminSessionCookie = {
  name: cookieName,
  maxAgeSeconds: sessionDurationMs / 1000,
};
