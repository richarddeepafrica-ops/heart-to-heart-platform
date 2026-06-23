import { formatKes } from "@/lib/content";
import { getEventTicketPackages } from "@/lib/event-ticket-data";
import { getMerchandiseProducts } from "@/lib/merchandise-data";

export default async function MerchandiseShopPage() {
  const [products, eventTickets] = await Promise.all([
    getMerchandiseProducts(),
    getEventTicketPackages({ shopOnly: true })
  ]);
  const featured = products.find((product) => product.featured) || products[0];
  const remainingProducts = products.filter((product) => product.id !== featured?.id);

  return (
    <main>
      <section className="shopHero">
        <div>
          <p className="eyebrow">Shop</p>
          <h1>Choose something useful. Fund something life-saving.</h1>
          <p>
            Every purchase supports Heart to Heart Foundation programmes, from treatment and follow-up care to prevention outreach and fundraising events.
          </p>
          <div className="heroActions">
            <a className="button primary" href="#shop-products">Browse shop</a>
            <a className="button secondary" href="#event-tickets">Event tickets</a>
          </div>
        </div>
        {featured ? (
          <a className="shopHeroFeature" href={`/shop/${featured.slug}`} aria-label={`Shop ${featured.name}`}>
            <span className="shopHeroTag">Featured item</span>
            <div className="shopHeroFeatureImage">
              <img src={featured.imageUrl} alt="" />
            </div>
            <div className="shopHeroFeatureMeta">
              <span>{featured.category}</span>
              <strong>{featured.name}</strong>
              <small>{formatKes(featured.price)}</small>
            </div>
          </a>
        ) : null}
      </section>

      <section className="shopSectionIntro" id="shop-products">
        <div>
          <p className="eyebrow">Available now</p>
          <h2>Foundation shop</h2>
        </div>
      </section>

      <section className="shopGrid">
        {[featured, ...remainingProducts].filter(Boolean).map((product) => (
          <a className="shopProductCard" href={`/shop/${product.slug}`} key={product.id}>
            <div className="shopProductImage">
              <img src={product.imageUrl} alt="" />
            </div>
            <div className="shopProductBody">
              <span>{product.category}</span>
              <strong>{product.name}</strong>
              <div>
                <b>{formatKes(product.price)}</b>
                <small>Buy now</small>
              </div>
            </div>
          </a>
        ))}
      </section>

      <section className="shopSectionIntro eventTicketIntro" id="event-tickets">
        <div>
          <p className="eyebrow">Event tickets</p>
          <h2>Register for foundation events</h2>
        </div>
      </section>

      <section className="shopGrid eventTicketShopGrid">
        {eventTickets.map((ticket) => (
          <a className="shopProductCard eventTicketCard" href={`/events/heart-run/register?package=${encodeURIComponent(ticket.name)}`} key={ticket.id} style={{ background: `linear-gradient(135deg, ${ticket.color}, #063666)` }}>
            <div className="shopProductBody">
              <span>{ticket.eventTitle}</span>
              <strong>{ticket.name}</strong>
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
