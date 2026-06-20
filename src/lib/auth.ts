import crypto from "crypto";
import { normalizeAdminRole, type AdminRole } from "@/lib/admin-permissions";

export const adminSessionCookie = "h2h_admin_session";
const sessionDurationMs = 1000 * 60 * 60 * 8;
const developmentSessionSecret = "change-this-secret-before-production";
const developmentAdminEmail = "admin@hearttoheart.local";
const developmentAdminPassword = "change-this-password";

export function getAdminConfigIssue() {
  if (process.env.NODE_ENV !== "production") return "";

  if (!process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET === developmentSessionSecret) {
    return "ADMIN_SESSION_SECRET must be set to a unique production value.";
  }

  if (process.env.ADMIN_SESSION_SECRET.length < 32) {
    return "ADMIN_SESSION_SECRET must be at least 32 characters.";
  }

  if (!process.env.DATABASE_URL) {
    return "DATABASE_URL must be configured for production admin login.";
  }

  return "";
}

function getSessionSecret() {
  const issue = getAdminConfigIssue();
  if (issue) throw new Error(issue);
  return process.env.ADMIN_SESSION_SECRET || developmentSessionSecret;
}

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || developmentAdminEmail,
    password: process.env.ADMIN_PASSWORD || developmentAdminPassword
  };
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, passwordHash?: string | null) {
  if (!passwordHash) return false;

  const [salt, storedHash] = passwordHash.split(":");
  if (!salt || !storedHash) return false;

  const hash = crypto.scryptSync(password, salt, 64);
  const stored = Buffer.from(storedHash, "hex");

  return stored.length === hash.length && crypto.timingSafeEqual(stored, hash);
}

export function createAdminSession(email: string, role: string = "SUPER_ADMIN") {
  const expiresAt = Date.now() + sessionDurationMs;
  const sessionRole = normalizeAdminRole(role);
  const payload = `${email}:${sessionRole}:${expiresAt}`;
  return `${payload}:${sign(payload)}`;
}

function normalizeSessionToken(token: string) {
  const trimmed = token.trim().replace(/^"|"$/g, "");

  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

export function verifyAdminSession(token?: string) {
  if (!token) return null;
  if (getAdminConfigIssue()) return null;

  const parts = normalizeSessionToken(token).split(":");
  if (parts.length !== 3 && parts.length !== 4) return null;

  const [email, roleOrExpiresAt, expiresAtOrSignature, maybeSignature] = parts;
  const hasRole = parts.length === 4;
  const role = hasRole ? normalizeAdminRole(roleOrExpiresAt) : "SUPER_ADMIN";
  const expiresAtRaw = hasRole ? expiresAtOrSignature : roleOrExpiresAt;
  const signature = hasRole ? maybeSignature : expiresAtOrSignature;
  const payload = hasRole ? `${email}:${role}:${expiresAtRaw}` : `${email}:${expiresAtRaw}`;

  const expected = sign(payload);
  const expiresAt = Number(expiresAtRaw);

  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  return { email, role: role as AdminRole, expiresAt };
}
