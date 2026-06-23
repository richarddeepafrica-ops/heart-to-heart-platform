import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl } from "@/lib/api";
import { db } from "@/lib/db";
import { logError } from "@/lib/error-log";
import { writeAuditLog } from "@/lib/admin-system";

type EmailAction = "mark-sent" | "mark-failed" | "requeue";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabaseUrl()) return apiError("Database is required to update email queue items.", 503);

  const { id } = await params;
  const body = await request.json().catch(() => null) as { action?: EmailAction } | null;
  const action = body?.action;
  if (!["mark-sent", "mark-failed", "requeue"].includes(action || "")) {
    return apiError("Choose a valid email queue action.");
  }

  try {
    const data =
      action === "mark-sent"
        ? { status: "SENT", sentAt: new Date() }
        : action === "mark-failed"
          ? { status: "FAILED", sentAt: null }
          : { status: "QUEUED", sentAt: null };

    const email = await db.emailLog.update({ where: { id }, data });

    await writeAuditLog({
      action: `Email queue ${action}`,
      entityType: "EmailLog",
      entityId: id,
      metadata: { subject: email.subject, toEmail: email.toEmail, status: email.status }
    });

    return NextResponse.json({ ok: true, message: action === "requeue" ? "Email queued for resend." : "Email status updated." });
  } catch (error) {
    await logError("api.admin.emails.PATCH", error, { id, action });
    return apiError("Email queue item could not be updated.", 500);
  }
}
