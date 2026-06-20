import { BlogPostForm } from "@/components/BlogPostForm";
import { GalleryItemForm } from "@/components/GalleryItemForm";
import { galleryAlbumNames, galleryAlbumSlug, getBlogPosts, getGalleryItems } from "@/lib/publishing-data";

export default async function AdminContentPage() {
  const [posts, galleries] = await Promise.all([
    getBlogPosts({ admin: true }),
    getGalleryItems({ admin: true })
  ]);
  const publishedPosts = posts.filter((post) => post.status === "PUBLISHED").length;
  const publishedGalleries = galleries.filter((item) => item.status === "PUBLISHED").length;
  const draftPosts = posts.length - publishedPosts;
  const draftGalleries = galleries.length - publishedGalleries;
  const albumCounts = galleryAlbumNames.map((album) => ({
    album,
    count: galleries.filter((item) => item.category === album).length
  }));

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
          ["Drafts", String(draftPosts + draftGalleries), "waiting review"],
          ["Public content", String(publishedPosts + publishedGalleries), "live cards"]
        ].map(([label, value, meta]) => (
          <article key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>
        ))}
      </section>

      <section className="adminDashboardGrid">
        <article className="appPanel span12">
          <div className="panelHeader"><div><p className="eyebrow">Moderation</p><h2>Publishing flow</h2></div></div>
          <div className="contentOpsGrid">
            <span><strong>Draft</strong>Saved by admin but hidden from public pages.</span>
            <span><strong>Pending review</strong>Ready for approval, image checks, and story consent review.</span>
            <span><strong>Published</strong>Visible as public cards that open dedicated pages.</span>
            <span><strong>Archived</strong>Kept for records but removed from the public experience.</span>
          </div>
        </article>
        <article className="appPanel span6 contentEditorPanel" id="new-blog">
          <div className="panelHeader editorPanelHeader">
            <div>
              <p className="eyebrow">Blog editor</p>
              <h2>Create news or blog post</h2>
              <span>Write the story, add the hero image, then save as draft or publish.</span>
            </div>
          </div>
          <BlogPostForm />
        </article>
        <article className="appPanel span6 contentEditorPanel" id="new-gallery">
          <div className="panelHeader editorPanelHeader">
            <div>
              <p className="eyebrow">Gallery editor</p>
              <h2>Create gallery card</h2>
              <span>Add an image to the right album with a clear visitor-facing caption.</span>
            </div>
          </div>
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
        <article className="appPanel span12">
          <div className="panelHeader"><div><p className="eyebrow">Album manager</p><h2>Gallery coverage</h2></div><a className="panelLink" href="#new-gallery">Quick add image</a></div>
          <div className="albumManagerGrid">
            {albumCounts.map((album) => (
              <a href={`/admin/content/gallery/${galleryAlbumSlug(album.album)}`} key={album.album}>
                <strong>{album.album}</strong>
                <span>{album.count} images</span>
                <small>Manage album and add images</small>
              </a>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
