import { EventPackageSetupPanel } from "@/components/EventPackageSetupPanel";
import { EventRegistrationQueue, type EventRegistrationQueueItem } from "@/components/EventRegistrationQueue";
import { formatKes } from "@/lib/content";
import { getEventDashboard } from "@/lib/event-data";

export default async function EventsAdminPage() {
  const dashboard = await getEventDashboard();
  const featuredEvent = dashboard.featuredEvent;
  const checkInPercent = featuredEvent?.registrationCount
    ? Math.round((featuredEvent.checkedInCount / featuredEvent.registrationCount) * 100)
    : 0;
  const pendingPayments = dashboard.registrations.filter((registration) => registration.paymentStatus !== "CONFIRMED").length;
  const readyForCheckIn = dashboard.registrations.filter((registration) => registration.paymentStatus === "CONFIRMED" && !registration.checkedInAt).length;
  const packageRevenue = dashboard.packages.reduce((total, ticket) => total + ticket.revenue, 0);
  const queueItems: EventRegistrationQueueItem[] = dashboard.registrations.map((registration) => ({
    ...registration,
    checkedInAt: registration.checkedInAt ? registration.checkedInAt.toISOString() : null,
    createdAt: registration.createdAt.toISOString()
  }));

  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Events</p><h1>Event operations</h1></div>
        <div className="adminActions"><a href="/events">Public events</a><a className="primaryAction" href="/events/heart-run/register">Test registration</a></div>
      </header>
      <section className="adminKpis">
        {[
          ["Event revenue", formatKes(dashboard.totalRevenue), "registrations and event gifts"],
          ["Registrations", String(dashboard.totalRegistrations), "all events"],
          ["Checked in", String(dashboard.checkedInCount), "attendance marked"],
          ["Pending payment", String(pendingPayments), "needs finance review"],
          ["Ready for arrival", String(readyForCheckIn), "confirmed but not checked in"],
          ["Events", String(dashboard.events.length), "active calendar"]
        ].map(([label, value, meta]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>)}
      </section>
      <section className="adminDashboardGrid">
        <article className="appPanel span12">
          <div className="panelHeader"><div><p className="eyebrow">Event workflow</p><h2>Registration to check-in</h2></div></div>
          <div className="eventPackageRules">
            <span><strong>Package setup</strong>Confirm ticket names, benefits, pricing, and public checkout copy before launch.<em>Setup</em></span>
            <span><strong>Registration review</strong>Track payment status and export attendee records before the event day.<em>{pendingPayments} pending</em></span>
            <span><strong>Check-in</strong>Use the latest registration queue to mark arrivals and clear mistakes quickly.<em>{checkInPercent}% checked in</em></span>
          </div>
        </article>
        <article className="appPanel span8">
          <div className="panelHeader"><div><p className="eyebrow">Calendar</p><h2>Fundraising events</h2></div></div>
          <div className="simpleTable eventsAdminTable">
            {dashboard.events.map((event) => (
              <div key={event.id}>
                <strong>{event.title}</strong>
                <span>{event.dateLabel}</span>
                <span>{event.registrationCount} registrations</span>
                <span>{formatKes(event.revenue)}</span>
                <em>{event.status}</em>
              </div>
            ))}
          </div>
        </article>
        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">{featuredEvent?.title || "Events"}</p><h2>Operational snapshot</h2></div><span className="status">{featuredEvent?.status || "Waiting"}</span></div>
          <div className="eventOps">
            <strong>{featuredEvent?.registrationCount || 0} registrations</strong>
            <span>{featuredEvent?.checkedInCount || 0} checked in at {featuredEvent?.venue || "venue TBC"}</span>
            <div className="progress"><span style={{ width: `${checkInPercent}%` }} /></div>
            <small>{featuredEvent ? `${formatKes(featuredEvent.revenue)} collected for this event.` : "Events appear here after seeding or creation."}</small>
          </div>
        </article>
        <article className="appPanel span8">
          <div className="panelHeader">
            <div><p className="eyebrow">Package setup</p><h2>Heart Run registration packages</h2></div>
            <a href="/events/heart-run/register">Preview checkout</a>
          </div>
          <div className="eventPackageAdminTable">
            <div className="tableHead"><span>Package</span><span>Price</span><span>Sales</span><span>Status</span><span>Revenue</span></div>
            {dashboard.packages.map((ticket) => (
              <div className="tableLine" key={ticket.name}>
                <span><strong>{ticket.name}</strong><small>{ticket.description}</small><small>{ticket.sold} of {ticket.capacity.toLocaleString("en-KE")} capacity</small></span>
                <span>{formatKes(ticket.price)}</span>
                <span>{ticket.capacity ? Math.round((ticket.sold / ticket.capacity) * 100) : 0}% sold</span>
                <span className={ticket.status === "Sold out" ? "status warning" : "status success"}>{ticket.status}</span>
                <span>{formatKes(ticket.revenue)}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">Launch readiness</p><h2>Before publishing</h2></div></div>
          <div className="reviewStack">
            <div><strong>Package names and pricing</strong><span>Confirm names match public checkout and receipts.</span><em>Review</em></div>
            <div><strong>Benefits and copy</strong><span>Make sure sponsors and schools understand what each package includes.</span><em>Review</em></div>
            <div><strong>Revenue tracking</strong><span>{formatKes(packageRevenue)} is currently tied to package registrations.</span><em>Live</em></div>
          </div>
        </article>
        <article className="appPanel span12">
          <div className="panelHeader"><div><p className="eyebrow">Package builder</p><h2>Checkout copy review</h2></div><span className="status warning">Draft workspace</span></div>
          <EventPackageSetupPanel />
        </article>
        <article className="appPanel span12">
          <div className="panelHeader"><div><p className="eyebrow">Registration review and check-in</p><h2>Latest event registrations</h2></div></div>
          <EventRegistrationQueue registrations={queueItems} />
        </article>
      </section>
    </>
  );
}
