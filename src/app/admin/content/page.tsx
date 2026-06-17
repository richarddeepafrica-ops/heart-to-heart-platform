import { BlogPostForm } from "@/components/BlogPostForm";
import { GalleryItemForm } from "@/components/GalleryItemForm";
import { getBlogPosts, getGalleryItems } from "@/lib/publishing-data";

export default async function AdminContentPage() {
  const [posts, galleries] = await Promise.all([
    getBlogPosts({ admin: true }),
    getGalleryItems({ admin: true })
  ]);
  const publishedPosts = posts.filter((post) => post.status === "PUBLISHED").length;
  const publishedGalleries = galleries.filter((item) => item.status === "PUBLISHED").length;

  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Content studio</p><h1>Blogs and gallery publishing</h1></div>
        <div className="adminActions"><a href="/news">View news</a><a className="primaryAction" href="#new-blog">Create blog</a></div>
      </header>

      <section className="adminKpis">
        {[
          ["Blog posts", String(posts.length), `${publishedPosts} published`],
          ["Gallery items", String(galleries.length), `${publishedGalleries} published`],
          ["Drafts", String(posts.length + galleries.length - publishedPosts - publishedGalleries), "waiting review"],
          ["Public content", String(publishedPosts + publishedGalleries), "live cards"]
        ].map(([label, value, meta]) => (
          <article key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>
        ))}
      </section>

      <section className="adminDashboardGrid">
        <article className="appPanel span6" id="new-blog">
          <div className="panelHeader"><div><p className="eyebrow">Blog editor</p><h2>Create news or blog post</h2></div></div>
          <BlogPostForm />
        </article>
        <article className="appPanel span6" id="new-gallery">
          <div className="panelHeader"><div><p className="eyebrow">Gallery editor</p><h2>Create gallery card</h2></div></div>
          <GalleryItemForm />
        </article>
        <details className="appPanel span6 collapsiblePanel">
          <summary className="panelHeader">
            <div><p className="eyebrow">Blog queue</p><h2>Recent posts</h2></div>
            <span className="queueSummaryMeta">{posts.length} items</span>
          </summary>
          <div className="collapsiblePanelBody">
            <a className="panelLink" href="/news">Public list</a>
            <div className="contentQueue">
            {posts.map((post) => (
              <a href={`/news/${post.slug}`} key={post.id}>
                <span>{post.category}</span>
                <strong>{post.title}</strong>
                <small>{post.status}</small>
              </a>
            ))}
            </div>
          </div>
        </details>
        <details className="appPanel span6 collapsiblePanel">
          <summary className="panelHeader">
            <div><p className="eyebrow">Gallery queue</p><h2>Recent images</h2></div>
            <span className="queueSummaryMeta">{galleries.length} items</span>
          </summary>
          <div className="collapsiblePanelBody">
            <a className="panelLink" href="/gallery">Public gallery</a>
            <div className="contentQueue">
            {galleries.map((item) => (
              <a href={`/gallery/${item.slug}`} key={item.id}>
                <span>{item.category}</span>
                <strong>{item.title}</strong>
                <small>{item.status}</small>
              </a>
            ))}
            </div>
          </div>
        </details>
      </section>
    </>
  );
}
