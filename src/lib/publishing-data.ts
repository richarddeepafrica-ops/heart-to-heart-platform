import { hasDatabaseUrl } from "@/lib/api";
import { db } from "@/lib/db";

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
const fallbackGalleryImage = "/assets/impact/CDB_6159-scaled.jpg";

export const previewBlogPosts: BlogPostRecord[] = [
  {
    id: "preview-heart-run-recap",
    slug: "heart-run-community-recap",
    title: "Heart Run brings families, schools, and partners together",
    category: "Event recap",
    excerpt: "A look at how the annual Heart Run continues to rally communities behind children awaiting heart care.",
    body: "The Heart Run remains one of the foundation's most visible community moments. Families, schools, partners, and volunteers come together to raise awareness and resources for children who need treatment. Beyond the race day energy, the event keeps heart health prevention in public conversation and reminds every participant that small acts of giving can become life-saving care.",
    imageUrl: fallbackImage,
    authorName: "Heart to Heart Foundation",
    status: "PUBLISHED",
    publishedAt: new Date("2026-06-01"),
    createdAt: new Date("2026-06-01")
  },
  {
    id: "preview-prevention-schools",
    slug: "school-prevention-outreach",
    title: "Why prevention education starts in schools",
    category: "Heart health notes",
    excerpt: "Teachers and schools play a vital role in early awareness for rheumatic fever and childhood heart disease.",
    body: "Prevention work is strongest when it reaches families early. Through school outreach, teacher workshops, and community education, the foundation helps children and caregivers understand symptoms, treatment pathways, and the importance of timely care. This education can reduce avoidable complications and create healthier futures.",
    imageUrl: "/assets/hero/CDB_6210-scaled.jpg",
    authorName: "Programme team",
    status: "PUBLISHED",
    publishedAt: new Date("2026-05-18"),
    createdAt: new Date("2026-05-18")
  }
];

export const previewGalleryItems: GalleryRecord[] = [
  {
    id: "preview-heart-run-gallery",
    slug: "heart-run-opening-moment",
    title: "Heart Run opening moment",
    category: "Heart Run",
    description: "Participants and foundation supporters gather before the run, carrying the mission into a public celebration of care.",
    imageUrl: "/assets/hero/DSC_0634-scaled.jpg",
    location: "Nairobi",
    status: "PUBLISHED",
    takenAt: new Date("2026-06-01"),
    publishedAt: new Date("2026-06-01"),
    createdAt: new Date("2026-06-01")
  },
  {
    id: "preview-impact-gallery",
    slug: "family-impact-testimony",
    title: "A family shares their journey",
    category: "Impact",
    description: "A parent and child share their story during a foundation gathering, reminding supporters why follow-up care matters.",
    imageUrl: fallbackGalleryImage,
    location: "Karen Hospital",
    status: "PUBLISHED",
    takenAt: new Date("2026-05-12"),
    publishedAt: new Date("2026-05-14"),
    createdAt: new Date("2026-05-14")
  }
];

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
    if (!posts.length) return admin ? previewBlogPosts : previewBlogPosts.filter((post) => post.status === "PUBLISHED");
    return posts.map(normalizeBlog);
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
    if (!items.length) return admin ? previewGalleryItems : previewGalleryItems.filter((item) => item.status === "PUBLISHED");
    return items.map(normalizeGallery);
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
