import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl, readPositiveInt, readString } from "@/lib/api";
import { db } from "@/lib/db";
import { logError } from "@/lib/error-log";

function ticketCode() {
  return `H2H-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid complimentary ticket request.");
  if (!hasDatabaseUrl()) return apiError("Database is required to issue complimentary tickets.", 503);

  const eventId = readString(body.eventId);
  const packageName = readString(body.packageName);
  const recipientName = readString(body.recipientName);
  const recipientEmail = readString(body.recipientEmail);
  const recipientPhone = readString(body.recipientPhone);
  const quantity = Math.max(1, readPositiveInt(body.quantity) || 1);
  const note = readString(body.note);

  if (!eventId || !packageName || !recipientName) return apiError("Event, package, and recipient name are required.");

  const code = ticketCode();
  try {
    const comp = await db.complimentaryTicket.create({
      data: {
        eventId,
        packageName,
        recipientName,
        recipientEmail: recipientEmail || null,
        recipientPhone: recipientPhone || null,
        quantity,
        code,
        note: note || null
      },
      include: { event: true }
    });

    await db.emailLog.create({
      data: {
        toEmail: recipientEmail || null,
        toName: recipientName,
        subject: `${comp.event.title} complimentary ticket`,
        body: `Hello ${recipientName},\n\nYou have been issued ${quantity} complimentary ${packageName} ticket(s) for ${comp.event.title}.\n\nTicket code: ${code}\n\nPlease present this code at check-in.`,
        context: "COMPLIMENTARY_TICKET",
        entityId: comp.id
      }
    }).catch(() => null);

    await db.auditLog.create({
      data: {
        action: "Issued complimentary ticket",
        entityType: "ComplimentaryTicket",
        entityId: comp.id,
        metadata: { eventId, packageName, recipientName, recipientEmail, quantity, code }
      }
    }).catch(() => null);

    return NextResponse.json({ ok: true, code, nextAction: recipientEmail ? "Complimentary ticket queued for email." : "Complimentary ticket created. Add email to send it." });
  } catch (error) {
    await logError("api.admin.complimentary-tickets.POST", error, { eventId, packageName, recipientName, recipientEmail, quantity });
    return apiError("Complimentary ticket could not be issued.", 500);
  }
}
