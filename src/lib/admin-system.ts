import { Prisma } from "@prisma/client";
import { hasDatabaseUrl } from "@/lib/api";
import { db } from "@/lib/db";

type RawCount = { count: bigint | number | string };
type RawAuditLog = {
  id: string;
  actorEmail: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: unknown;
  createdAt: Date;
};
type RawErrorLog = {
  id: string;
  scope: string;
  message: string;
  stack: string | null;
  metadata: unknown;
  createdAt: Date;
};

export type SystemCheck = {
  label: string;
  status: "healthy" | "warning" | "blocked";
  detail: string;
  action?: string;
};

export type AdminAuditLog = {
  id: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: unknown;
  createdAt: Date;
};

export type AdminErrorLog = {
  id: string;
  scope: string;
  message: string;
  metadata: unknown;
  createdAt: Date;
};

type RawDb = {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: unknown[]) => Promise<T>;
};

function rawDb() {
  return db as unknown as RawDb;
}

function hasEnv(name: string) {
  return Boolean(process.env[name]?.trim());
}

function countValue(row?: RawCount) {
  if (!row) return 0;
  return Number(row.count || 0);
}

async function tableCount(tableName: string) {
  const rows = await rawDb().$queryRawUnsafe<RawCount[]>(`SELECT COUNT(*)::int AS count FROM "${tableName}"`);
  return countValue(rows[0]);
}

export async function getAdminSystemStatus() {
  const checks: SystemCheck[] = [];
  const metrics = {
    users: 0,
    donations: 0,
    childApplications: 0,
    partnerApplications: 0,
    auditLogs: 0
  };

  if (!hasDatabaseUrl()) {
    checks.push({
      label: "Database",
      status: "warning",
      detail: "Preview mode is active. Admin actions can be tested, but changes will not persist.",
      action: "Set DATABASE_URL and run migrations before launch."
    });
  } else {
    try {
      await rawDb().$queryRawUnsafe("SELECT 1");
      metrics.users = await tableCount("User");
      metrics.donations = await tableCount("Donation");
      metrics.childApplications = await tableCount("ChildCareApplication");
      metrics.partnerApplications = await tableCount("PartnerInstitutionApplication");
      metrics.auditLogs = await tableCount("AuditLog");
      checks.push({
        label: "Database",
        status: "healthy",
        detail: `Connected with ${metrics.users} admin user${metrics.users === 1 ? "" : "s"} seeded.`
      });
    } catch (error) {
      checks.push({
        label: "Database",
        status: "blocked",
        detail: "DATABASE_URL is set, but the database is not reachable.",
        action: "Start Postgres/Docker or connect a hosted database."
      });
    }
  }

  checks.push({
    label: "Admin security",
    status: hasEnv("ADMIN_SESSION_SECRET") && (process.env.ADMIN_SESSION_SECRET || "").length >= 32 ? "healthy" : "blocked",
    detail: hasEnv("ADMIN_SESSION_SECRET") ? "Session secret is configured." : "Session secret is missing.",
    action: hasEnv("ADMIN_SESSION_SECRET") ? undefined : "Set ADMIN_SESSION_SECRET to a unique 32+ character value."
  });

  const mpesaReady = ["MPESA_CONSUMER_KEY", "MPESA_CONSUMER_SECRET", "MPESA_SHORTCODE", "MPESA_PASSKEY", "MPESA_CALLBACK_URL"].every(hasEnv);
  checks.push({
    label: "M-Pesa",
    status: mpesaReady ? "healthy" : "warning",
    detail: mpesaReady ? "Daraja credentials are configured." : "M-Pesa is in preview/sandbox posture until credentials and callback URL are set.",
    action: mpesaReady ? undefined : "Add Daraja credentials before live payment testing."
  });

  checks.push({
    label: "Public site URL",
    status: hasEnv("NEXT_PUBLIC_SITE_URL") ? "healthy" : "warning",
    detail: hasEnv("NEXT_PUBLIC_SITE_URL") ? `Configured as ${process.env.NEXT_PUBLIC_SITE_URL}.` : "Public site URL is not configured.",
    action: hasEnv("NEXT_PUBLIC_SITE_URL") ? undefined : "Set NEXT_PUBLIC_SITE_URL for public links and callbacks."
  });

  checks.push({
    label: "Email/SMS",
    status: hasEnv("EMAIL_PROVIDER_API_KEY") || hasEnv("SMS_PROVIDER_API_KEY") ? "healthy" : "warning",
    detail: hasEnv("EMAIL_PROVIDER_API_KEY") || hasEnv("SMS_PROVIDER_API_KEY")
      ? "At least one outbound communication provider is configured."
      : "Receipt, thank-you, and follow-up notifications are not connected yet.",
    action: hasEnv("EMAIL_PROVIDER_API_KEY") || hasEnv("SMS_PROVIDER_API_KEY") ? undefined : "Add email/SMS provider keys when ready."
  });

  return { checks, metrics };
}

export async function getRecentErrorLogs(limit = 8): Promise<AdminErrorLog[]> {
  if (!hasDatabaseUrl()) return [];

  try {
    const rows = await rawDb().$queryRawUnsafe<RawErrorLog[]>(
      `SELECT "id", "scope", "message", "stack", "metadata", "createdAt"
       FROM "ErrorLog"
       ORDER BY "createdAt" DESC
       LIMIT $1`,
      limit
    );
    return rows.map((row) => ({
      id: row.id,
      scope: row.scope,
      message: row.message,
      metadata: row.metadata,
      createdAt: row.createdAt
    }));
  } catch {
    return [];
  }
}

export async function getRecentAuditLogs(limit = 12): Promise<AdminAuditLog[]> {
  if (!hasDatabaseUrl()) return [];

  try {
    const rows = await rawDb().$queryRawUnsafe<RawAuditLog[]>(
      `SELECT * FROM "AuditLog" ORDER BY "createdAt" DESC LIMIT $1`,
      limit
    );
    return rows.map((row) => ({
      id: row.id,
      actorEmail: row.actorEmail || "System",
      action: row.action,
      entityType: row.entityType,
      entityId: row.entityId || "",
      metadata: row.metadata,
      createdAt: row.createdAt
    }));
  } catch (error) {
    return [];
  }
}

export async function writeAuditLog(input: {
  actorEmail?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: unknown;
}) {
  if (!hasDatabaseUrl()) return;

  try {
    const metadata =
      input.metadata === undefined
        ? undefined
        : input.metadata === null
          ? Prisma.JsonNull
          : JSON.parse(JSON.stringify(input.metadata)) as Prisma.InputJsonValue;

    await db.auditLog.create({
      data: {
        actorEmail: input.actorEmail || null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId || null,
        metadata
      }
    });
  } catch (error) {
    // Audit logging should never block the admin workflow.
  }
}
