import { notFound } from "next/navigation";
import { ShopCheckoutForm } from "@/components/ShopCheckoutForm";
import { formatKes } from "@/lib/content";
import { getMerchandiseProduct } from "@/lib/merchandise-data";

type MerchandiseProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MerchandiseProductPage({ params }: MerchandiseProductPageProps) {
  const { slug } = await params;
  const product = await getMerchandiseProduct(slug);
  if (!product) notFound();

  return (
    <main>
      <section className="shopProductHero">
        <div className="shopProductMedia">
          <img src={product.imageUrl} alt="" />
        </div>
        <div className="shopProductDetails">
          <a className="panelLink" href="/shop">Back to shop</a>
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <div className="shopProductFacts">
            <span><strong>{formatKes(product.price)}</strong><small>per item</small></span>
            <span><strong>{product.featured ? "Featured" : "Available"}</strong><small>{product.category}</small></span>
          </div>
          <div className="shopCauseCard">
            <span>Proceeds support</span>
            <strong>{product.causeLabel}</strong>
          </div>
          <ShopCheckoutForm product={product} />
        </div>
      </section>
    </main>
  );
}
