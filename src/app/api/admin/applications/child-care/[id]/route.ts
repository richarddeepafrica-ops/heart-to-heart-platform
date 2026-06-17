import crypto from "crypto";
import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl, readString } from "@/lib/api";
import { db } from "@/lib/db";
import { slugify } from "@/lib/publishing-data";

type RouteContext = { params: Promise<{ id: string }> };
type RawDb = { $queryRawUnsafe: <T = unknown>(query: string, ...values: unknown[]) => Promise<T> };

const statuses = new Set(["NEW", "IN_REVIEW", "APPROVED", "DECLINED"]);

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!id) return apiError("Application id is required.");
  if (!body) return apiError("Invalid application update.");

  const status = readString(body.status).toUpperCase();
  const adminNotes = readString(body.adminNotes);
  if (!statuses.has(status)) return apiError("Unsupported application status.");

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ ok: true, mode: "preview", application: { id, status }, nextAction: "Preview application updated." });
  }

  try {
    const rawDb = db as unknown as RawDb;
    const applications = await rawDb.$queryRawUnsafe<Array<{ childName: string; childAge: number | null; diagnosis: string; estimatedNeed: number | null; story: string; beneficiaryId: string | null }>>(
      `SELECT "childName", "childAge", "diagnosis", "estimatedNeed", "story", "beneficiaryId" FROM "ChildCareApplication" WHERE "id" = $1 LIMIT 1`,
      id
    );
    const application = applications[0];
    if (!application) return apiError("Application was not found.", 404);

    let beneficiaryId = application.beneficiaryId;
    if (status === "APPROVED" && !beneficiaryId) {
      beneficiaryId = `beneficiary_${crypto.randomUUID().replace(/-/g, "")}`;
      const baseSlug = slugify(application.childName) || "child-application";
      const slug = `${baseSlug}-${Date.now().toString(36)}`;
      await rawDb.$queryRawUnsafe(
        `INSERT INTO "Beneficiary" ("id", "slug", "publicName", "privateName", "age", "diagnosis", "storySummary", "fundingGoal", "consentStatus", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'GUARDIAN_PENDING', NOW())`,
        beneficiaryId,
        slug,
        application.childName.split(" ")[0] || "Child",
        application.childName,
        application.childAge,
        application.diagnosis,
        application.story,
        application.estimatedNeed || 500000
      );
    }

    const rows = await rawDb.$queryRawUnsafe<unknown[]>(
      `UPDATE "ChildCareApplication" SET "status" = $1, "adminNotes" = $2, "beneficiaryId" = $3, "updatedAt" = NOW() WHERE "id" = $4 RETURNING *`,
      status,
      adminNotes || null,
      beneficiaryId || null,
      id
    );

    return NextResponse.json({
      ok: true,
      mode: "database",
      application: rows[0],
      nextAction: status === "APPROVED" ? "Application approved and private beneficiary review profile created." : "Application status updated."
    });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Application could not be updated right now." }, { status: 503 });
  }
}
