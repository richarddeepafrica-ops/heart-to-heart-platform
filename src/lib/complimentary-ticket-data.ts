import { hasDatabaseUrl } from "@/lib/api";
import { db } from "@/lib/db";

export type ComplimentaryTicketQueueItem = {
  id: string;
  eventTitle: string;
  packageName: string;
  recipientName: string;
  recipientEmail: string | null;
  recipientPhone: string | null;
  quantity: number;
  code: string;
  note: string | null;
  sentAt: Date | null;
  redeemedAt: Date | null;
  createdAt: Date;
};

export async function getComplimentaryTicketQueue(limit = 80): Promise<ComplimentaryTicketQueueItem[]> {
  if (!hasDatabaseUrl()) return [];

  try {
    const tickets = await db.complimentaryTicket.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { event: { select: { title: true } } }
    });

    return tickets.map((ticket) => ({
      id: ticket.id,
      eventTitle: ticket.event.title,
      packageName: ticket.packageName,
      recipientName: ticket.recipientName,
      recipientEmail: ticket.recipientEmail,
      recipientPhone: ticket.recipientPhone,
      quantity: ticket.quantity,
      code: ticket.code,
      note: ticket.note,
      sentAt: ticket.sentAt,
      redeemedAt: ticket.redeemedAt,
      createdAt: ticket.createdAt
    }));
  } catch {
    return [];
  }
}
