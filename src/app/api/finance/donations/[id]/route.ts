import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl, readString } from "@/lib/api";
import { writeAuditLog } from "@/lib/admin-system";
import {
  markDonationConfirmed,
  markDonationFailed,
  markDonationReconciled,
  markDonationRefunded
} from "@/lib/payment-status";

type FinanceDonationRouteContext = {
  params: Promise<unknown>;
};

async function readId(context: FinanceDonationRouteContext) {
  const params = await context.params;
  return typeof params === "object" && params !== null && "id" in params
    ? readString((params as { id?: unknown }).id)
    : "";
}

export async function PATCH(request: NextRequest, context: FinanceDonationRouteContext) {
  const id = await readId(context);
  if (!id) return apiError("Donation id is required.");

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid finance action request.");

  const action = readString(body.action).toUpperCase();
  const providerRef = readString(body.providerRef);

  if (!["CONFIRM", "RECONCILE", "FAIL", "REFUND"].includes(action)) {
    return apiError("Unsupported finance action.");
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      donation: {
        id,
        status: action === "FAIL" ? "FAILED" : action === "REFUND" ? "REFUNDED" : action === "RECONCILE" ? "RECONCILED" : "CONFIRMED",
        receiptNumber: action === "FAIL" || action === "REFUND" ? null : `H2H-${id.slice(-8).toUpperCase()}`
      },
      nextAction: "Connect DATABASE_URL and run migrations to save finance actions permanently."
    });
  }

  try {
    const donation =
      action === "CONFIRM" ? await markDonationConfirmed(id, providerRef || undefined) :
      action === "RECONCILE" ? await markDonationReconciled(id, providerRef || undefined) :
      action === "REFUND" ? await markDonationRefunded(id) :
      await markDonationFailed(id);
    await writeAuditLog({
      action: `FINANCE_${action}`,
      entityType: "Donation",
      entityId: id,
      metadata: { providerRef: providerRef || null, status: donation.status }
    });

    return NextResponse.json({
      ok: true,
      mode: "database",
      donation: {
        id: donation.id,
        status: donation.status,
        receiptNumber: donation.receiptNumber,
        providerRef: donation.providerRef
      }
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Finance action could not be applied right now." },
      { status: 503 }
    );
  }
}
