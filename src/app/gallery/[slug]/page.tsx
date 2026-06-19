import { notFound } from "next/navigation";
import { GalleryPhotoControls } from "@/components/GalleryPhotoControls";
import { galleryAlbumSlug, getGalleryItem, getGalleryItems } from "@/lib/publishing-data";

type GalleryPageContext = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const items = await getGalleryItems();
  return items.map((item) => ({ slug: item.slug }));
}

export default async function GalleryDetailPage({ params }: GalleryPageContext) {
  const { slug } = await params;
  const [item, items] = await Promise.all([
    getGalleryItem(slug),
    getGalleryItems()
  ]);
  if (!item) notFound();

  const albumItems = items.filter((entry) => entry.category === item.category);
  const currentIndex = albumItems.findIndex((entry) => entry.slug === item.slug);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const previousItem = albumItems[(safeIndex - 1 + albumItems.length) % albumItems.length];
  const nextItem = albumItems[(safeIndex + 1) % albumItems.length];
  const previousHref = `/gallery/${previousItem.slug}`;
  const nextHref = `/gallery/${nextItem.slug}`;
  const albumHref = `/gallery/albums/${galleryAlbumSlug(item.category)}`;
  const thumbnailItems = albumItems.slice(safeIndex + 1, safeIndex + 9);
  const fallbackThumbnailItems = albumItems.slice(0, Math.max(0, 8 - thumbnailItems.length));
  const previewItems = [...thumbnailItems, ...fallbackThumbnailItems];

  return (
    <main>
      <GalleryPhotoControls previousHref={previousHref} nextHref={nextHref} />
      <article className="galleryViewer">
        <div className="galleryViewerTopbar">
          <a href={albumHref}>Back to {item.category}</a>
          <a href="/gallery">All albums</a>
        </div>
        <div className="galleryViewerStage">
          <a className="galleryViewerArrow previous" href={previousHref} aria-label="Previous photo">
            &larr;
          </a>
          <img src={item.imageUrl} alt="" />
          <a className="galleryViewerArrow next" href={nextHref} aria-label="Next photo">
            &rarr;
          </a>
        </div>
        <div className="galleryViewerMeta">
          <span>{item.category}</span>
          <strong>{item.title}</strong>
          <small>Use arrow keys, swipe, or the thumbnails to browse.</small>
        </div>
        <nav className="galleryThumbnailRail" aria-label="Next photos in this album">
          {previewItems.map((preview) => (
            <a href={`/gallery/${preview.slug}`} key={preview.id} aria-label={`Open ${preview.title}`}>
              <img src={preview.imageUrl} alt="" />
            </a>
          ))}
        </nav>
      </article>
    </main>
  );
}
