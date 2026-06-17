import { notFound } from "next/navigation";
import { getGalleryItem, getGalleryItems } from "@/lib/publishing-data";

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

  return (
    <main>
      <article className="galleryDetail">
        <div className="galleryDetailMedia">
          <img src={item.imageUrl} alt="" />
        </div>
        <div className="galleryDetailPanel">
          <p className="eyebrow">{item.category} album</p>
          <h1>{item.title}</h1>
          <p>{item.description}</p>
          <small>
            Photo {safeIndex + 1} of {albumItems.length} | {item.location}
          </small>
          <div className="galleryDetailActions">
            <a className="button secondary" href="/gallery">Albums</a>
            {previousItem && <a className="button secondary" href={`/gallery/${previousItem.slug}`}>Previous</a>}
            {nextItem && <a className="button" href={`/gallery/${nextItem.slug}`}>Next photo</a>}
          </div>
        </div>
      </article>
    </main>
  );
}
