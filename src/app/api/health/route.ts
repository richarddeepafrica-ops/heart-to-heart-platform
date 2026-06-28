import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const checkedAt = new Date().toISOString();

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { ok: false, service: "heart-to-heart-platform", database: "not-configured", checkedAt },
      { status: 503 }
    );
  }

  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, service: "heart-to-heart-platform", database: "connected", checkedAt });
  } catch {
    return NextResponse.json(
      { ok: false, service: "heart-to-heart-platform", database: "unavailable", checkedAt },
      { status: 503 }
    );
  }
}
