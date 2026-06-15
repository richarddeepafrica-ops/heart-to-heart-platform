import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl, readPositiveInt, readString } from "@/lib/api";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid donation request.");

  const amount = readPositiveInt(body.amount);
  const name = readString(body.name) || "Anonymous donor";
  const email = readString(body.email);
  const phone = readString(body.phone);
  const campaignSlug = readString(body.campaignSlug);
  const method = readString(body.method).toUpperCase() || "MPESA";

  if (amount < 100) return apiError("Donation amount must be at least KES 100.");
  if (!["MPESA", "CARD", "BANK_TRANSFER", "CASH"].includes(method)) {
    return apiError("Unsupported payment method.");
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      donation: {
        id: `preview-${Date.now()}`,
        amount,
        currency: "KES",
        method,
        status: "PENDING",
        donorName: name
      },
      nextAction: "Connect DATABASE_URL and payment provider credentials to process live gifts."
    });
  }

  try {
    const campaign = campaignSlug
      ? await db.campaign.findUnique({ where: { slug: campaignSlug } })
      : null;

    const donor = await db.donor.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        isAnonymous: Boolean(body.isAnonymous)
      }
    });

    const donation = await db.donation.create({
      data: {
        amount,
        method: method as "MPESA" | "CARD" | "BANK_TRANSFER" | "CASH",
        donorId: donor.id,
        campaignId: campaign?.id,
        source: readString(body.source) || "website"
      }
    });

    await db.paymentTransaction.create({
      data: {
        donationId: donation.id,
        provider: method,
        amount
      }
    });

    return NextResponse.json({
      ok: true,
      donation: {
        id: donation.id,
        amount: donation.amount,
        currency: donation.currency,
        method: donation.method,
        status: donation.status
      },
      nextAction: method === "MPESA" ? "Trigger STK push." : "Redirect to payment processor."
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Donation could not be created right now." },
      { status: 503 }
    );
  }
}
