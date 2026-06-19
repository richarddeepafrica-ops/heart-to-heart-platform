import { EventCheckInForm } from "@/components/EventCheckInForm";
import { formatKes } from "@/lib/content";
import { getEventDashboard } from "@/lib/event-data";

export default async function EventsAdminPage() {
  const dashboard = await getEventDashboard();
  const featuredEvent = dashboard.featuredEvent;
  const checkInPercent = featuredEvent?.registrationCount
    ? Math.round((featuredEvent.checkedInCount / featuredEvent.registrationCount) * 100)
    : 0;

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
          ["Events", String(dashboard.events.length), "active calendar"]
        ].map(([label, value, meta]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>)}
      </section>
      <section className="adminDashboardGrid">
        <article className="appPanel span12">
          <div className="panelHeader"><div><p className="eyebrow">Event workflow</p><h2>Registration to check-in</h2></div></div>
          <div className="eventPackageRules">
            <span><strong>Package setup</strong>Confirm ticket names, benefits, pricing, and public checkout copy before launch.</span>
            <span><strong>Registration review</strong>Track payment status and export attendee records before the event day.</span>
            <span><strong>Check-in</strong>Use the latest registration queue to mark arrivals and clear mistakes quickly.</span>
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
            <div><p className="eyebrow">Event packages</p><h2>Heart Run registration packages</h2></div>
            <a href="/events/heart-run/register">Preview checkout</a>
          </div>
          <div className="eventPackageAdminTable">
            <div className="tableHead"><span>Package</span><span>Price</span><span>Sales</span><span>Status</span><span>Revenue</span></div>
            {dashboard.packages.map((ticket) => (
              <div className="tableLine" key={ticket.name}>
                <span><strong>{ticket.name}</strong><small>{ticket.description}</small></span>
                <span>{formatKes(ticket.price)}</span>
                <span>{ticket.sold} sold</span>
                <span className="status success">{ticket.status}</span>
                <span>{formatKes(ticket.revenue)}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">Package model</p><h2>Current setup</h2></div></div>
          <div className="reviewStack">
            <div><strong>Static package catalog</strong><span>Public package cards still come from content config.</span><em>Current</em></div>
            <div><strong>Live package sales</strong><span>Admin sales are computed from registration ticket types.</span><em>Working</em></div>
            <div><strong>Next schema step</strong><span>Add EventPackage records for publish, pause, capacity, and edits.</span><em>Next</em></div>
          </div>
        </article>
        <article className="appPanel span12">
          <div className="panelHeader"><div><p className="eyebrow">Registration queue</p><h2>Latest event registrations</h2></div></div>
          <div className="simpleTable eventRegistrationTable">
            {dashboard.registrations.length ? dashboard.registrations.map((registration) => (
              <div key={registration.id}>
                <strong>{registration.donorName}</strong>
                <span>{registration.eventTitle}</span>
                <span>{registration.ticketType} x {registration.quantity}</span>
                <span>{formatKes(registration.totalAmount)}</span>
                <em>{registration.checkedInAt ? "Checked in" : registration.paymentStatus}</em>
                <EventCheckInForm registrationId={registration.id} initialCheckedIn={Boolean(registration.checkedInAt)} />
              </div>
            )) : (
              <div>
                <strong>No registrations yet</strong>
                <span>Event checkout registrations will appear here.</span>
                <span>Package pending</span>
                <span>{formatKes(0)}</span>
                <em>Waiting</em>
                <span>Use test registration</span>
              </div>
            )}
          </div>
        </article>
      </section>
    </>
  );
}
