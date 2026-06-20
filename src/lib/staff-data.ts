import { UserRole } from "@prisma/client";
import { hasDatabaseUrl } from "@/lib/api";
import { db } from "@/lib/db";

export type StaffRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  access: string[];
  lastLoginAt?: Date | null;
  passwordResetRequired?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type StaffDashboard = {
  records: StaffRecord[];
  totalCount: number;
  financeCount: number;
  contentCount: number;
  operationsCount: number;
  superAdminCount: number;
};

export const staffRoleProfiles: Record<string, { department: string; access: string[] }> = {
  SUPER_ADMIN: {
    department: "Administration",
    access: ["All modules", "Staff", "System", "Audit logs"]
  },
  FUNDRAISING_MANAGER: {
    department: "Fundraising",
    access: ["Campaigns", "Donors", "Partners", "Reports"]
  },
  EVENTS_MANAGER: {
    department: "Events",
    access: ["Events", "Registrations", "Check-in", "Event reports"]
  },
  MARKETING_MANAGER: {
    department: "Marketing",
    access: ["Marketing", "Campaign updates", "Donor communications"]
  },
  FINANCE_OFFICER: {
    department: "Finance",
    access: ["Donations", "Receipts", "Reconciliation", "P&L reports"]
  },
  CONTENT_EDITOR: {
    department: "Content",
    access: ["Blogs", "Gallery", "Public stories", "Publishing"]
  },
  VOLUNTEER_COORDINATOR: {
    department: "Programmes",
    access: ["Applications", "Beneficiaries", "Volunteers", "Partners"]
  }
};

type StaffUserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  passwordHash: string | null;
  active: boolean;
  passwordResetRequired: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const previewStaff: StaffRecord[] = [
  {
    id: "preview-admin",
    name: "Foundation Admin",
    email: "admin@hearttoheart.local",
    role: "SUPER_ADMIN",
    department: staffRoleProfiles.SUPER_ADMIN.department,
    status: "Preview account",
    access: staffRoleProfiles.SUPER_ADMIN.access,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "preview-finance",
    name: "Finance Officer",
    email: "finance@hearttoheart.local",
    role: "FINANCE_OFFICER",
    department: staffRoleProfiles.FINANCE_OFFICER.department,
    status: "Ready to invite",
    access: staffRoleProfiles.FINANCE_OFFICER.access,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

function normalizeRole(role: string) {
  return staffRoleProfiles[role] ? role : "VOLUNTEER_COORDINATOR";
}

function summarize(records: StaffRecord[]): StaffDashboard {
  return {
    records,
    totalCount: records.length,
    financeCount: records.filter((record) => record.department === "Finance").length,
    contentCount: records.filter((record) => record.department === "Content").length,
    operationsCount: records.filter((record) => ["Events", "Programmes", "Fundraising"].includes(record.department)).length,
    superAdminCount: records.filter((record) => record.role === "SUPER_ADMIN").length
  };
}

export async function getStaffDashboard(): Promise<StaffDashboard> {
  if (!hasDatabaseUrl()) return summarize(previewStaff);

  try {
    const users = await db.$queryRawUnsafe<StaffUserRow[]>(
      `SELECT "id", "name", "email", "role", "passwordHash", "active", "passwordResetRequired", "lastLoginAt", "createdAt", "updatedAt"
       FROM "User"
       ORDER BY "role" ASC, "updatedAt" DESC`
    );

    return summarize(users.map((user) => {
      const role = normalizeRole(user.role);
      const profile = staffRoleProfiles[role];
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
        department: profile.department,
        status: user.active === false ? "Inactive" : user.passwordHash ? "Active" : "Invite pending",
        access: profile.access,
        lastLoginAt: user.lastLoginAt,
        passwordResetRequired: user.passwordResetRequired,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    }));
  } catch (error) {
    return summarize(previewStaff);
  }
}

export function isUserRole(value: string): value is UserRole {
  return Object.values(UserRole).includes(value as UserRole);
}
