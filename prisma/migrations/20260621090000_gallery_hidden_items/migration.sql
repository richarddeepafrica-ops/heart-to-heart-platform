CREATE TABLE "GalleryHiddenItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryHiddenItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GalleryHiddenItem_slug_key" ON "GalleryHiddenItem"("slug");
