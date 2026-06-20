import { notFound } from "next/navigation";
import { GalleryItemForm } from "@/components/GalleryItemForm";
import { galleryAlbumFromSlug, galleryAlbumSlug, getGalleryItems } from "@/lib/publishing-data";

type AdminGalleryAlbumPageProps = {
  params: Promise<{ album: string }>;
};

export default async function AdminGalleryAlbumPage({ params }: AdminGalleryAlbumPageProps) {
  const { album } = await params;
  const albumName = galleryAlbumFromSlug(album);
  if (!albumName) notFound();

  const items = (await getGalleryItems({ admin: true })).filter((item) => item.category === albumName);
  const publishedCount = items.filter((item) => item.status === "PUBLISHED").length;
  const publicAlbumHref = `/gallery/albums/${galleryAlbumSlug(albumName)}`;

  return (
    <>
      <header className="adminTopbar">
        <div>
          <p className="eyebrow">Album manager</p>
          <h1>{albumName}</h1>
        </div>
        <div className="adminActions">
          <a href="/admin/content">Content studio</a>
          <a href={publicAlbumHref}>Preview public album</a>
          <a className="primaryAction" href="#add-image">Add image</a>
        </div>
      </header>

      <section className="adminKpis">
        {[
          ["Images", String(items.length), "in this album"],
          ["Published", String(publishedCount), "visible publicly"],
          ["Drafts", String(items.length - publishedCount), "not yet public"]
        ].map(([label, value, meta]) => (
          <article key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>
        ))}
        <article className="adminRouteKpi">
          <span>Album route</span>
          <a href={publicAlbumHref}>{publicAlbumHref}</a>
          <small>public page</small>
        </article>
      </section>

      <section className="adminDashboardGrid">
        <article className="appPanel span5 contentEditorPanel" id="add-image">
          <div className="panelHeader editorPanelHeader">
            <div>
              <p className="eyebrow">Add image</p>
              <h2>Add to {albumName}</h2>
              <span>The album is already selected. Add the image path, caption, and publish when ready.</span>
            </div>
          </div>
          <GalleryItemForm defaultCategory={albumName} submitLabel={`Add to ${albumName}`} />
        </article>

        <article className="appPanel span7">
          <div className="panelHeader">
            <div><p className="eyebrow">Album images</p><h2>Current coverage</h2></div>
            <a className="panelLink" href={publicAlbumHref}>Open public view</a>
          </div>
          {items.length ? (
            <div className="adminAlbumImageGrid">
              {items.map((item) => (
                <a href={`/gallery/${item.slug}`} key={item.id}>
                  <img src={item.imageUrl} alt="" />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.status}</small>
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="adminEmptyState">
              <strong>No images in this album yet</strong>
              <span>Add the first image using the form on this page.</span>
            </div>
          )}
        </article>
      </section>
    </>
  );
}
