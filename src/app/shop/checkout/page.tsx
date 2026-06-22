import { notFound } from "next/navigation";
import { ShopCheckoutForm } from "@/components/ShopCheckoutForm";
import { getMerchandiseProduct } from "@/lib/merchandise-data";

type ShopCheckoutPageProps = {
  searchParams: Promise<{ productSlug?: string; quantity?: string; size?: string }>;
};

export default async function ShopCheckoutPage({ searchParams }: ShopCheckoutPageProps) {
  const params = await searchParams;
  const productSlug = params.productSlug || "";
  const product = await getMerchandiseProduct(productSlug);
  if (!product) notFound();

  const quantity = Math.max(1, Number(params.quantity) || 1);
  const size = params.size && ["S", "M", "L", "XL"].includes(params.size) ? params.size : undefined;

  return (
    <main>
      <section className="shopCheckoutHero">
        <a className="panelLink" href={`/shop/${product.slug}`}>Back to product</a>
        <h1>Checkout</h1>
        <p>Confirm your item, add contact details, and choose how you want to pay.</p>
      </section>
      <ShopCheckoutForm product={product} quantity={quantity} size={size} />
    </main>
  );
}
