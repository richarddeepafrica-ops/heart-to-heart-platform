import { ConsentStatus } from "@prisma/client";
import { hasDatabaseUrl } from "@/lib/api";
import { db } from "@/lib/db";

export type AdminBeneficiaryRecord = {
  id: string;
  slug: string;
  publicName: string;
  age: number | null;
  diagnosis: string;
  consentStatus: ConsentStatus;
  raised: number;
  fundingGoal: number;
  visibility: string;
  note: string;
};

export type BeneficiaryDashboard = {
  records: AdminBeneficiaryRecord[];
  totalRaised: number;
  approvedCount: number;
  reviewCount: number;
  pendingCount: number;
};

const previewRecords: AdminBeneficiaryRecord[] = [
  {
    id: "preview-joy",
    slug: "joy-wambui",
    publicName: "Joy Wambui",
    age: 8,
    diagnosis: "Congenital heart condition",
    consentStatus: ConsentStatus.APPROVED,
    raised: 288000,
    fundingGoal: 650000,
    visibility: "Public sponsorship",
    note: "Ready for donor updates"
  },
  {
    id: "preview-draft",
    slug: "draft-beneficiary",
    publicName: "Draft beneficiary",
    age: null,
    diagnosis: "Private intake",
    consentStatus: ConsentStatus.GUARDIAN_PENDING,
    raised: 0,
    fundingGoal: 500000,
    visibility: "Private",
    note: "Guardian consent needed"
  }
];

export function formatConsentStatus(status: ConsentStatus | string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function visibilityFor(status: ConsentStatus) {
  if (status === ConsentStatus.APPROVED) return "Public sponsorship";
  if (status === ConsentStatus.ARCHIVED || status === ConsentStatus.REJECTED) return "Hidden";
  return "Private review";
}

function noteFor(status: ConsentStatus) {
  if (status === ConsentStatus.APPROVED) return "Can receive public gifts";
  if (status === ConsentStatus.GUARDIAN_PENDING) return "Guardian consent needed";
  if (status === ConsentStatus.MEDICAL_REVIEW) return "Care team review needed";
  if (status === ConsentStatus.REJECTED) return "Not approved for publication";
  if (status === ConsentStatus.ARCHIVED) return "Archived profile";
  return "Story draft in progress";
}

function summarize(records: AdminBeneficiaryRecord[]): BeneficiaryDashboard {
  const reviewStatuses = new Set<ConsentStatus>([
    ConsentStatus.DRAFT,
    ConsentStatus.GUARDIAN_PENDING,
    ConsentStatus.MEDICAL_REVIEW
  ]);

  return {
    records,
    totalRaised: records.reduce((total, record) => total + record.raised, 0),
    approvedCount: records.filter((record) => record.consentStatus === ConsentStatus.APPROVED).length,
    reviewCount: records.filter((record) => reviewStatuses.has(record.consentStatus)).length,
    pendingCount: records.filter((record) => record.raised < record.fundingGoal).length
  };
}

export async function getBeneficiaryDashboard(): Promise<BeneficiaryDashboard> {
  if (!hasDatabaseUrl()) return summarize(previewRecords);

  try {
    const beneficiaries = await db.beneficiary.findMany({
      orderBy: { updatedAt: "desc" },
      include: { donations: true }
    });

    return summarize(beneficiaries.map((beneficiary) => ({
      id: beneficiary.id,
      slug: beneficiary.slug,
      publicName: beneficiary.publicName,
      age: beneficiary.age,
      diagnosis: beneficiary.diagnosis || "Care profile",
      consentStatus: beneficiary.consentStatus,
      raised: beneficiary.donations.reduce((total, donation) => total + donation.amount, 0),
      fundingGoal: beneficiary.fundingGoal,
      visibility: visibilityFor(beneficiary.consentStatus),
      note: noteFor(beneficiary.consentStatus)
    })));
  } catch (error) {
    return summarize(previewRecords);
  }
}
