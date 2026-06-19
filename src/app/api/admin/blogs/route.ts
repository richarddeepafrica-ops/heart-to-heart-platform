import crypto from "crypto";
import { NextResponse } from "next/server";
import { apiError, hasDatabaseUrl, readString } from "@/lib/api";
import { writeAuditLog } from "@/lib/admin-system";
import { db } from "@/lib/db";
import { slugify } from "@/lib/publishing-data";

type BlogWriteDb = {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: unknown[]) => Promise<T>;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return apiError("Invalid blog post request.");

  const title = readString(body.title);
  const slug = slugify(readString(body.slug) || title);
  const category = readString(body.category) || "Foundation updates";
  const excerpt = readString(body.excerpt);
  const content = readString(body.body);
  const imageUrl = readString(body.imageUrl);
  const authorName = readString(body.authorName) || "Heart to Heart Foundation";
  const status = readString(body.status).toUpperCase() === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

  if (!title) return apiError("Blog title is required.");
  if (!slug) return apiError("Blog slug is required.");
  if (!excerpt) return apiError("Blog excerpt is required.");
  if (!content) return apiError("Blog body is required.");

  if (!hasDatabaseUrl()) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      post: { id: `preview-blog-${Date.now()}`, slug, title, category, excerpt, body: content, imageUrl, authorName, status },
      publicUrl: status === "PUBLISHED" ? `/news/${slug}` : null,
      nextAction: "Connect DATABASE_URL and run migrations to save blog posts permanently."
    });
  }

  try {
    const id = `blog_${crypto.randomUUID().replace(/-/g, "")}`;
    const rows = await (db as unknown as BlogWriteDb).$queryRawUnsafe<unknown[]>(
      `INSERT INTO "BlogPost" ("id", "slug", "title", "category", "excerpt", "body", "imageUrl", "authorName", "status", "publishedAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       RETURNING *`,
      id,
      slug,
      title,
      category,
      excerpt,
      content,
      imageUrl || null,
      authorName,
      status,
      status === "PUBLISHED" ? new Date() : null
    );
    const post = rows[0] as { id?: string } | undefined;

    await writeAuditLog({
      actorEmail: "Admin",
      action: status === "PUBLISHED" ? "Published blog post" : "Saved blog draft",
      entityType: "BlogPost",
      entityId: post?.id || id,
      metadata: { slug, title, status }
    });

    return NextResponse.json({
      ok: true,
      mode: "database",
      post,
      publicUrl: status === "PUBLISHED" ? `/news/${slug}` : null,
      nextAction: status === "PUBLISHED" ? "Blog post published to the public website." : "Blog draft saved."
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Blog post could not be created right now. Check that migrations have been run and the slug is unique." },
      { status: 503 }
    );
  }
}
