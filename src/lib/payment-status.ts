import { db } from "@/lib/db";

export function receiptNumberFromDonationId(id: string) {
  return `H2H-${id.slice(-8).toUpperCase()}`;
}

export async function markDonationConfirmed(donationId: string, providerRef?: string) {
  return db.donation.update({
    where: { id: donationId },
    data: {
      status: "CONFIRMED",
      providerRef: providerRef || undefined,
      receiptNumber: receiptNumberFromDonationId(donationId),
      transactions: {
        updateMany: {
          where: {},
          data: {
            status: "VERIFIED",
            providerRef: providerRef || undefined
          }
        }
      }
    }
  });
}

export async function markDonationFailed(donationId: string) {
  return db.donation.update({
    where: { id: donationId },
    data: {
      status: "FAILED",
      transactions: {
        updateMany: {
          where: {},
          data: { status: "FAILED" }
        }
      }
    }
  });
}
