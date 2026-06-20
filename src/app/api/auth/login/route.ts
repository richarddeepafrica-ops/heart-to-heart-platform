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
  let authenticatedRole = "SUPER_ADMIN";
  const matchesFallbackAdmin =
    email === credentials.email.toLowerCase() &&
    password === credentials.password;

  if (hasDatabaseUrl()) {
    try {
      const user = await db.user.findUnique({ where: { email } });
      const lifecycleRows = user
        ? await db.$queryRawUnsafe<Array<{ active: boolean }>>(`SELECT "active" FROM "User" WHERE "id" = $1 LIMIT 1`, user.id).catch(() => [])
        : [];
      if (lifecycleRows[0]?.active === false) {
        return apiError("This staff account is inactive. Please contact a super admin.", 403);
      }
      if (user && verifyPassword(password, user.passwordHash)) {
        authenticatedEmail = user.email;
        authenticatedRole = user.role;
        await db.$executeRawUnsafe(`UPDATE "User" SET "lastLoginAt" = NOW() WHERE "id" = $1`, user.id).catch(() => null);
      } else if (process.env.NODE_ENV !== "production" && matchesFallbackAdmin) {
        authenticatedEmail = credentials.email;
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production" && matchesFallbackAdmin) {
        authenticatedEmail = credentials.email;
      } else {
      return NextResponse.json(
        { ok: false, message: "Admin login is temporarily unavailable." },
        { status: 503 }
      );
      }
    }
  } else if (matchesFallbackAdmin) {
    authenticatedEmail = credentials.email;
  }

  if (!authenticatedEmail) return apiError("Invalid email or password.", 401);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookie, createAdminSession(authenticatedEmail, authenticatedRole), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
