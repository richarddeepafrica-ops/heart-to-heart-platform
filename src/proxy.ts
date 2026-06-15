import { NextRequest, NextResponse } from "next/server";

const adminSessionCookie = "h2h_admin_session";
const protectedApiPrefixes = ["/api/beneficiaries", "/api/event-registrations", "/api/finance", "/api/marketing-campaigns", "/api/reports"];
const protectedApiMutationPrefixes = ["/api/campaigns"];

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
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isProtectedApi =
    protectedApiPrefixes.some((prefix) => pathname.startsWith(prefix)) ||
    (request.method !== "GET" && protectedApiMutationPrefixes.some((prefix) => pathname.startsWith(prefix)));

  if (!isAdminPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const isAuthenticated = await hasValidSession(request.cookies.get(adminSessionCookie)?.value);
  if (isAuthenticated) return NextResponse.next();

  if (isProtectedApi) {
    return NextResponse.json({ ok: false, message: "Admin login required." }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/beneficiaries/:path*", "/api/event-registrations/:path*", "/api/finance/:path*", "/api/campaigns/:path*", "/api/marketing-campaigns/:path*", "/api/reports/:path*"]
};
