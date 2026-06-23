import { MerchandiseAdminPanel } from "@/components/MerchandiseAdminPanel";
import { formatKes } from "@/lib/content";
import { getMerchandiseProducts } from "@/lib/merchandise-data";
import { getShopOrders } from "@/lib/shop-order-data";

export default async function AdminMerchandisePage() {
  const [products, orders] = await Promise.all([
    getMerchandiseProducts({ admin: true }),
    getShopOrders()
  ]);
  const activeProducts = products.filter((product) => product.status === "ACTIVE");
  const stockUnits = products.reduce((total, product) => total + product.stockQuantity, 0);
  const lowStock = products.filter((product) => product.stockQuantity <= 10 && product.status === "ACTIVE").length;
  const inventoryValue = products.reduce((total, product) => total + product.price * product.stockQuantity, 0);
  const orderRevenue = orders.reduce((total, order) => total + order.amount, 0);

  return (
    <>
      <header className="adminTopbar">
        <div>
          <p className="eyebrow">Shop</p>
          <h1>Shop and inventory</h1>
        </div>
        <div className="adminActions">
          <a href="/admin/events">Event tickets</a>
          <a href="/shop">Preview shop</a>
          <a className="primaryAction" href="#product-editor">Add product</a>
        </div>
      </header>

      <section className="adminKpis">
        {[
          ["Active products", String(activeProducts.length), "visible in the public shop", "#product-editor"],
          ["Stock units", String(stockUnits), "available for sale", "#product-editor"],
          ["Low stock", String(lowStock), "active products need attention", "#product-editor"],
          ["Stock value", formatKes(inventoryValue), "at listed price", "#product-editor"],
          ["Shop orders", String(orders.length), `${formatKes(orderRevenue)} recorded`, "#shop-orders"]
        ].map(([label, value, meta, href]) => (
          <a className="adminKpiCard" href={href} key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></a>
        ))}
      </section>

      <MerchandiseAdminPanel products={products} />

      <section className="adminDashboardGrid" id="shop-orders">
        <article className="appPanel span12">
          <div className="panelHeader">
            <div><p className="eyebrow">Order history</p><h2>Latest shop purchases</h2></div>
            <a className="panelLink" href="/admin/finance">Review finance</a>
          </div>
          {orders.length ? (
            <div className="simpleTable shopOrderTable">
              {orders.map((order) => (
                <div key={order.id}>
                  <strong>{order.customerName}<small>{order.customerContact}</small></strong>
                  <span>{order.item}<small>{order.size ? `Size ${order.size} / ` : ""}Qty {order.quantity}</small></span>
                  <span>{formatKes(order.amount)}<small>{order.method.replace("_", " ")}</small></span>
                  <em className={order.status === "CONFIRMED" ? "status success" : "status warning"}>{order.status}</em>
                  <a className="panelLink" href={`/donations/${order.id}/status`}>Receipt</a>
                </div>
              ))}
            </div>
          ) : (
            <div className="adminEmptyState">
              <strong>No shop orders yet</strong>
              <span>Completed shop checkouts will appear here with receipt links and customer contacts.</span>
            </div>
          )}
        </article>
      </section>
    </>
  );
}
