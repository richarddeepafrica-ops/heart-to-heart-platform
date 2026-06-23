import { ComplimentaryTicketActions } from "@/components/ComplimentaryTicketActions";
import { EventPackageSetupPanel } from "@/components/EventPackageSetupPanel";
import { EventRegistrationQueue, type EventRegistrationQueueItem } from "@/components/EventRegistrationQueue";
import { getComplimentaryTicketQueue } from "@/lib/complimentary-ticket-data";
import { formatKes } from "@/lib/content";
import { getEventDashboard } from "@/lib/event-data";

export default async function EventsAdminPage() {
  const [dashboard, complimentaryTickets] = await Promise.all([
    getEventDashboard(),
    getComplimentaryTicketQueue()
  ]);
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
          ["Event revenue", formatKes(dashboard.totalRevenue), "registrations and event gifts", "#event-calendar"],
          ["Registrations", String(dashboard.totalRegistrations), "all events", "#registration-queue"],
          ["Checked in", String(dashboard.checkedInCount), "attendance marked", "#registration-queue"],
          ["Pending payment", String(pendingPayments), "needs finance review", "/admin/finance"],
          ["Ready for arrival", String(readyForCheckIn), "confirmed but not checked in", "#registration-queue"],
          ["Events", String(dashboard.events.length), "active calendar", "#event-calendar"]
        ].map(([label, value, meta, href]) => <a className="adminKpiCard" href={href} key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></a>)}
      </section>
      <section className="adminDashboardGrid">
        <article className="appPanel span12">
          <div className="panelHeader"><div><p className="eyebrow">Event workflow</p><h2>Registration to check-in</h2></div></div>
          <div className="eventPackageRules">
            <span><strong>Package setup</strong>Confirm ticket names, benefits, pricing, colors, and shop visibility.<em>Setup</em></span>
            <span><strong>Registration review</strong>Track payment status and export attendee records before the event day.<em>{pendingPayments} pending</em></span>
            <span><strong>Check-in</strong>Use the latest registration queue to mark arrivals and clear mistakes quickly.<em>{checkInPercent}% checked in</em></span>
          </div>
        </article>
        <article className="appPanel span8" id="event-calendar">
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
                <span><strong><i className="ticketColorDot" style={{ background: ticket.color }} />{ticket.name}</strong><small>{ticket.description}</small><small>{ticket.sold} of {ticket.capacity.toLocaleString("en-KE")} capacity{ticket.showInShop ? " / shop" : ""}</small></span>
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
            <div><strong>Benefits and details</strong><span>Keep each package clear for sponsors, schools, and public buyers.</span><em>Review</em></div>
            <div><strong>Revenue tracking</strong><span>{formatKes(packageRevenue)} is currently tied to package registrations.</span><em>Live</em></div>
          </div>
        </article>
        <article className="appPanel span12" id="package-builder">
          <div className="panelHeader"><div><p className="eyebrow">Package builder</p><h2>Ticket package manager</h2></div><span className="status warning">Draft workspace</span></div>
          <EventPackageSetupPanel events={dashboard.events.map((event) => ({ id: event.id, title: event.title }))} packages={dashboard.packages.map((ticket) => ({
            ...ticket,
            eventSlug: dashboard.events.find((event) => event.id === ticket.eventId)?.slug || "heart-run",
            eventTitle: dashboard.events.find((event) => event.id === ticket.eventId)?.title || "Heart Run / Walk",
            slug: ticket.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
            audience: "Event registration",
            benefits: [],
            sortOrder: 0
          }))} />
        </article>
        <article className="appPanel span12" id="complimentary-tickets">
          <div className="panelHeader">
            <div><p className="eyebrow">Complimentary tickets</p><h2>Issued invitations and redemption</h2></div>
            <a className="panelLink" href="#package-builder">Issue from package manager</a>
          </div>
          {complimentaryTickets.length ? (
            <div className="simpleTable compTicketTable">
              {complimentaryTickets.map((ticket) => (
                <div key={ticket.id}>
                  <strong>{ticket.recipientName}<small>{ticket.recipientEmail || ticket.recipientPhone || "No contact"}</small></strong>
                  <span>{ticket.eventTitle}<small>{ticket.packageName} x {ticket.quantity}</small></span>
                  <span>{ticket.code}<small>{ticket.note || "No internal note"}</small></span>
                  <em className={ticket.redeemedAt ? "status success" : ticket.sentAt ? "status" : "status warning"}>
                    {ticket.redeemedAt ? "Redeemed" : ticket.sentAt ? "Sent" : "Not sent"}
                  </em>
                  <ComplimentaryTicketActions ticketId={ticket.id} sent={Boolean(ticket.sentAt)} redeemed={Boolean(ticket.redeemedAt)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="adminEmptyState">
              <strong>No complimentary tickets yet</strong>
              <span>Issue partner, guest, or sponsor tickets from the ticket package manager above.</span>
            </div>
          )}
        </article>
        <article className="appPanel span12" id="registration-queue">
          <div className="panelHeader"><div><p className="eyebrow">Registration review and check-in</p><h2>Latest event registrations</h2></div></div>
          <EventRegistrationQueue registrations={queueItems} />
        </article>
      </section>
    </>
  );
}
