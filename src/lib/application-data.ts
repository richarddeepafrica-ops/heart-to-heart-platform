import { hasDatabaseUrl } from "@/lib/api";
import { db } from "@/lib/db";

export type ChildApplicationRecord = {
  id: string;
  childName: string;
  childAge: number | null;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string | null;
  county: string | null;
  diagnosis: string;
  hospital: string | null;
  estimatedNeed: number | null;
  story: string;
  status: string;
  adminNotes: string | null;
  beneficiaryId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PartnerInstitutionApplicationRecord = {
  id: string;
  organization: string;
  institutionType: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  county: string | null;
  website: string | null;
  proposal: string;
  status: string;
  adminNotes: string | null;
  partnerId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ApplicationDashboard = {
  childApplications: ChildApplicationRecord[];
  partnerApplications: PartnerInstitutionApplicationRecord[];
  newCount: number;
  reviewCount: number;
  approvedCount: number;
  declinedCount: number;
};

type ApplicationDb = {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: unknown[]) => Promise<T>;
};

const previewChildApplications: ChildApplicationRecord[] = [
  {
    id: "preview-child-application",
    childName: "Private child application",
    childAge: 7,
    guardianName: "Guardian name",
    guardianPhone: "+254 700 000 000",
    guardianEmail: "guardian@example.com",
    county: "Nairobi",
    diagnosis: "Suspected congenital heart condition",
    hospital: "Referral hospital",
    estimatedNeed: 650000,
    story: "Family has requested support for specialist review and treatment planning.",
    status: "NEW",
    adminNotes: null,
    beneficiaryId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const previewPartnerApplications: PartnerInstitutionApplicationRecord[] = [
  {
    id: "preview-partner-application",
    organization: "Community Health Institution",
    institutionType: "Hospital / clinic",
    contactName: "Partnership lead",
    contactEmail: "partners@example.com",
    contactPhone: "+254 711 000 000",
    county: "Nairobi",
    website: "https://example.com",
    proposal: "Interested in referral support, screening days, and awareness campaigns.",
    status: "NEW",
    adminNotes: null,
    partnerId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

function applicationDb() {
  return db as unknown as ApplicationDb;
}

async function tableExists(tableName: string) {
  if (!hasDatabaseUrl()) return false;

  try {
    const rows = await applicationDb().$queryRawUnsafe<Array<{ exists: string | null }>>(
      "SELECT to_regclass($1)::text as exists",
      `public."${tableName}"`
    );
    return Boolean(rows[0]?.exists);
  } catch (error) {
    return false;
  }
}

export async function getApplicationDashboard(): Promise<ApplicationDashboard> {
  const hasTables =
    hasDatabaseUrl() &&
    await tableExists("ChildCareApplication") &&
    await tableExists("PartnerInstitutionApplication");

  const childApplications = hasTables
    ? await applicationDb().$queryRawUnsafe<ChildApplicationRecord[]>(
      `SELECT * FROM "ChildCareApplication" ORDER BY "createdAt" DESC LIMIT 80`
    ).catch(() => previewChildApplications)
    : previewChildApplications;

  const partnerApplications = hasTables
    ? await applicationDb().$queryRawUnsafe<PartnerInstitutionApplicationRecord[]>(
      `SELECT * FROM "PartnerInstitutionApplication" ORDER BY "createdAt" DESC LIMIT 80`
    ).catch(() => previewPartnerApplications)
    : previewPartnerApplications;

  const allStatuses = [...childApplications, ...partnerApplications].map((application) => application.status);

  return {
    childApplications,
    partnerApplications,
    newCount: allStatuses.filter((status) => status === "NEW").length,
    reviewCount: allStatuses.filter((status) => status === "IN_REVIEW").length,
    approvedCount: allStatuses.filter((status) => status === "APPROVED").length,
    declinedCount: allStatuses.filter((status) => status === "DECLINED").length
  };
}

export function formatApplicationStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
