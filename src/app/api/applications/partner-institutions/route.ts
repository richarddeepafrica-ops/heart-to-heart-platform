import crypto from "crypto";
import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl, readString } from "@/lib/api";
import { db } from "@/lib/db";

type RawDb = {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: unknown[]) => Promise<T>;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid partner institution application.");

  const organization = readString(body.organization);
  const institutionType = readString(body.institutionType);
  const contactName = readString(body.contactName);
  const contactEmail = readString(body.contactEmail);
  const contactPhone = readString(body.contactPhone);
  const county = readString(body.county);
  const website = readString(body.website);
  const proposal = readString(body.proposal);

  if (!organization) return apiError("Institution name is required.");
  if (!institutionType) return apiError("Institution type is required.");
  if (!contactName) return apiError("Contact person is required.");
  if (!contactEmail) return apiError("Contact email is required.");
  if (!proposal) return apiError("Please describe the proposed partnership.");

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      application: { id: `preview-partner-${Date.now()}`, organization, status: "NEW" },
      nextAction: "Application received for preview. Connect DATABASE_URL and run migrations to save applications permanently."
    });
  }

  try {
    const id = `partnerapp_${crypto.randomUUID().replace(/-/g, "")}`;
    const rows = await (db as unknown as RawDb).$queryRawUnsafe<unknown[]>(
      `INSERT INTO "PartnerInstitutionApplication" ("id", "organization", "institutionType", "contactName", "contactEmail", "contactPhone", "county", "website", "proposal", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       RETURNING *`,
      id,
      organization,
      institutionType,
      contactName,
      contactEmail,
      contactPhone || null,
      county || null,
      website || null,
      proposal
    );

    return NextResponse.json({
      ok: true,
      mode: "database",
      application: rows[0],
      nextAction: "Partner institution application received. The admin team will review and contact you."
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Partner application could not be submitted right now." },
      { status: 503 }
    );
  }
}
