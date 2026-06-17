import { getGalleryItems } from "@/lib/publishing-data";

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <main>
      <section className="galleryHero">
        <div>
          <p className="eyebrow">Gallery</p>
          <h1>Images from events, programmes, and impact moments.</h1>
          <p>Published gallery cards from the admin portal collect here for visitors to explore.</p>
        </div>
      </section>
      <section className="section publicContentSection">
        <div className="publicCardGrid galleryGrid">
          {items.map((item) => (
            <article className="publicContentCard galleryCard" key={item.id}>
              <a href={`/gallery/${item.slug}`} aria-label={`Open ${item.title}`}>
                <img src={item.imageUrl} alt="" />
                <div>
                  <span>{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <small>{item.location}</small>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
