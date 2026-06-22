import { eventProducts, formatKes } from "@/lib/content";
import { getMerchandiseProducts } from "@/lib/merchandise-data";

export default async function MerchandiseShopPage() {
  const products = await getMerchandiseProducts();
  const featured = products.find((product) => product.featured) || products[0];

  return (
    <main>
      <section className="shopHero">
        <div>
          <p className="eyebrow">Merchandise shop</p>
          <h1>Wear the mission. Fund the care.</h1>
          <p>
            Merchandise sales support Heart to Heart Foundation programmes, from treatment and follow-up care to prevention outreach and fundraising events.
          </p>
          <div className="heroActions">
            <a className="button primary" href="#shop-products">Shop items</a>
            <a className="button secondary" href="/campaigns">View causes</a>
          </div>
        </div>
        {featured ? (
          <a className="shopHeroFeature" href={`/shop/${featured.slug}`}>
            <img src={featured.imageUrl} alt="" />
            <span>{featured.category}</span>
            <strong>{featured.name}</strong>
            <small>{formatKes(featured.price)}</small>
          </a>
        ) : null}
      </section>

      <section className="sectionIntro compact">
        <p className="eyebrow">Available now</p>
        <h2>Merchandise that gives back</h2>
        <p>Choose an item, confirm quantity, then complete payment through the secure giving checkout.</p>
      </section>

      <section className="shopGrid" id="shop-products">
        {products.map((product) => (
          <a className="shopProductCard" href={`/shop/${product.slug}`} key={product.id}>
            <div className="shopProductImage">
              <img src={product.imageUrl} alt="" />
              {product.featured ? <span>Featured</span> : null}
            </div>
            <div className="shopProductBody">
              <span>{product.category}</span>
              <strong>{product.name}</strong>
              <div>
                <b>{formatKes(product.price)}</b>
                <small>Shop now</small>
              </div>
            </div>
          </a>
        ))}
      </section>

      <section className="sectionIntro compact">
        <p className="eyebrow">Event tickets</p>
        <h2>Register through the shop</h2>
        <p>Event packages can be sold alongside merchandise, with proceeds supporting the same programme work.</p>
      </section>

      <section className="shopGrid eventTicketShopGrid">
        {eventProducts.map((ticket) => (
          <a className="shopProductCard eventTicketCard" href="/events/heart-run/register" key={ticket.name}>
            <div className="shopProductBody">
              <span>Heart Run ticket</span>
              <strong>{ticket.name}</strong>
              <small>{ticket.audience}</small>
              <div>
                <b>{formatKes(ticket.price)}</b>
                <small>Register</small>
              </div>
            </div>
          </a>
        ))}
      </section>
    </main>
  );
}
