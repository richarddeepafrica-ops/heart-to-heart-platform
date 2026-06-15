import { ConsentStatus } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl, readString } from "@/lib/api";
import { db } from "@/lib/db";

type BeneficiaryRouteContext = {
  params: Promise<unknown>;
};

const consentStatuses = new Set<string>(Object.values(ConsentStatus));

async function readSlug(context: BeneficiaryRouteContext) {
  const params = await context.params;
  return typeof params === "object" && params !== null && "slug" in params
    ? readString((params as { slug?: unknown }).slug)
    : "";
}

export async function PATCH(request: NextRequest, context: BeneficiaryRouteContext) {
  const slug = await readSlug(context);
  if (!slug) return apiError("Beneficiary slug is required.");

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid beneficiary update request.");

  const consentStatus = readString(body.consentStatus).toUpperCase();
  if (!consentStatuses.has(consentStatus)) return apiError("Unsupported beneficiary status.");

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      beneficiary: { slug, consentStatus },
      nextAction: "Connect DATABASE_URL and run migrations to save beneficiary edits permanently."
    });
  }

  try {
    const beneficiary = await db.beneficiary.update({
      where: { slug },
      data: { consentStatus: consentStatus as ConsentStatus }
    });

    return NextResponse.json({
      ok: true,
      mode: "database",
      beneficiary: {
        id: beneficiary.id,
        slug: beneficiary.slug,
        consentStatus: beneficiary.consentStatus
      }
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Beneficiary status could not be updated right now." },
      { status: 503 }
    );
  }
}
