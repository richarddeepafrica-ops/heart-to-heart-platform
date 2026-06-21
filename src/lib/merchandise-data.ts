import { hasDatabaseUrl } from "@/lib/api";
import { db } from "@/lib/db";
import { slugify } from "@/lib/publishing-data";

export type MerchandiseProductRecord = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  price: number;
  stockQuantity: number;
  status: string;
  featured: boolean;
  causeLabel: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type MerchandiseDb = {
  $queryRawUnsafe: <T = unknown>(query: string, ...values: unknown[]) => Promise<T>;
};

type MerchandiseRow = {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  description: string;
  imageUrl: string | null;
  price: number;
  stockQuantity: number;
  status: string;
  featured: boolean;
  causeLabel: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

const previewProducts: MerchandiseProductRecord[] = [
  {
    id: "preview-heart-run-tee",
    slug: "heart-run-t-shirt",
    name: "Heart Run T-shirt",
    category: "Apparel",
    description: "A soft foundation T-shirt for Heart Run supporters, school teams, and community champions.",
    imageUrl: "/assets/hero/DSC_0634-scaled.jpg",
    price: 1500,
    stockQuantity: 120,
    status: "ACTIVE",
    featured: true,
    causeLabel: "Supports children awaiting heart care"
  },
  {
    id: "preview-foundation-cap",
    slug: "foundation-cap",
    name: "Foundation Cap",
    category: "Accessories",
    description: "A branded cap for events, volunteer days, and everyday support of the foundation mission.",
    imageUrl: "/assets/hero/DSC_0101-scaled.jpg",
    price: 900,
    stockQuantity: 80,
    status: "ACTIVE",
    featured: false,
    causeLabel: "Supports prevention outreach"
  },
  {
    id: "preview-run-bottle",
    slug: "heart-run-water-bottle",
    name: "Heart Run Water Bottle",
    category: "Event gear",
    description: "Reusable event bottle for walkers, runners, and teams raising awareness for young hearts.",
    imageUrl: "/assets/hero/Heart-to-Heart-Foundation-6.jpg",
    price: 1200,
    stockQuantity: 60,
    status: "ACTIVE",
    featured: false,
    causeLabel: "Supports Heart Run fundraising"
  },
  {
    id: "preview-supporter-tote",
    slug: "supporter-tote-bag",
    name: "Supporter Tote Bag",
    category: "Accessories",
    description: "A clean, practical tote for supporters who want daily visibility for the cause.",
    imageUrl: "/assets/impact/CDB_6159-scaled.jpg",
    price: 1800,
    stockQuantity: 45,
    status: "ACTIVE",
    featured: true,
    causeLabel: "Supports treatment and follow-up care"
  }
];

function merchandiseDb() {
  return db as unknown as MerchandiseDb;
}

async function tableExists(tableName: string) {
  if (!hasDatabaseUrl()) return false;
  try {
    const rows = await merchandiseDb().$queryRawUnsafe<Array<{ exists: boolean }>>(
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

function normalizeProduct(row: MerchandiseRow): MerchandiseProductRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category || "Merchandise",
    description: row.description,
    imageUrl: row.imageUrl || "/assets/hero/DSC_0634-scaled.jpg",
    price: row.price,
    stockQuantity: row.stockQuantity,
    status: row.status,
    featured: row.featured,
    causeLabel: row.causeLabel || "Supports Heart to Heart Foundation programmes",
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

export async function getMerchandiseProducts(options: { admin?: boolean } = {}) {
  if (!(await tableExists("MerchandiseProduct"))) {
    return options.admin ? previewProducts : previewProducts.filter((product) => product.status === "ACTIVE");
  }

  try {
    const where = options.admin ? "" : `WHERE "status" = 'ACTIVE'`;
    const rows = await merchandiseDb().$queryRawUnsafe<MerchandiseRow[]>(
      `SELECT * FROM "MerchandiseProduct"
       ${where}
       ORDER BY "featured" DESC, "createdAt" DESC`
    );
    return rows.map(normalizeProduct);
  } catch {
    return options.admin ? previewProducts : previewProducts.filter((product) => product.status === "ACTIVE");
  }
}

export async function getMerchandiseProduct(slug: string) {
  const safeSlug = slugify(slug);
  if (!(await tableExists("MerchandiseProduct"))) {
    return previewProducts.find((product) => product.slug === safeSlug && product.status === "ACTIVE") || null;
  }

  try {
    const rows = await merchandiseDb().$queryRawUnsafe<MerchandiseRow[]>(
      `SELECT * FROM "MerchandiseProduct"
       WHERE "slug" = $1 AND "status" = 'ACTIVE'
       LIMIT 1`,
      safeSlug
    );
    return rows[0] ? normalizeProduct(rows[0]) : null;
  } catch {
    return previewProducts.find((product) => product.slug === safeSlug && product.status === "ACTIVE") || null;
  }
}
