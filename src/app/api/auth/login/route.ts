import { NextResponse } from "next/server";
import { adminSessionCookie, createAdminSession, getAdminConfigIssue, getAdminCredentials, verifyPassword } from "@/lib/auth";
import { apiError, hasDatabaseUrl, readString } from "@/lib/api";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid login request.");

  const email = readString(body.email).toLowerCase();
  const password = readString(body.password);
  const configIssue = getAdminConfigIssue();
  if (configIssue) {
    return NextResponse.json({ ok: false, message: configIssue }, { status: 503 });
  }

  const credentials = getAdminCredentials();
  let authenticatedEmail = "";

  if (hasDatabaseUrl()) {
    try {
      const user = await db.user.findUnique({ where: { email } });
      if (user && verifyPassword(password, user.passwordHash)) {
        authenticatedEmail = user.email;
      }
    } catch (error) {
      return NextResponse.json(
        { ok: false, message: "Admin login is temporarily unavailable." },
        { status: 503 }
      );
    }
  } else if (email === credentials.email.toLowerCase() && password === credentials.password) {
    authenticatedEmail = credentials.email;
  }

  if (!authenticatedEmail) return apiError("Invalid email or password.", 401);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookie, createAdminSession(authenticatedEmail), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
