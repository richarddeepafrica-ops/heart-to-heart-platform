import { hasDatabaseUrl } from "@/lib/api";
import { db } from "@/lib/db";

export type FinanceQueueRecord = {
  id: string;
  donor: string;
  method: string;
  source: string;
  amount: number;
  donationStatus: string;
  transactionStatus: string;
  receiptNumber: string;
  providerRef: string;
  createdAt: Date;
};

export type FinanceDashboard = {
  queue: FinanceQueueRecord[];
  receivedToday: number;
  todayCount: number;
  reconciledTotal: number;
  reconciledPercent: number;
  pendingReceipts: number;
  bankTransferCount: number;
  failedCount: number;
};

const previewQueue: FinanceQueueRecord[] = [
  {
    id: "preview-mary",
    donor: "Mary A.",
    method: "MPESA",
    source: "Fund 20 Heart Surgeries",
    amount: 10000,
    donationStatus: "PENDING",
    transactionStatus: "INITIATED",
    receiptNumber: "Pending",
    providerRef: "Auto-match",
    createdAt: new Date()
  },
  {
    id: "preview-corporate",
    donor: "Corporate Team Alpha",
    method: "BANK_TRANSFER",
    source: "CSR Surgery Fund",
    amount: 250000,
    donationStatus: "PENDING",
    transactionStatus: "INITIATED",
    receiptNumber: "Pending",
    providerRef: "Needs proof",
    createdAt: new Date()
  }
];

function summarize(queue: FinanceQueueRecord[]): FinanceDashboard {
  const today = new Date().toDateString();
  const confirmedStatuses = new Set(["CONFIRMED", "RECONCILED"]);
  const receivedTodayRecords = queue.filter((record) =>
    record.createdAt.toDateString() === today && confirmedStatuses.has(record.donationStatus)
  );
  const totalProcessed = queue
    .filter((record) => ["CONFIRMED", "RECONCILED", "FAILED", "REFUNDED"].includes(record.donationStatus))
    .length;
  const reconciledCount = queue.filter((record) => record.donationStatus === "RECONCILED").length;

  return {
    queue,
    receivedToday: receivedTodayRecords.reduce((total, record) => total + record.amount, 0),
    todayCount: receivedTodayRecords.length,
    reconciledTotal: queue
      .filter((record) => record.donationStatus === "RECONCILED")
      .reduce((total, record) => total + record.amount, 0),
    reconciledPercent: totalProcessed ? Math.round((reconciledCount / totalProcessed) * 100) : 0,
    pendingReceipts: queue.filter((record) => confirmedStatuses.has(record.donationStatus) && record.receiptNumber === "Pending").length,
    bankTransferCount: queue.filter((record) => record.method === "BANK_TRANSFER").length,
    failedCount: queue.filter((record) => record.donationStatus === "FAILED" || record.transactionStatus === "FAILED").length
  };
}

export async function getFinanceDashboard(): Promise<FinanceDashboard> {
  if (!hasDatabaseUrl()) return summarize(previewQueue);

  try {
    const donations = await db.donation.findMany({
      orderBy: { createdAt: "desc" },
      take: 75,
      include: {
        donor: true,
        campaign: true,
        beneficiary: true,
        event: true,
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    });

    return summarize(donations.map((donation) => {
      const transaction = donation.transactions[0];

      return {
        id: donation.id,
        donor: donation.donor?.isAnonymous ? "Anonymous" : donation.donor?.name || "Anonymous",
        method: donation.method,
        source:
          donation.destinationLabel ||
          donation.beneficiary?.publicName ||
          donation.event?.title ||
          donation.campaign?.title ||
          "General giving",
        amount: donation.amount,
        donationStatus: donation.status,
        transactionStatus: transaction?.status || "INITIATED",
        receiptNumber: donation.receiptNumber || "Pending",
        providerRef: donation.providerRef || transaction?.providerRef || transaction?.checkoutRef || "No provider ref",
        createdAt: donation.createdAt
      };
    }));
  } catch (error) {
    return summarize(previewQueue);
  }
}
