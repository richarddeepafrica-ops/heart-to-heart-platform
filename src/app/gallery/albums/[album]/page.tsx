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
        </div>
        <a className="button secondary" href="/gallery">All albums</a>
      </section>

      <section className="section publicContentSection">
        <div className="galleryPhotoGrid">
          {items.map((item, index) => (
            <a className="galleryPhotoTile" href={`/gallery/${item.slug}`} aria-label={`Open photo ${index + 1} from ${albumName}`} key={item.id}>
              <img src={item.imageUrl} alt="" />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
