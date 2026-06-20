import { NextRequest, NextResponse } from "next/server";
import { canAccessAdminPath, canAccessProtectedApi, normalizeAdminRole } from "@/lib/admin-permissions";

const adminSessionCookie = "h2h_admin_session";
const protectedApiPrefixes = ["/api/admin", "/api/beneficiaries", "/api/event-registrations", "/api/finance", "/api/marketing-campaigns", "/api/reports"];
const protectedApiMutationPrefixes = ["/api/campaigns"];
const developmentSessionSecret = "change-this-secret-before-production";

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string) {
  const encoder = new TextEncoder();
  const secret = process.env.ADMIN_SESSION_SECRET || developmentSessionSecret;
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
}

async function readValidSession(token?: string) {
  if (!token) return null;
  if (
    process.env.NODE_ENV === "production" &&
    (!process.env.ADMIN_SESSION_SECRET ||
      process.env.ADMIN_SESSION_SECRET === developmentSessionSecret ||
      process.env.ADMIN_SESSION_SECRET.length < 32)
  ) {
    return null;
  }

  const trimmedToken = token.trim().replace(/^"|"$/g, "");
  let normalizedToken = trimmedToken;
  try {
    normalizedToken = decodeURIComponent(trimmedToken);
  } catch {
    normalizedToken = trimmedToken;
  }

  const parts = normalizedToken.split(":");
  if (parts.length !== 3 && parts.length !== 4) return null;

  const [email, roleOrExpiresAt, expiresAtOrSignature, maybeSignature] = parts;
  const hasRole = parts.length === 4;
  const role = hasRole ? normalizeAdminRole(roleOrExpiresAt) : "SUPER_ADMIN";
  const expiresAtRaw = hasRole ? expiresAtOrSignature : roleOrExpiresAt;
  const signature = hasRole ? maybeSignature : expiresAtOrSignature;
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;

  const payload = hasRole ? `${email}:${role}:${expiresAtRaw}` : `${email}:${expiresAtRaw}`;
  const valid = signature === await sign(payload);
  return valid ? { email, role, expiresAt } : null;
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

  const session = await readValidSession(request.cookies.get(adminSessionCookie)?.value);
  if (session) {
    if (isAdminPage && !canAccessAdminPath(session.role, pathname)) {
      const forbiddenUrl = request.nextUrl.clone();
      forbiddenUrl.pathname = "/admin";
      forbiddenUrl.searchParams.set("access", "denied");
      return NextResponse.redirect(forbiddenUrl);
    }

    if (isProtectedApi && !canAccessProtectedApi(session.role, pathname, request.method)) {
      return NextResponse.json({ ok: false, message: "Your staff role does not allow this action." }, { status: 403 });
    }

    return NextResponse.next();
  }

  if (isProtectedApi) {
    return NextResponse.json({ ok: false, message: "Admin login required." }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/beneficiaries/:path*", "/api/event-registrations/:path*", "/api/finance/:path*", "/api/campaigns/:path*", "/api/marketing-campaigns/:path*", "/api/reports/:path*"]
};
