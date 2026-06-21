import crypto from "crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { apiError, hasDatabaseUrl, readString } from "@/lib/api";
import { writeAuditLog } from "@/lib/admin-system";
import { db } from "@/lib/db";
import { slugify } from "@/lib/publishing-data";

type GalleryWriteDb = {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: unknown[]) => Promise<T>;
};

function revalidateGalleryPaths(slug: string, category?: string | null) {
  revalidatePath("/gallery");
  revalidatePath(`/gallery/${slug}`);
  if (category) revalidatePath(`/gallery/albums/${slugify(category)}`);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid gallery item request.");

  const title = readString(body.title);
  const slug = slugify(readString(body.slug) || title);
  const category = readString(body.category) || "Foundation gallery";
  const description = readString(body.description);
  const imageUrl = readString(body.imageUrl);
  const location = readString(body.location);
  const status = readString(body.status).toUpperCase() === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

  if (!title) return apiError("Gallery title is required.");
  if (!slug) return apiError("Gallery slug is required.");
  if (!description) return apiError("Gallery description is required.");
  if (!imageUrl) return apiError("Gallery image path or URL is required.");

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      item: { id: `preview-gallery-${Date.now()}`, slug, title, category, description, imageUrl, location, status },
      publicUrl: status === "PUBLISHED" ? `/gallery/${slug}` : null,
      nextAction: "Connect DATABASE_URL and run migrations to save gallery items permanently."
    });
  }

  try {
    const id = `gallery_${crypto.randomUUID().replace(/-/g, "")}`;
    const rows = await (db as unknown as GalleryWriteDb).$queryRawUnsafe<unknown[]>(
      `INSERT INTO "GalleryItem" ("id", "slug", "title", "category", "description", "imageUrl", "location", "status", "takenAt", "publishedAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, NOW())
       RETURNING *`,
      id,
      slug,
      title,
      category,
      description,
      imageUrl,
      location || null,
      status,
      status === "PUBLISHED" ? new Date() : null
    );
    const item = rows[0] as { id?: string } | undefined;

    await writeAuditLog({
      actorEmail: "Admin",
      action: status === "PUBLISHED" ? "Published gallery item" : "Saved gallery draft",
      entityType: "GalleryItem",
      entityId: item?.id || id,
      metadata: { slug, title, category, status }
    });

    return NextResponse.json({
      ok: true,
      mode: "database",
      item,
      publicUrl: status === "PUBLISHED" ? `/gallery/${slug}` : null,
      nextAction: status === "PUBLISHED" ? "Gallery item published to the public website." : "Gallery draft saved."
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Gallery item could not be created right now. Check that migrations have been run and the slug is unique." },
      { status: 503 }
    );
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const slug = slugify(readString(url.searchParams.get("slug")));
  const id = readString(url.searchParams.get("id"));

  if (!slug && !id) return apiError("Gallery item slug or id is required.");

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      nextAction: "Connect DATABASE_URL and run migrations to delete or hide gallery items permanently."
    });
  }

  try {
    const rows = await (db as unknown as GalleryWriteDb).$queryRawUnsafe<Array<{ id: string; slug: string; category: string | null }>>(
      `DELETE FROM "GalleryItem"
       WHERE ${id ? `"id" = $1` : `"slug" = $1`}
       RETURNING "id", "slug", "category"`,
      id || slug
    );
    const deleted = rows[0];
    const resolvedSlug = deleted?.slug || slug;

    if (!deleted && resolvedSlug) {
      await (db as unknown as GalleryWriteDb).$queryRawUnsafe(
        `INSERT INTO "GalleryHiddenItem" ("id", "slug", "reason")
         VALUES ($1, $2, $3)
         ON CONFLICT ("slug") DO UPDATE SET "reason" = EXCLUDED."reason"`,
        `hidden_gallery_${crypto.randomUUID().replace(/-/g, "")}`,
        resolvedSlug,
        "Hidden from admin album manager"
      );
    }

    await writeAuditLog({
      actorEmail: "Admin",
      action: deleted ? "Deleted gallery item" : "Hid imported gallery item",
      entityType: "GalleryItem",
      entityId: deleted?.id || id || resolvedSlug,
      metadata: { slug: resolvedSlug, category: deleted?.category || null }
    });

    revalidateGalleryPaths(resolvedSlug, deleted?.category);

    return NextResponse.json({
      ok: true,
      mode: "database",
      nextAction: deleted ? "Gallery item deleted." : "Imported gallery item hidden from albums."
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Gallery item could not be deleted. Check that migrations have been run." },
      { status: 503 }
    );
  }
}
