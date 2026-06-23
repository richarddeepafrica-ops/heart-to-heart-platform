import { hasDatabaseUrl } from "@/lib/api";
import { eventProducts } from "@/lib/content";
import { db } from "@/lib/db";
import { slugify } from "@/lib/publishing-data";
import type { EventProduct } from "@/lib/types";

export type EventTicketPackageRecord = EventProduct & {
  id: string;
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  slug: string;
  color: string;
  status: string;
  showInShop: boolean;
  sortOrder: number;
};

type TicketDb = {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: unknown[]) => Promise<T>;
};

type TicketRow = {
  id: string;
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  name: string;
  slug: string;
  description: string;
  audience: string | null;
  benefits: string[];
  price: number;
  capacity: number;
  color: string;
  status: string;
  showInShop: boolean;
  sortOrder: number;
};

const fallbackTickets: EventTicketPackageRecord[] = eventProducts.map((ticket, index) => ({
  ...ticket,
  id: `preview-${slugify(ticket.name)}`,
  eventId: "preview-heart-run",
  eventSlug: "heart-run",
  eventTitle: "Heart Run / Walk",
  slug: slugify(ticket.name),
  color: ["#00539C", "#00A35A", "#194A7A", "#0D6E5F"][index] || "#00539C",
  status: "ACTIVE",
  showInShop: true,
  sortOrder: index
}));

function ticketDb() {
  return db as unknown as TicketDb;
}

async function tableExists(tableName: string) {
  if (!hasDatabaseUrl()) return false;
  try {
    const rows = await ticketDb().$queryRawUnsafe<Array<{ exists: boolean }>>(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = $1
      ) AS "exists"`,
      tableName
    );
    return Boolean(rows[0]?.exists);
  } catch {
    return false;
  }
}

function normalize(row: TicketRow): EventTicketPackageRecord {
  return {
    id: row.id,
    eventId: row.eventId,
    eventSlug: row.eventSlug,
    eventTitle: row.eventTitle,
    name: row.name,
    slug: row.slug,
    description: row.description,
    audience: row.audience || "General registration",
    benefits: row.benefits || [],
    price: row.price,
    capacity: row.capacity,
    color: row.color,
    status: row.status,
    showInShop: row.showInShop,
    sortOrder: row.sortOrder
  };
}

export async function getEventTicketPackages(options: { admin?: boolean; shopOnly?: boolean; eventSlug?: string } = {}) {
  if (!(await tableExists("EventTicketPackage"))) {
    return fallbackTickets.filter((ticket) => options.admin || (ticket.status === "ACTIVE" && (!options.shopOnly || ticket.showInShop)));
  }

  try {
    const clauses = [];
    const values: unknown[] = [];
    if (!options.admin) clauses.push(`p."status" = 'ACTIVE'`);
    if (options.shopOnly) clauses.push(`p."showInShop" = true`);
    if (options.eventSlug) {
      values.push(options.eventSlug);
      clauses.push(`e."slug" = $${values.length}`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const rows = await ticketDb().$queryRawUnsafe<TicketRow[]>(
      `SELECT p."id", p."eventId", e."slug" AS "eventSlug", e."title" AS "eventTitle",
              p."name", p."slug", p."description", p."audience", p."benefits",
              p."price", p."capacity", p."color", p."status", p."showInShop", p."sortOrder"
       FROM "EventTicketPackage" p
       JOIN "Event" e ON e."id" = p."eventId"
       ${where}
       ORDER BY p."sortOrder" ASC, p."createdAt" ASC`,
      ...values
    );
    return rows.length ? rows.map(normalize) : fallbackTickets;
  } catch {
    return fallbackTickets.filter((ticket) => options.admin || (ticket.status === "ACTIVE" && (!options.shopOnly || ticket.showInShop)));
  }
}

export async function ensureDefaultEventTicketPackages() {
  if (!(await tableExists("EventTicketPackage"))) return;
  const events = await db.event.findMany({ select: { id: true, slug: true } });
  const heartRun = events.find((event) => event.slug === "heart-run") || events[0];
  if (!heartRun) return;

  const rows = await ticketDb().$queryRawUnsafe<Array<{ count: number }>>(
    `SELECT COUNT(*)::int AS "count" FROM "EventTicketPackage" WHERE "eventId" = $1`,
    heartRun.id
  );
  if ((rows[0]?.count || 0) > 0) return;

  for (const ticket of fallbackTickets) {
    await ticketDb().$queryRawUnsafe(
      `INSERT INTO "EventTicketPackage"
       ("id", "eventId", "name", "slug", "description", "audience", "benefits", "price", "capacity", "color", "status", "showInShop", "sortOrder", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7::text[], $8, $9, $10, 'ACTIVE', true, $11, NOW())
       ON CONFLICT ("eventId", "slug") DO NOTHING`,
      crypto.randomUUID(),
      heartRun.id,
      ticket.name,
      ticket.slug,
      ticket.description,
      ticket.audience,
      ticket.benefits,
      ticket.price,
      ticket.capacity,
      ticket.color,
      ticket.sortOrder
    );
  }
}
