import { NextResponse } from "next/server";
import { adminSessionCookie, createAdminSession, getAdminCredentials } from "@/lib/auth";
import { apiError, readString } from "@/lib/api";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid login request.");

  const email = readString(body.email).toLowerCase();
  const password = readString(body.password);
  const credentials = getAdminCredentials();

  if (email !== credentials.email.toLowerCase() || password !== credentials.password) {
    return apiError("Invalid email or password.", 401);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookie, createAdminSession(credentials.email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
