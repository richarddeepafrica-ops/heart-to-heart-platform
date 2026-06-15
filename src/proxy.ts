import { NextRequest, NextResponse } from "next/server";

const adminSessionCookie = "h2h_admin_session";

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string) {
  const encoder = new TextEncoder();
  const secret = process.env.ADMIN_SESSION_SECRET || "change-this-secret-before-production";
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
}

async function hasValidSession(token?: string) {
  if (!token) return false;
  const parts = token.split(":");
  if (parts.length !== 3) return false;

  const [email, expiresAtRaw, signature] = parts;
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  return signature === await sign(`${email}:${expiresAtRaw}`);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const isAuthenticated = await hasValidSession(request.cookies.get(adminSessionCookie)?.value);
  if (isAuthenticated) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"]
};
