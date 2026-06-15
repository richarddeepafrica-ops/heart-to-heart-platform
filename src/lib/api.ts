import { NextResponse } from "next/server";

export function apiError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function readPositiveInt(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return Math.round(parsed);
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}
