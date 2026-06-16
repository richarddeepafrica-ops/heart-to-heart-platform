import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl, readPositiveInt, readString } from "@/lib/api";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid partnership inquiry.");

  const organization = readString(body.organization);
  const contactName = readString(body.contactName);
  const contactEmail = readString(body.contactEmail);
  const phone = readString(body.phone);
  const interest = readString(body.interest);
  const message = readString(body.message);
  const estimatedValue = readPositiveInt(body.estimatedValue);

  if (!organization) return apiError("Organization is required.");
  if (!contactName) return apiError("Contact person is required.");
  if (!contactEmail) return apiError("Email is required.");
  if (!interest) return apiError("Partnership interest is required.");

  const interestDetails = [interest, phone ? `Phone: ${phone}` : "", message].filter(Boolean).join(" | ");

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      partner: {
        id: `preview-partner-${Date.now()}`,
        organization,
        contactName,
        contactEmail,
        interest: interestDetails,
        estimatedValue: estimatedValue || null,
        pipelineStage: "NEW_INQUIRY"
      },
      nextAction: "Connect DATABASE_URL and run migrations to save partnership inquiries permanently."
    });
  }

  try {
    const partner = await db.corporatePartner.upsert({
      where: { organization },
      create: {
        organization,
        contactName,
        contactEmail,
        interest: interestDetails,
        estimatedValue: estimatedValue || null
      },
      update: {
        contactName,
        contactEmail,
        interest: interestDetails,
        estimatedValue: estimatedValue || null,
        pipelineStage: "NEW_INQUIRY"
      }
    });

    return NextResponse.json({
      ok: true,
      mode: "database",
      partner,
      nextAction: "Partnership inquiry added to the admin pipeline."
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Partnership inquiry could not be sent right now." },
      { status: 503 }
    );
  }
}
