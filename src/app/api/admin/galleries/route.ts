import crypto from "crypto";
import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl, readString } from "@/lib/api";
import { db } from "@/lib/db";
import { slugify } from "@/lib/publishing-data";

type GalleryWriteDb = {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: unknown[]) => Promise<T>;
};

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
    const item = rows[0];

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
