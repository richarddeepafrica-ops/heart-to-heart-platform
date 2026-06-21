CREATE TABLE "MerchandiseProduct" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL DEFAULT 'Merchandise',
  "description" TEXT NOT NULL,
  "imageUrl" TEXT,
  "price" INTEGER NOT NULL,
  "stockQuantity" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "causeLabel" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MerchandiseProduct_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MerchandiseProduct_slug_key" ON "MerchandiseProduct"("slug");
