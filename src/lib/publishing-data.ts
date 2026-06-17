import { hasDatabaseUrl } from "@/lib/api";
import { db } from "@/lib/db";
import { importedBlogPosts } from "@/lib/imported-blogs";
import { importedGalleryItems } from "@/lib/imported-gallery";

export type BlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  imageUrl: string;
  authorName: string;
  status: string;
  publishedAt: Date;
  createdAt: Date;
};

export type GalleryRecord = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  location: string;
  status: string;
  takenAt: Date;
  publishedAt: Date;
  createdAt: Date;
};

type DbBlogPost = Omit<BlogPostRecord, "imageUrl" | "authorName" | "publishedAt"> & {
  imageUrl: string | null;
  authorName: string | null;
  publishedAt: Date | null;
};

type DbGalleryItem = Omit<GalleryRecord, "location" | "takenAt" | "publishedAt"> & {
  location: string | null;
  takenAt: Date | null;
  publishedAt: Date | null;
};

type PublishingDb = {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: unknown[]) => Promise<T>;
};

const fallbackImage = "/assets/hero/DSC_0634-scaled.jpg";
export const previewBlogPosts: BlogPostRecord[] = importedBlogPosts;

export const previewGalleryItems: GalleryRecord[] = importedGalleryItems;

function publishingDb() {
  return db as unknown as PublishingDb;
}

async function tableExists(tableName: string) {
  if (!hasDatabaseUrl()) return false;

  try {
    const rows = await publishingDb().$queryRawUnsafe<Array<{ exists: string | null }>>(
      "SELECT to_regclass($1)::text as exists",
      `public."${tableName}"`
    );
    return Boolean(rows[0]?.exists);
  } catch (error) {
    return false;
  }
}

function normalizeBlog(post: DbBlogPost): BlogPostRecord {
  return {
    ...post,
    imageUrl: post.imageUrl || fallbackImage,
    authorName: post.authorName || "Heart to Heart Foundation",
    publishedAt: post.publishedAt || post.createdAt
  };
}

function normalizeGallery(item: DbGalleryItem): GalleryRecord {
  return {
    ...item,
    location: item.location || "Heart to Heart Foundation",
    takenAt: item.takenAt || item.createdAt,
    publishedAt: item.publishedAt || item.createdAt
  };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function getBlogPosts({ admin = false } = {}) {
  if (!hasDatabaseUrl()) return admin ? previewBlogPosts : previewBlogPosts.filter((post) => post.status === "PUBLISHED");
  if (!(await tableExists("BlogPost"))) return admin ? previewBlogPosts : previewBlogPosts.filter((post) => post.status === "PUBLISHED");

  try {
    const posts = await publishingDb().$queryRawUnsafe<DbBlogPost[]>(
      `SELECT * FROM "BlogPost" ${admin ? "" : `WHERE "status" = 'PUBLISHED'`} ORDER BY "publishedAt" DESC NULLS LAST, "createdAt" DESC`
    );
    const databasePosts = posts.map(normalizeBlog);
    const importedPosts = admin ? previewBlogPosts : previewBlogPosts.filter((post) => post.status === "PUBLISHED");
    const databaseSlugs = new Set(databasePosts.map((post) => post.slug));
    return [...databasePosts, ...importedPosts.filter((post) => !databaseSlugs.has(post.slug))];
  } catch (error) {
    return admin ? previewBlogPosts : previewBlogPosts.filter((post) => post.status === "PUBLISHED");
  }
}

export async function getBlogPost(slug: string) {
  const preview = previewBlogPosts.find((post) => post.slug === slug);
  if (!hasDatabaseUrl()) return preview || null;
  if (!(await tableExists("BlogPost"))) return preview || null;

  try {
    const rows = await publishingDb().$queryRawUnsafe<DbBlogPost[]>(
      `SELECT * FROM "BlogPost" WHERE "slug" = $1 LIMIT 1`,
      slug
    );
    const post = rows[0] || null;
    if (!post || post.status !== "PUBLISHED") return preview || null;
    return normalizeBlog(post);
  } catch (error) {
    return preview || null;
  }
}

export async function getGalleryItems({ admin = false } = {}) {
  if (!hasDatabaseUrl()) return admin ? previewGalleryItems : previewGalleryItems.filter((item) => item.status === "PUBLISHED");
  if (!(await tableExists("GalleryItem"))) return admin ? previewGalleryItems : previewGalleryItems.filter((item) => item.status === "PUBLISHED");

  try {
    const items = await publishingDb().$queryRawUnsafe<DbGalleryItem[]>(
      `SELECT * FROM "GalleryItem" ${admin ? "" : `WHERE "status" = 'PUBLISHED'`} ORDER BY "publishedAt" DESC NULLS LAST, "createdAt" DESC`
    );
    const databaseItems = items.map(normalizeGallery);
    const importedItems = admin ? previewGalleryItems : previewGalleryItems.filter((item) => item.status === "PUBLISHED");
    const databaseSlugs = new Set(databaseItems.map((item) => item.slug));
    return [...databaseItems, ...importedItems.filter((item) => !databaseSlugs.has(item.slug))];
  } catch (error) {
    return admin ? previewGalleryItems : previewGalleryItems.filter((item) => item.status === "PUBLISHED");
  }
}

export async function getGalleryItem(slug: string) {
  const preview = previewGalleryItems.find((item) => item.slug === slug);
  if (!hasDatabaseUrl()) return preview || null;
  if (!(await tableExists("GalleryItem"))) return preview || null;

  try {
    const rows = await publishingDb().$queryRawUnsafe<DbGalleryItem[]>(
      `SELECT * FROM "GalleryItem" WHERE "slug" = $1 LIMIT 1`,
      slug
    );
    const item = rows[0] || null;
    if (!item || item.status !== "PUBLISHED") return preview || null;
    return normalizeGallery(item);
  } catch (error) {
    return preview || null;
  }
}
