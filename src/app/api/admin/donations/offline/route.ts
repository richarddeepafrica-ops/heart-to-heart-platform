import { DonationStatus, PaymentMethod, PaymentProviderStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl, readPositiveInt, readString } from "@/lib/api";
import { writeAuditLog } from "@/lib/admin-system";
import { db } from "@/lib/db";

const allowedMethods = new Set<string>([PaymentMethod.BANK_TRANSFER, PaymentMethod.CASH]);
const allowedStatuses = new Set<string>([DonationStatus.PENDING, DonationStatus.CONFIRMED, DonationStatus.RECONCILED]);

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid offline donation request.");

  const amount = readPositiveInt(body.amount);
  const name = readString(body.name) || "Offline donor";
  const email = readString(body.email);
  const phone = readString(body.phone);
  const organization = readString(body.organization);
  const destinationLabel = readString(body.destinationLabel) || "General giving";
  const method = readString(body.method).toUpperCase() || PaymentMethod.BANK_TRANSFER;
  const status = readString(body.status).toUpperCase() || DonationStatus.PENDING;
  const providerRef = readString(body.providerRef);

  if (amount < 100) return apiError("Donation amount must be at least KES 100.");
  if (!allowedMethods.has(method)) return apiError("Offline gifts must be cash or bank transfer.");
  if (!allowedStatuses.has(status)) return apiError("Unsupported offline gift status.");

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      donation: {
        id: `preview-offline-${Date.now()}`,
        amount,
        currency: "KES",
        method,
        status,
        destinationLabel,
        donorName: name
      },
      nextAction: "Connect DATABASE_URL and run migrations to save offline gifts permanently."
    });
  }

  try {
    const donor = await db.donor.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        organization: organization || null
      }
    });

    const donation = await db.donation.create({
      data: {
        amount,
        method: method as PaymentMethod,
        status: status as DonationStatus,
        donorId: donor.id,
        destinationType: "offline",
        destinationLabel,
        source: "admin-offline",
        providerRef: providerRef || null
      }
    });

    await db.paymentTransaction.create({
      data: {
        donationId: donation.id,
        provider: method,
        providerRef: providerRef || null,
        amount,
        status: status === DonationStatus.PENDING ? PaymentProviderStatus.INITIATED : PaymentProviderStatus.VERIFIED
      }
    });

    await writeAuditLog({
      actorEmail: "Admin",
      action: "Recorded offline donation",
      entityType: "Donation",
      entityId: donation.id,
      metadata: { amount, method, status, destinationLabel, donorName: name }
    });

    return NextResponse.json({
      ok: true,
      mode: "database",
      donation: {
        id: donation.id,
        amount: donation.amount,
        currency: donation.currency,
        method: donation.method,
        status: donation.status,
        destinationLabel: donation.destinationLabel
      },
      nextAction: "Offline gift recorded for the finance dashboard."
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Offline gift could not be recorded right now." },
      { status: 503 }
    );
  }
}
