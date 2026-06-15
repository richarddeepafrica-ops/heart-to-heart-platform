import { eventProducts, formatKes } from "@/lib/content";

const events = [
  ["Heart Run", "March 2027", "684 registrations", "Planning"],
  ["Goat Derby", "August", "Sponsor packages", "Draft"],
  ["Gala Dinner", "Nov / Dec", "Major donors", "Planning"]
];

export default function EventsAdminPage() {
  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Events</p><h1>Event operations</h1></div>
        <div className="adminActions"><button type="button">Export registrations</button><button className="primaryAction" type="button">Create event</button></div>
      </header>
      <section className="adminDashboardGrid">
        <article className="appPanel span8">
          <div className="panelHeader"><div><p className="eyebrow">Calendar</p><h2>Fundraising events</h2></div></div>
          <div className="simpleTable">
            {events.map(([name, date, audience, status]) => <div key={name}><strong>{name}</strong><span>{date}</span><span>{audience}</span><em>{status}</em></div>)}
          </div>
        </article>
        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">Heart Run</p><h2>Operational snapshot</h2></div><span className="status">Planning</span></div>
          <div className="eventOps"><strong>684 registrations</strong><span>42 school teams, 18 corporate teams</span><div className="progress"><span style={{ width: "58%" }} /></div><small>Packages, sponsors, and participant messages need confirmation.</small></div>
        </article>
        <article className="appPanel span8">
          <div className="panelHeader">
            <div><p className="eyebrow">Event packages</p><h2>Heart Run registration packages</h2></div>
            <button type="button">Preview checkout</button>
          </div>
          <div className="eventPackageAdminTable">
            <div className="tableHead"><span>Package</span><span>Price</span><span>Sales</span><span>Status</span><span>Action</span></div>
            {eventProducts.map((ticket, index) => (
              <div className="tableLine" key={ticket.name}>
                <span><strong>{ticket.name}</strong><small>{ticket.description}</small></span>
                <span>{formatKes(ticket.price)}</span>
                <span>{[184, 126, 42, 18][index]} sold</span>
                <span className="status success">Published</span>
                <button type="button">Edit</button>
              </div>
            ))}
          </div>
        </article>
        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">Create package</p><h2>Add event package</h2></div></div>
          <div className="builderPreview eventPackageBuilder">
            <label>Event<select defaultValue="heart-run"><option value="heart-run">Heart Run / Walk</option><option value="goat-derby">Goat Derby</option><option value="gala-dinner">Gala Dinner</option></select></label>
            <label>Package name<input defaultValue="Corporate Team" /></label>
            <label>Price<input defaultValue="100000" /></label>
            <label>Capacity<input defaultValue="Unlimited" /></label>
            <button className="primaryAction" type="button">Save package</button>
          </div>
        </article>
        <article className="appPanel span12">
          <div className="panelHeader"><div><p className="eyebrow">Package strategy</p><h2>How packages should work per event</h2></div></div>
          <div className="eventPackageRules">
            {[
              ["Event-specific", "Packages belong to one event and appear only on that event detail and registration flow."],
              ["Checkout-ready", "Each package needs price, capacity, visibility, receipt label, and optional add-on donation."],
              ["Admin-managed", "Teams can publish, pause, edit, duplicate, or archive packages without changing the public events hub."]
            ].map(([title, copy]) => (
              <span key={title}><strong>{title}</strong>{copy}</span>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
