import crypto from "crypto";
import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl, readString } from "@/lib/api";
import { db } from "@/lib/db";
import { writeAuditLog } from "@/lib/admin-system";

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
    const applications = await rawDb.$queryRawUnsafe<Array<{ organization: string; contactName: string; contactEmail: string; institutionType: string; proposal: string; partnerId: string | null }>>(
      `SELECT "organization", "contactName", "contactEmail", "institutionType", "proposal", "partnerId" FROM "PartnerInstitutionApplication" WHERE "id" = $1 LIMIT 1`,
      id
    );
    const application = applications[0];
    if (!application) return apiError("Application was not found.", 404);

    let partnerId = application.partnerId;
    if (status === "APPROVED" && !partnerId) {
      partnerId = `partner_${crypto.randomUUID().replace(/-/g, "")}`;
      await rawDb.$queryRawUnsafe(
        `INSERT INTO "CorporatePartner" ("id", "organization", "contactName", "contactEmail", "interest", "pipelineStage", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, 'ACTIVE', NOW())
         ON CONFLICT ("organization") DO UPDATE SET "contactName" = EXCLUDED."contactName", "contactEmail" = EXCLUDED."contactEmail", "interest" = EXCLUDED."interest", "pipelineStage" = 'ACTIVE', "updatedAt" = NOW()`,
        partnerId,
        application.organization,
        application.contactName,
        application.contactEmail,
        `${application.institutionType}: ${application.proposal}`
      );
    }

    const rows = await rawDb.$queryRawUnsafe<unknown[]>(
      `UPDATE "PartnerInstitutionApplication" SET "status" = $1, "adminNotes" = $2, "partnerId" = $3, "updatedAt" = NOW() WHERE "id" = $4 RETURNING *`,
      status,
      adminNotes || null,
      partnerId || null,
      id
    );
    await writeAuditLog({
      action: "UPDATE_PARTNER_APPLICATION",
      entityType: "PartnerInstitutionApplication",
      entityId: id,
      metadata: { status, partnerId: partnerId || null, hasAdminNotes: Boolean(adminNotes) }
    });

    return NextResponse.json({
      ok: true,
      mode: "database",
      application: rows[0],
      nextAction: status === "APPROVED" ? "Institution approved and added to the partner list." : "Application status updated."
    });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Partner application could not be updated right now." }, { status: 503 });
  }
}
