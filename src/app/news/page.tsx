import { getBlogPosts, getGalleryItems } from "@/lib/publishing-data";

export default async function NewsPage() {
  const [posts, galleries] = await Promise.all([
    getBlogPosts(),
    getGalleryItems()
  ]);

  return (
    <main>
      <section className="newsHero">
        <div>
          <p className="eyebrow">News & Blogs</p>
          <h1>Stories, updates, and heart health notes.</h1>
          <p>
            Foundation news, programme updates, event recaps, galleries, and
            educational articles from the Heart to Heart community.
          </p>
          <div className="heroActions">
            <a className="button primary" href="#latest-posts">Read latest</a>
            <a className="button secondary" href="/gallery">Open gallery</a>
          </div>
        </div>
      </section>

      <section className="section publicContentSection" id="latest-posts">
        <div className="sectionHeading">
          <p className="eyebrow">Latest stories</p>
          <h2>Fresh from the foundation.</h2>
          <p>Read the latest updates, event recaps, health notes, and community stories.</p>
        </div>
        <div className="publicCardGrid">
          {posts.map((post) => (
            <article className="publicContentCard" key={post.id}>
              <a href={`/news/${post.slug}`} aria-label={`Read ${post.title}`}>
                <img src={post.imageUrl} alt="" />
                <div>
                  <span>{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <small>{post.publishedAt.toLocaleDateString("en-KE", { dateStyle: "medium" })}</small>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section publicContentSection altBand">
        <div className="sectionHeading">
          <p className="eyebrow">Gallery highlights</p>
          <h2>Moments from the work.</h2>
        </div>
        <div className="galleryPreviewStrip">
          {galleries.slice(0, 3).map((item) => (
            <a href={`/gallery/${item.slug}`} key={item.id}>
              <img src={item.imageUrl} alt="" />
              <span>{item.category}</span>
              <strong>{item.title}</strong>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
