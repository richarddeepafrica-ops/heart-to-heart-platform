import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/publishing-data";

type BlogPageContext = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPageContext) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <main>
      <article className="storyArticle">
        <section className="storyArticleHero">
          <div>
            <p className="eyebrow">{post.category}</p>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
            <small>By {post.authorName} | {post.publishedAt.toLocaleDateString("en-KE", { dateStyle: "long" })}</small>
          </div>
          <img src={post.imageUrl} alt="" />
        </section>
        <section className="storyArticleBody">
          {post.body.split(/\n{2,}/).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      </article>
    </main>
  );
}
