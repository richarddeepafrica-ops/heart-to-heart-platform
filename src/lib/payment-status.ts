import { db } from "@/lib/db";
import type { DonationStatus, PaymentProviderStatus } from "@prisma/client";

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

export async function markDonationReconciled(donationId: string, providerRef?: string) {
  return updateDonationFinanceStatus(donationId, "RECONCILED", "VERIFIED", providerRef);
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

export async function markDonationRefunded(donationId: string) {
  return updateDonationFinanceStatus(donationId, "REFUNDED", "REVERSED");
}

export async function updateDonationFinanceStatus(
  donationId: string,
  donationStatus: DonationStatus,
  transactionStatus: PaymentProviderStatus,
  providerRef?: string
) {
  return db.donation.update({
    where: { id: donationId },
    data: {
      status: donationStatus,
      providerRef: providerRef || undefined,
      receiptNumber: ["CONFIRMED", "RECONCILED"].includes(donationStatus)
        ? receiptNumberFromDonationId(donationId)
        : undefined,
      transactions: {
        updateMany: {
          where: {},
          data: {
            status: transactionStatus,
            providerRef: providerRef || undefined
          }
        }
      }
    }
  });
}
