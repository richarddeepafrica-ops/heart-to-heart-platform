import { hasDatabaseUrl } from "@/lib/api";
import { db } from "@/lib/db";

export type AdminDonationRecord = {
  id: string;
  donor: string;
  amount: number;
  method: string;
  destination: string;
  status: string;
  createdAt: Date;
};

export type DonationDashboard = {
  records: AdminDonationRecord[];
  todayTotal: number;
  confirmedTotal: number;
  pendingCount: number;
  failedCount: number;
};

const previewRecords: AdminDonationRecord[] = [
  {
    id: "H2H-1042",
    donor: "Mary A.",
    amount: 10000,
    method: "MPESA",
    destination: "Fund 20 Heart Surgeries",
    status: "PENDING",
    createdAt: new Date()
  },
  {
    id: "H2H-1041",
    donor: "Corporate Team Alpha",
    amount: 250000,
    method: "BANK_TRANSFER",
    destination: "CSR Surgery Fund",
    status: "PENDING",
    createdAt: new Date()
  }
];

function summarize(records: AdminDonationRecord[]): DonationDashboard {
  const today = new Date().toDateString();
  return {
    records,
    todayTotal: records
      .filter((record) => record.createdAt.toDateString() === today)
      .reduce((total, record) => total + record.amount, 0),
    confirmedTotal: records
      .filter((record) => ["CONFIRMED", "RECONCILED"].includes(record.status))
      .reduce((total, record) => total + record.amount, 0),
    pendingCount: records.filter((record) => record.status === "PENDING").length,
    failedCount: records.filter((record) => record.status === "FAILED").length
  };
}

export async function getDonationDashboard(): Promise<DonationDashboard> {
  if (!hasDatabaseUrl()) return summarize(previewRecords);

  try {
    const donations = await db.donation.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        donor: true,
        campaign: true,
        beneficiary: true,
        event: true,
        registration: true
      }
    });

    return summarize(donations.map((donation) => ({
      id: donation.receiptNumber || donation.id.slice(-8).toUpperCase(),
      donor: donation.donor?.isAnonymous ? "Anonymous" : donation.donor?.name || "Anonymous",
      amount: donation.amount,
      method: donation.method,
      destination:
        donation.destinationLabel ||
        donation.beneficiary?.publicName ||
        donation.event?.title ||
        donation.campaign?.title ||
        "General giving",
      status: donation.status,
      createdAt: donation.createdAt
    })));
  } catch (error) {
    return summarize(previewRecords);
  }
}
