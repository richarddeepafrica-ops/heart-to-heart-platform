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
  const item = await getGalleryItem(slug);
  if (!item) notFound();

  return (
    <main>
      <article className="galleryDetail">
        <img src={item.imageUrl} alt="" />
        <div>
          <p className="eyebrow">{item.category}</p>
          <h1>{item.title}</h1>
          <p>{item.description}</p>
          <small>{item.location} | {item.publishedAt.toLocaleDateString("en-KE", { dateStyle: "long" })}</small>
          <a className="button secondary" href="/gallery">Back to gallery</a>
        </div>
      </article>
    </main>
  );
}
