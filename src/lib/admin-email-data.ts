import { hasDatabaseUrl } from "@/lib/api";
import { db } from "@/lib/db";

export type AdminEmailQueueItem = {
  id: string;
  toEmail: string | null;
  toName: string | null;
  subject: string;
  status: string;
  context: string | null;
  entityId: string | null;
  sentAt: Date | null;
  createdAt: Date;
};

export async function getAdminEmailQueue(limit = 80): Promise<AdminEmailQueueItem[]> {
  if (!hasDatabaseUrl()) return [];

  try {
    return await db.emailLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        toEmail: true,
        toName: true,
        subject: true,
        status: true,
        context: true,
        entityId: true,
        sentAt: true,
        createdAt: true
      }
    });
  } catch {
    return [];
  }
}
