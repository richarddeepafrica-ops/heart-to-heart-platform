import { hasDatabaseUrl } from "@/lib/api";
import { fundedPercent } from "@/lib/content";
import { db } from "@/lib/db";

export type ReportMetric = {
  label: string;
  value: number;
  meta: string;
};

export type CampaignReportRow = {
  name: string;
  status: string;
  raised: number;
  goal: number;
  percent: number;
};

export type ReportBreakdownRow = {
  name: string;
  count: number;
  amount: number;
};

export type ReportDashboard = {
  generatedAt: Date;
  totalRaised: number;
  confirmedRaised: number;
  pendingAmount: number;
  failedAmount: number;
  donorCount: number;
  campaignCount: number;
  eventRegistrationCount: number;
  beneficiaryCount: number;
  campaigns: CampaignReportRow[];
  methods: ReportBreakdownRow[];
  destinations: ReportBreakdownRow[];
  boardPriorities: string[];
};

const receivedStatuses = new Set(["CONFIRMED", "RECONCILED"]);

const previewDashboard: ReportDashboard = {
  generatedAt: new Date(),
  totalRaised: 9640000,
  confirmedRaised: 9640000,
  pendingAmount: 0,
  failedAmount: 0,
  donorCount: 0,
  campaignCount: 3,
  eventRegistrationCount: 0,
  beneficiaryCount: 3,
  campaigns: [
    { name: "Fund 20 Heart Surgeries", status: "ACTIVE", raised: 6400000, goal: 10000000, percent: 64 },
    { name: "Rheumatic Fever Prevention", status: "ACTIVE", raised: 1140000, goal: 3000000, percent: 38 },
    { name: "Heart Run / Walk Giving", status: "ACTIVE", raised: 2100000, goal: 5000000, percent: 42 }
  ],
  methods: [
    { name: "CASH", count: 3, amount: 9640000 }
  ],
  destinations: [
    { name: "Campaigns", count: 3, amount: 9640000 },
    { name: "Events", count: 0, amount: 0 },
    { name: "Beneficiaries", count: 0, amount: 0 }
  ],
  boardPriorities: [
    "Confirm live M-Pesa credentials before public launch.",
    "Review pending receipts and reconcile payment provider references.",
    "Add editable event package records for capacity and publish controls."
  ]
};

function addBreakdown(map: Map<string, ReportBreakdownRow>, name: string, amount: number) {
  const current = map.get(name) || { name, count: 0, amount: 0 };
  current.count += 1;
  current.amount += amount;
  map.set(name, current);
}

export function reportRowsToCsv(report: ReportDashboard) {
  const lines = [
    ["Section", "Name", "Count", "Amount", "Goal", "Status"].join(","),
    ...report.campaigns.map((campaign) => [
      "Campaign",
      campaign.name,
      "",
      campaign.raised,
      campaign.goal,
      campaign.status
    ].map(csvCell).join(",")),
    ...report.methods.map((method) => [
      "Payment method",
      method.name,
      method.count,
      method.amount,
      "",
      ""
    ].map(csvCell).join(",")),
    ...report.destinations.map((destination) => [
      "Destination",
      destination.name,
      destination.count,
      destination.amount,
      "",
      ""
    ].map(csvCell).join(","))
  ];

  return `${lines.join("\n")}\n`;
}

function csvCell(value: string | number) {
  const stringValue = String(value);
  return /[",\n]/.test(stringValue) ? `"${stringValue.replace(/"/g, "\"\"")}"` : stringValue;
}

export async function getReportDashboard(): Promise<ReportDashboard> {
  if (!hasDatabaseUrl()) return previewDashboard;

  try {
    const [donations, campaigns, donors, beneficiaries, registrations] = await Promise.all([
      db.donation.findMany({
        include: {
          campaign: true,
          beneficiary: true,
          event: true
        },
        orderBy: { createdAt: "desc" }
      }),
      db.campaign.findMany({ include: { donations: true }, orderBy: { createdAt: "desc" } }),
      db.donor.count(),
      db.beneficiary.count(),
      db.eventRegistration.count()
    ]);

    const receivedDonations = donations.filter((donation) => receivedStatuses.has(donation.status));
    const methodMap = new Map<string, ReportBreakdownRow>();
    const destinationMap = new Map<string, ReportBreakdownRow>();

    for (const donation of receivedDonations) {
      addBreakdown(methodMap, donation.method.replace("_", " "), donation.amount);

      const destination =
        donation.beneficiaryId ? "Beneficiaries" :
        donation.eventId ? "Events" :
        donation.campaignId ? "Campaigns" :
        "General giving";
      addBreakdown(destinationMap, destination, donation.amount);
    }

    const campaignRows = campaigns.map((campaign) => {
      const raised = campaign.donations
        .filter((donation) => receivedStatuses.has(donation.status))
        .reduce((total, donation) => total + donation.amount, 0);

      return {
        name: campaign.title,
        status: campaign.status,
        raised,
        goal: campaign.goalAmount,
        percent: fundedPercent(raised, campaign.goalAmount)
      };
    });

    const pendingAmount = donations
      .filter((donation) => donation.status === "PENDING")
      .reduce((total, donation) => total + donation.amount, 0);
    const failedAmount = donations
      .filter((donation) => donation.status === "FAILED")
      .reduce((total, donation) => total + donation.amount, 0);

    return {
      generatedAt: new Date(),
      totalRaised: donations.reduce((total, donation) => total + donation.amount, 0),
      confirmedRaised: receivedDonations.reduce((total, donation) => total + donation.amount, 0),
      pendingAmount,
      failedAmount,
      donorCount: donors,
      campaignCount: campaigns.length,
      eventRegistrationCount: registrations,
      beneficiaryCount: beneficiaries,
      campaigns: campaignRows,
      methods: Array.from(methodMap.values()).sort((a, b) => b.amount - a.amount),
      destinations: Array.from(destinationMap.values()).sort((a, b) => b.amount - a.amount),
      boardPriorities: [
        pendingAmount > 0 ? "Finance needs to clear pending receipts and provider references." : "Finance reconciliation is clear for confirmed receipts.",
        campaignRows.some((campaign) => campaign.percent < 50) ? "Fundraising needs extra focus on campaigns below 50% funded." : "Campaign funding is tracking above halfway.",
        registrations > 0 ? "Events team needs to keep registration check-ins updated." : "Events team needs to test the registration checkout before launch."
      ]
    };
  } catch (error) {
    return previewDashboard;
  }
}
