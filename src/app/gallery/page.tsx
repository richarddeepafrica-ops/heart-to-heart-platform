import { galleryAlbumNames, galleryAlbumSlug, getGalleryItems } from "@/lib/publishing-data";

export default async function GalleryPage() {
  const items = await getGalleryItems();
  const albums = galleryAlbumNames
    .map((name) => {
      const albumItems = items.filter((item) => item.category === name);
      const cover = albumItems[0];
      return cover
        ? {
            name,
            cover,
            count: albumItems.length,
            previewItems: albumItems.slice(0, 4)
          }
        : null;
    })
    .filter(Boolean);

  return (
    <main>
      <section className="galleryHero">
        <div>
          <p className="eyebrow">Gallery</p>
          <h1>Images from events, programmes, and impact moments.</h1>
          <p>Explore the foundation archive through focused albums for general moments, gala dinners, teacher workshops, and Heart Run memories.</p>
        </div>
      </section>
      <section className="section publicContentSection">
        <div className="sectionHeading">
          <p className="eyebrow">Albums</p>
          <h2>Choose a collection to browse.</h2>
        </div>
        <div className="galleryAlbumGrid">
          {albums.map((album) => album && (
            <article className="galleryAlbumCard" key={album.name}>
              <a href={`/gallery/albums/${galleryAlbumSlug(album.name)}`} aria-label={`Open ${album.name} album`}>
                <span className="galleryAlbumMedia">
                  {album.previewItems.map((item) => (
                    <img src={item.imageUrl} alt="" key={item.id} />
                  ))}
                </span>
                <span className="galleryAlbumBody">
                  <span>{album.count} photos</span>
                  <strong>{album.name}</strong>
                  <small>Open album</small>
                </span>
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
