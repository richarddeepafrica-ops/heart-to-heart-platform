import { MerchandiseAdminPanel } from "@/components/MerchandiseAdminPanel";
import { formatKes } from "@/lib/content";
import { getMerchandiseProducts } from "@/lib/merchandise-data";

export default async function AdminMerchandisePage() {
  const products = await getMerchandiseProducts({ admin: true });
  const activeProducts = products.filter((product) => product.status === "ACTIVE");
  const stockUnits = products.reduce((total, product) => total + product.stockQuantity, 0);
  const lowStock = products.filter((product) => product.stockQuantity <= 10 && product.status === "ACTIVE").length;
  const inventoryValue = products.reduce((total, product) => total + product.price * product.stockQuantity, 0);

  return (
    <>
      <header className="adminTopbar">
        <div>
          <p className="eyebrow">Merchandise</p>
          <h1>Shop and inventory</h1>
        </div>
        <div className="adminActions">
          <a href="/shop">Preview shop</a>
          <a className="primaryAction" href="#product-editor">Add product</a>
        </div>
      </header>

      <section className="adminKpis">
        {[
          ["Active products", String(activeProducts.length), "visible in the public shop"],
          ["Stock units", String(stockUnits), "available for sale"],
          ["Low stock", String(lowStock), "active products need attention"],
          ["Stock value", formatKes(inventoryValue), "at listed price"]
        ].map(([label, value, meta]) => (
          <article key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>
        ))}
      </section>

      <MerchandiseAdminPanel products={products} />
    </>
  );
}
