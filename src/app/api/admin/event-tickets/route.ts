import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl, readPositiveInt, readString } from "@/lib/api";
import { db } from "@/lib/db";
import { slugify } from "@/lib/publishing-data";

type TicketWriteDb = {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: unknown[]) => Promise<T>;
};

function ticketDb() {
  return db as unknown as TicketWriteDb;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid ticket package request.");
  if (!hasDatabaseUrl()) return apiError("Database is required to save event tickets.", 503);

  const id = readString(body.id);
  const eventId = readString(body.eventId);
  const name = readString(body.name);
  const slug = slugify(readString(body.slug) || name);
  const description = readString(body.description);
  const audience = readString(body.audience);
  const benefits = readString(body.benefits).split("\n").map((item) => item.trim()).filter(Boolean);
  const price = readPositiveInt(body.price);
  const capacity = readPositiveInt(body.capacity);
  const color = readString(body.color) || "#00539C";
  const status = readString(body.status) || "DRAFT";
  const showInShop = Boolean(body.showInShop);

  if (!eventId || !name || !slug || !description || !price) return apiError("Event, package name, description, and price are required.");

  const packageId = id || crypto.randomUUID();
  const rows = await ticketDb().$queryRawUnsafe<Array<{ id: string }>>(
    `INSERT INTO "EventTicketPackage"
     ("id", "eventId", "name", "slug", "description", "audience", "benefits", "price", "capacity", "color", "status", "showInShop", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7::text[], $8, $9, $10, $11, $12, NOW())
     ON CONFLICT ("eventId", "slug") DO UPDATE SET
       "name" = EXCLUDED."name",
       "description" = EXCLUDED."description",
       "audience" = EXCLUDED."audience",
       "benefits" = EXCLUDED."benefits",
       "price" = EXCLUDED."price",
       "capacity" = EXCLUDED."capacity",
       "color" = EXCLUDED."color",
       "status" = EXCLUDED."status",
       "showInShop" = EXCLUDED."showInShop",
       "updatedAt" = NOW()
     RETURNING "id"`,
    packageId,
    eventId,
    name,
    slug,
    description,
    audience || null,
    benefits,
    price,
    capacity,
    color,
    status,
    showInShop
  );

  await db.auditLog.create({
    data: {
      action: id ? "Updated event ticket package" : "Created event ticket package",
      entityType: "EventTicketPackage",
      entityId: rows[0]?.id || packageId,
      metadata: { name, eventId, price, capacity, showInShop }
    }
  }).catch(() => null);

  return NextResponse.json({ ok: true, id: rows[0]?.id || packageId, nextAction: "Ticket package saved." });
}
