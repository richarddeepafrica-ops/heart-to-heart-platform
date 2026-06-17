import { notFound } from "next/navigation";
import { galleryAlbumFromSlug, galleryAlbumNames, galleryAlbumSlug, getGalleryItems } from "@/lib/publishing-data";

type GalleryAlbumPageContext = {
  params: Promise<{ album: string }>;
};

export function generateStaticParams() {
  return galleryAlbumNames.map((album) => ({ album: galleryAlbumSlug(album) }));
}

export default async function GalleryAlbumPage({ params }: GalleryAlbumPageContext) {
  const { album: albumParam } = await params;
  const albumName = galleryAlbumFromSlug(albumParam);
  if (!albumName) notFound();

  const items = (await getGalleryItems()).filter((item) => item.category === albumName);
  if (!items.length) notFound();

  return (
    <main>
      <section className="galleryAlbumHero">
        <div>
          <p className="eyebrow">Gallery album</p>
          <h1>{albumName}</h1>
          <p>{items.length} photos from the Heart to Heart Foundation archive. Select any image to view it larger, then continue through the album.</p>
        </div>
        <a className="button secondary" href="/gallery">All albums</a>
      </section>

      <section className="section publicContentSection">
        <div className="galleryPhotoGrid">
          {items.map((item, index) => (
            <a className="galleryPhotoTile" href={`/gallery/${item.slug}`} key={item.id}>
              <img src={item.imageUrl} alt="" />
              <span>Photo {index + 1}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
