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

type DbGalleryHiddenItem = {
  slug: string;
};

type PublishingDb = {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: unknown[]) => Promise<T>;
};

const fallbackImage = "/assets/hero/DSC_0634-scaled.jpg";
export const galleryAlbumNames = ["General", "Gala Dinner", "Teachers Workshop", "Heart Run"] as const;

const heartRunGalaSlugs = new Set([
  "gala-dinner-dsc-5697-9",
  "gala-dinner-dsc-5705-10",
  "gala-dinner-dsc-5966-11",
  "gala-dinner-dsc-6054-12",
  "gala-dinner-dsc-6066-13",
  "gala-dinner-dsc-6692-14",
  "gala-dinner-dsc-6704-15"
]);

export function galleryAlbumSlug(category: string) {
  return normalizeGalleryCategory(category)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function galleryAlbumFromSlug(slug: string) {
  return galleryAlbumNames.find((name) => galleryAlbumSlug(name) === slug) || null;
}

export function normalizeGalleryCategory(category: string, slug = "") {
  if (heartRunGalaSlugs.has(slug)) return "Heart Run";
  if (/gala/i.test(category)) return "Gala Dinner";
  if (/teacher/i.test(category)) return "Teachers Workshop";
  if (/heart run/i.test(category)) return "Heart Run";
  return "General";
}

function isFilenameTitle(title: string) {
  return /^(DSC|CDB|IMG|MG|SAM)\s*[-_\d]/i.test(title) || /^Heart To Heart Foundation\s+\d+$/i.test(title);
}

function publicGalleryTitle(title: string, category: string) {
  if (!isFilenameTitle(title)) return title;
  if (category === "General") return "Foundation moment";
  return `${category} moment`;
}

function publicGalleryDescription(description: string, category: string) {
  if (!description || /photo from the Heart to Heart Foundation gallery/i.test(description)) {
    return `A captured moment from the ${category.toLowerCase()} album.`;
  }
  return description;
}

function publicGallerySlug(slug: string, category: string) {
  if (category === "Heart Run" && heartRunGalaSlugs.has(slug)) {
    return slug.replace(/^gala-dinner-/, "heart-run-");
  }
  return slug;
}

function prepareGalleryItem<T extends GalleryRecord>(item: T): T {
  const category = normalizeGalleryCategory(item.category, item.slug);
  return {
    ...item,
    slug: publicGallerySlug(item.slug, category),
    category,
    title: publicGalleryTitle(item.title, category),
    description: publicGalleryDescription(item.description, category)
  };
}

export const previewBlogPosts: BlogPostRecord[] = importedBlogPosts;

export const previewGalleryItems: GalleryRecord[] = importedGalleryItems.map(prepareGalleryItem);

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
  return prepareGalleryItem({
    ...item,
    location: item.location || "Heart to Heart Foundation",
    takenAt: item.takenAt || item.createdAt,
    publishedAt: item.publishedAt || item.createdAt
  });
}

async function getHiddenGallerySlugs() {
  if (!hasDatabaseUrl()) return new Set<string>();
  if (!(await tableExists("GalleryHiddenItem"))) return new Set<string>();

  try {
    const rows = await publishingDb().$queryRawUnsafe<DbGalleryHiddenItem[]>(
      `SELECT "slug" FROM "GalleryHiddenItem"`
    );
    return new Set(rows.map((row) => row.slug));
  } catch (error) {
    return new Set<string>();
  }
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
    const hiddenSlugs = await getHiddenGallerySlugs();
    const items = await publishingDb().$queryRawUnsafe<DbGalleryItem[]>(
      `SELECT * FROM "GalleryItem" ${admin ? "" : `WHERE "status" = 'PUBLISHED'`} ORDER BY "publishedAt" DESC NULLS LAST, "createdAt" DESC`
    );
    const databaseItems = items.map(normalizeGallery).filter((item) => !hiddenSlugs.has(item.slug));
    const importedItems = (admin ? previewGalleryItems : previewGalleryItems.filter((item) => item.status === "PUBLISHED"))
      .filter((item) => !hiddenSlugs.has(item.slug));
    const databaseSlugs = new Set(databaseItems.map((item) => item.slug));
    return [...databaseItems, ...importedItems.filter((item) => !databaseSlugs.has(item.slug))];
  } catch (error) {
    return admin ? previewGalleryItems : previewGalleryItems.filter((item) => item.status === "PUBLISHED");
  }
}

export async function getGalleryItem(slug: string) {
  const hiddenSlugs = await getHiddenGallerySlugs();
  if (hiddenSlugs.has(slug)) return null;

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
