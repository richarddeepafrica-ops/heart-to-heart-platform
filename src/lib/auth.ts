import crypto from "crypto";

export const adminSessionCookie = "h2h_admin_session";
const sessionDurationMs = 1000 * 60 * 60 * 8;

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "change-this-secret-before-production";
}

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || "admin@hearttoheart.local",
    password: process.env.ADMIN_PASSWORD || "change-this-password"
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

export function createAdminSession(email: string) {
  const expiresAt = Date.now() + sessionDurationMs;
  const payload = `${email}:${expiresAt}`;
  return `${payload}:${sign(payload)}`;
}

export function verifyAdminSession(token?: string) {
  if (!token) return null;

  const parts = token.split(":");
  if (parts.length !== 3) return null;

  const [email, expiresAtRaw, signature] = parts;
  const payload = `${email}:${expiresAtRaw}`;
  const expected = sign(payload);
  const expiresAt = Number(expiresAtRaw);

  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  return { email, expiresAt };
}
