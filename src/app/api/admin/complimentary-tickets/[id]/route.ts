import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl } from "@/lib/api";
import { writeAuditLog } from "@/lib/admin-system";
import { db } from "@/lib/db";
import { logError } from "@/lib/error-log";

type TicketAction = "mark-sent" | "redeem" | "unredeem";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabaseUrl()) return apiError("Database is required to update complimentary tickets.", 503);

  const { id } = await params;
  const body = await request.json().catch(() => null) as { action?: TicketAction } | null;
  const action = body?.action;
  if (!["mark-sent", "redeem", "unredeem"].includes(action || "")) {
    return apiError("Choose a valid complimentary ticket action.");
  }

  try {
    const ticket = await db.complimentaryTicket.update({
      where: { id },
      data:
        action === "mark-sent"
          ? { sentAt: new Date() }
          : action === "redeem"
            ? { redeemedAt: new Date() }
            : { redeemedAt: null }
    });

    if (action === "mark-sent") {
      await db.emailLog.updateMany({
        where: { context: "COMPLIMENTARY_TICKET", entityId: id },
        data: { status: "SENT", sentAt: new Date() }
      }).catch(() => null);
    }

    await writeAuditLog({
      action: `Complimentary ticket ${action}`,
      entityType: "ComplimentaryTicket",
      entityId: id,
      metadata: { code: ticket.code, recipientName: ticket.recipientName, packageName: ticket.packageName }
    });

    return NextResponse.json({ ok: true, message: action === "redeem" ? "Complimentary ticket redeemed." : "Complimentary ticket updated." });
  } catch (error) {
    await logError("api.admin.complimentary-tickets.PATCH", error, { id, action });
    return apiError("Complimentary ticket could not be updated.", 500);
  }
}
