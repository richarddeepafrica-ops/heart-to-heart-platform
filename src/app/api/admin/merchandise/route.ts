import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl, readPositiveInt, readString } from "@/lib/api";
import { writeAuditLog } from "@/lib/admin-system";
import { db } from "@/lib/db";
import { slugify } from "@/lib/publishing-data";

type MerchandiseWriteDb = {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: unknown[]) => Promise<T>;
};

const statuses = ["DRAFT", "ACTIVE", "ARCHIVED"];

function merchandiseDb() {
  return db as unknown as MerchandiseWriteDb;
}

function revalidateMerchandisePaths(slug?: string) {
  revalidatePath("/shop");
  revalidatePath("/admin/merchandise");
  if (slug) revalidatePath(`/shop/${slug}`);
}

function readProductPayload(body: Record<string, unknown>) {
  const name = readString(body.name);
  const slug = slugify(readString(body.slug) || name);
  const category = readString(body.category) || "Merchandise";
  const description = readString(body.description);
  const imageUrl = readString(body.imageUrl);
  const price = readPositiveInt(body.price);
  const stockQuantity = Math.max(0, readPositiveInt(body.stockQuantity));
  const statusCandidate = readString(body.status).toUpperCase();
  const status = statuses.includes(statusCandidate) ? statusCandidate : "DRAFT";
  const featured = Boolean(body.featured);
  const causeLabel = readString(body.causeLabel) || "Supports Heart to Heart Foundation programmes";

  return { name, slug, category, description, imageUrl, price, stockQuantity, status, featured, causeLabel };
}

function validateProduct(product: ReturnType<typeof readProductPayload>) {
  if (!product.name) return "Product name is required.";
  if (!product.slug) return "Product slug is required.";
  if (!product.description) return "Product description is required.";
  if (product.price < 100) return "Product price must be at least KES 100.";
  return "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid merchandise request.");

  const product = readProductPayload(body);
  const validationMessage = validateProduct(product);
  if (validationMessage) return apiError(validationMessage);

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      product: { id: `preview-product-${Date.now()}`, ...product },
      publicUrl: product.status === "ACTIVE" ? `/shop/${product.slug}` : null,
      nextAction: "Connect DATABASE_URL and run migrations to save merchandise permanently."
    });
  }

  try {
    const id = `merch_${crypto.randomUUID().replace(/-/g, "")}`;
    const rows = await merchandiseDb().$queryRawUnsafe<unknown[]>(
      `INSERT INTO "MerchandiseProduct"
        ("id", "slug", "name", "category", "description", "imageUrl", "price", "stockQuantity", "status", "featured", "causeLabel", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
       ON CONFLICT ("slug") DO UPDATE SET
         "name" = EXCLUDED."name",
         "category" = EXCLUDED."category",
         "description" = EXCLUDED."description",
         "imageUrl" = EXCLUDED."imageUrl",
         "price" = EXCLUDED."price",
         "stockQuantity" = EXCLUDED."stockQuantity",
         "status" = EXCLUDED."status",
         "featured" = EXCLUDED."featured",
         "causeLabel" = EXCLUDED."causeLabel",
         "updatedAt" = NOW()
       RETURNING *`,
      id,
      product.slug,
      product.name,
      product.category,
      product.description,
      product.imageUrl || null,
      product.price,
      product.stockQuantity,
      product.status,
      product.featured,
      product.causeLabel
    );

    await writeAuditLog({
      actorEmail: "Admin",
      action: product.status === "ACTIVE" ? "Published merchandise product" : "Saved merchandise product",
      entityType: "MerchandiseProduct",
      entityId: id,
      metadata: { slug: product.slug, name: product.name, price: product.price, stockQuantity: product.stockQuantity }
    });

    revalidateMerchandisePaths(product.slug);

    return NextResponse.json({
      ok: true,
      mode: "database",
      product: rows[0],
      publicUrl: product.status === "ACTIVE" ? `/shop/${product.slug}` : null,
      nextAction: product.status === "ACTIVE" ? "Product is live in the shop." : "Product saved as draft."
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Product could not be created. Check that migrations have run and the slug is unique." },
      { status: 503 }
    );
  }
}

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid merchandise update request.");

  const id = readString(body.id);
  if (!id) return apiError("Product id is required.");

  const product = readProductPayload(body);
  const validationMessage = validateProduct(product);
  if (validationMessage) return apiError(validationMessage);

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      product: { id, ...product },
      publicUrl: product.status === "ACTIVE" ? `/shop/${product.slug}` : null,
      nextAction: "Connect DATABASE_URL and run migrations to update merchandise permanently."
    });
  }

  try {
    const rows = await merchandiseDb().$queryRawUnsafe<unknown[]>(
      `UPDATE "MerchandiseProduct"
       SET "slug" = $2,
           "name" = $3,
           "category" = $4,
           "description" = $5,
           "imageUrl" = $6,
           "price" = $7,
           "stockQuantity" = $8,
           "status" = $9,
           "featured" = $10,
           "causeLabel" = $11,
           "updatedAt" = NOW()
       WHERE "id" = $1
       RETURNING *`,
      id,
      product.slug,
      product.name,
      product.category,
      product.description,
      product.imageUrl || null,
      product.price,
      product.stockQuantity,
      product.status,
      product.featured,
      product.causeLabel
    );

    if (!rows[0]) {
      const fallbackId = id.startsWith("preview-") ? `merch_${crypto.randomUUID().replace(/-/g, "")}` : id;
      rows.push(...await merchandiseDb().$queryRawUnsafe<unknown[]>(
        `INSERT INTO "MerchandiseProduct"
          ("id", "slug", "name", "category", "description", "imageUrl", "price", "stockQuantity", "status", "featured", "causeLabel", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
         ON CONFLICT ("slug") DO UPDATE SET
           "name" = EXCLUDED."name",
           "category" = EXCLUDED."category",
           "description" = EXCLUDED."description",
           "imageUrl" = EXCLUDED."imageUrl",
           "price" = EXCLUDED."price",
           "stockQuantity" = EXCLUDED."stockQuantity",
           "status" = EXCLUDED."status",
           "featured" = EXCLUDED."featured",
           "causeLabel" = EXCLUDED."causeLabel",
           "updatedAt" = NOW()
         RETURNING *`,
        fallbackId,
        product.slug,
        product.name,
        product.category,
        product.description,
        product.imageUrl || null,
        product.price,
        product.stockQuantity,
        product.status,
        product.featured,
        product.causeLabel
      ));
    }

    await writeAuditLog({
      actorEmail: "Admin",
      action: "Updated merchandise product",
      entityType: "MerchandiseProduct",
      entityId: id,
      metadata: { slug: product.slug, name: product.name, price: product.price, stockQuantity: product.stockQuantity, status: product.status }
    });

    revalidateMerchandisePaths(product.slug);

    return NextResponse.json({
      ok: true,
      mode: "database",
      product: rows[0],
      publicUrl: product.status === "ACTIVE" ? `/shop/${product.slug}` : null,
      nextAction: "Product updated."
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Product could not be updated. Check that migrations have run and the slug is unique." },
      { status: 503 }
    );
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = readString(url.searchParams.get("id"));
  const slug = slugify(readString(url.searchParams.get("slug")));
  if (!id && !slug) return apiError("Product id or slug is required.");

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      nextAction: "Connect DATABASE_URL and run migrations to delete merchandise permanently."
    });
  }

  try {
    const rows = await merchandiseDb().$queryRawUnsafe<Array<{ id: string; slug: string; name: string }>>(
      `DELETE FROM "MerchandiseProduct"
       WHERE ${id ? `"id" = $1` : `"slug" = $1`}
       RETURNING "id", "slug", "name"`,
      id || slug
    );
    const deleted = rows[0];
    if (!deleted) return apiError("Product was not found.", 404);

    await writeAuditLog({
      actorEmail: "Admin",
      action: "Deleted merchandise product",
      entityType: "MerchandiseProduct",
      entityId: deleted.id,
      metadata: { slug: deleted.slug, name: deleted.name }
    });

    revalidateMerchandisePaths(deleted.slug);

    return NextResponse.json({ ok: true, mode: "database", nextAction: "Product deleted." });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Product could not be deleted. Check that migrations have run." },
      { status: 503 }
    );
  }
}
