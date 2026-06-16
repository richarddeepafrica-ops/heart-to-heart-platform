import { hasDatabaseUrl } from "@/lib/api";
import { db } from "@/lib/db";

export type PartnerRecord = {
  id: string;
  organization: string;
  contactName: string;
  contactEmail: string;
  interest: string;
  estimatedValue: number;
  pipelineStage: string;
  updatedAt: Date;
};

export type PartnerDashboard = {
  records: PartnerRecord[];
  activeCount: number;
  openProposalCount: number;
  eventSponsorCount: number;
  renewalCount: number;
  potentialValue: number;
};

const previewRecords: PartnerRecord[] = [
  {
    id: "preview-kingdom-bank",
    organization: "Kingdom Bank",
    contactName: "CSR Lead",
    contactEmail: "csr@example.com",
    interest: "Event sponsor",
    estimatedValue: 1000000,
    pipelineStage: "ACTIVE",
    updatedAt: new Date()
  },
  {
    id: "preview-healthcare-partner",
    organization: "Healthcare Partner",
    contactName: "Partnerships",
    contactEmail: "partners@example.com",
    interest: "Surgery support",
    estimatedValue: 1500000,
    pipelineStage: "ACTIVE",
    updatedAt: new Date()
  },
  {
    id: "preview-school-network",
    organization: "School Network",
    contactName: "Events desk",
    contactEmail: "events@example.com",
    interest: "Heart Run teams",
    estimatedValue: 600000,
    pipelineStage: "NEW_INQUIRY",
    updatedAt: new Date()
  }
];

function summarize(records: PartnerRecord[]): PartnerDashboard {
  return {
    records,
    activeCount: records.filter((record) => record.pipelineStage === "ACTIVE").length,
    openProposalCount: records.filter((record) => ["NEW_INQUIRY", "PROPOSAL_SENT"].includes(record.pipelineStage)).length,
    eventSponsorCount: records.filter((record) => /event|heart run|sponsor/i.test(record.interest)).length,
    renewalCount: records.filter((record) => record.pipelineStage === "RENEWAL").length,
    potentialValue: records.reduce((total, record) => total + record.estimatedValue, 0)
  };
}

export async function getPartnerDashboard(): Promise<PartnerDashboard> {
  if (!hasDatabaseUrl()) return summarize(previewRecords);

  try {
    const partners = await db.corporatePartner.findMany({
      orderBy: { updatedAt: "desc" },
      take: 50
    });

    return summarize(partners.map((partner) => ({
      id: partner.id,
      organization: partner.organization,
      contactName: partner.contactName || "Not provided",
      contactEmail: partner.contactEmail || "Not provided",
      interest: partner.interest,
      estimatedValue: partner.estimatedValue || 0,
      pipelineStage: partner.pipelineStage,
      updatedAt: partner.updatedAt
    })));
  } catch (error) {
    return summarize(previewRecords);
  }
}

export function partnerRowsToCsv(dashboard: PartnerDashboard) {
  const rows = [
    ["Organization", "Contact", "Email", "Interest", "Estimated value", "Stage", "Updated at"],
    ...dashboard.records.map((record) => [
      record.organization,
      record.contactName,
      record.contactEmail,
      record.interest,
      record.estimatedValue,
      record.pipelineStage,
      record.updatedAt
    ])
  ];

  return `${rows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function csvCell(value: string | number | Date) {
  const stringValue = value instanceof Date ? value.toISOString() : String(value);
  return /[",\n]/.test(stringValue) ? `"${stringValue.replace(/"/g, "\"\"")}"` : stringValue;
}
