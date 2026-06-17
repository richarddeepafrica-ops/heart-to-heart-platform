import crypto from "crypto";
import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl, readPositiveInt, readString } from "@/lib/api";
import { db } from "@/lib/db";

type RawDb = {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: unknown[]) => Promise<T>;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid child care application.");

  const childName = readString(body.childName);
  const childAge = readPositiveInt(body.childAge);
  const guardianName = readString(body.guardianName);
  const guardianPhone = readString(body.guardianPhone);
  const guardianEmail = readString(body.guardianEmail);
  const county = readString(body.county);
  const diagnosis = readString(body.diagnosis);
  const hospital = readString(body.hospital);
  const estimatedNeed = readPositiveInt(body.estimatedNeed);
  const story = readString(body.story);

  if (!childName) return apiError("Child name is required.");
  if (!guardianName) return apiError("Parent or guardian name is required.");
  if (!guardianPhone) return apiError("Parent or guardian phone is required.");
  if (!diagnosis) return apiError("Medical condition or diagnosis is required.");
  if (!story) return apiError("Please describe the family's situation and support needed.");

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      application: { id: `preview-child-${Date.now()}`, childName, guardianName, status: "NEW" },
      nextAction: "Application received for preview. Connect DATABASE_URL and run migrations to save applications permanently."
    });
  }

  try {
    const id = `childapp_${crypto.randomUUID().replace(/-/g, "")}`;
    const rows = await (db as unknown as RawDb).$queryRawUnsafe<unknown[]>(
      `INSERT INTO "ChildCareApplication" ("id", "childName", "childAge", "guardianName", "guardianPhone", "guardianEmail", "county", "diagnosis", "hospital", "estimatedNeed", "story", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
       RETURNING *`,
      id,
      childName,
      childAge || null,
      guardianName,
      guardianPhone,
      guardianEmail || null,
      county || null,
      diagnosis,
      hospital || null,
      estimatedNeed || null,
      story
    );

    return NextResponse.json({
      ok: true,
      mode: "database",
      application: rows[0],
      nextAction: "Application received. The foundation team will review and contact the parent or guardian."
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Application could not be submitted right now." },
      { status: 503 }
    );
  }
}
