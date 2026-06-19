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

export type MonthlyFinanceLine = {
  label: string;
  amount: number;
  note: string;
};

export type MonthlyProfitLoss = {
  monthLabel: string;
  generatedAt: Date;
  income: MonthlyFinanceLine[];
  expenses: MonthlyFinanceLine[];
  totalIncome: number;
  totalExpenses: number;
  netPosition: number;
  restrictedFunds: number;
  unrestrictedFunds: number;
  reconciliationStatus: string;
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

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-KE", { month: "long", year: "numeric" }).format(date);
}

function inSameMonth(date: Date, target: Date) {
  return date.getFullYear() === target.getFullYear() && date.getMonth() === target.getMonth();
}

function buildProfitLoss(records: FinanceQueueRecord[], target = new Date()): MonthlyProfitLoss {
  const receivedStatuses = new Set(["CONFIRMED", "RECONCILED"]);
  const monthRecords = records.filter((record) => inSameMonth(record.createdAt, target) && receivedStatuses.has(record.donationStatus));
  const campaignIncome = monthRecords
    .filter((record) => /fund|campaign|surgery|prevention|giving|csr/i.test(record.source))
    .reduce((total, record) => total + record.amount, 0);
  const eventIncome = monthRecords
    .filter((record) => /run|gala|goat|event|ticket|registration/i.test(record.source))
    .reduce((total, record) => total + record.amount, 0);
  const generalIncome = monthRecords.reduce((total, record) => total + record.amount, 0) - campaignIncome - eventIncome;
  const totalIncome = monthRecords.reduce((total, record) => total + record.amount, 0);

  const income = [
    { label: "Campaign and restricted gifts", amount: campaignIncome, note: "Campaign, beneficiary, CSR, and restricted giving." },
    { label: "Events and registrations", amount: eventIncome, note: "Heart Run, gala, event donations, and ticket packages." },
    { label: "General giving", amount: Math.max(generalIncome, 0), note: "Unrestricted donations and general support." }
  ];

  const expenses = [
    { label: "Treatment and surgery support", amount: Math.round(totalIncome * 0.58), note: "Planning allocation until expense ledger is enabled." },
    { label: "Prevention and outreach", amount: Math.round(totalIncome * 0.16), note: "School outreach, teachers workshops, and awareness." },
    { label: "Event delivery", amount: Math.round(eventIncome * 0.22), note: "Estimated direct event delivery costs." },
    { label: "Administration and compliance", amount: Math.round(totalIncome * 0.09), note: "Operating, audit, and platform support estimate." }
  ];
  const totalExpenses = expenses.reduce((total, line) => total + line.amount, 0);
  const pendingCount = records.filter((record) => inSameMonth(record.createdAt, target) && record.donationStatus === "PENDING").length;
  const failedCount = records.filter((record) => inSameMonth(record.createdAt, target) && record.donationStatus === "FAILED").length;

  return {
    monthLabel: monthLabel(target),
    generatedAt: new Date(),
    income,
    expenses,
    totalIncome,
    totalExpenses,
    netPosition: totalIncome - totalExpenses,
    restrictedFunds: campaignIncome + eventIncome,
    unrestrictedFunds: Math.max(generalIncome, 0),
    reconciliationStatus:
      pendingCount || failedCount
        ? `${pendingCount} pending and ${failedCount} failed payment${failedCount === 1 ? "" : "s"} need review.`
        : "No pending or failed payments detected for this month."
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

export async function getMonthlyProfitLoss(): Promise<MonthlyProfitLoss> {
  const dashboard = await getFinanceDashboard();
  return buildProfitLoss(dashboard.queue);
}
