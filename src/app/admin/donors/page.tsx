import { formatKes } from "@/lib/content";
import { getDonorDashboard } from "@/lib/donor-data";

export default async function DonorsPage() {
  const dashboard = await getDonorDashboard();
  const selectedDonor = dashboard.selectedDonor;

  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Donor CRM</p><h1>Donors and relationships</h1></div>
        <div className="adminActions"><a href="/admin/donations">View gifts</a><a className="primaryAction" href="/donate">Test checkout</a></div>
      </header>
      <section className="adminDashboardGrid">
        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">Segments</p><h2>Audience groups</h2></div></div>
          <div className="segmentList">
            {dashboard.segments.map((segment) => (
              <div className={segment.name === "All donors" ? "active" : ""} key={segment.name}>
                <span><strong>{segment.name}</strong><small>{segment.note}</small></span><b>{segment.count}</b>
              </div>
            ))}
          </div>
        </article>
        <article className="appPanel span8">
          <div className="panelHeader"><div><p className="eyebrow">Directory</p><h2>Recent donors</h2></div><a href="/admin/donations">Latest gifts</a></div>
          <div className="simpleTable">
            {dashboard.donors.length ? dashboard.donors.map((donor) => (
              <div key={donor.id}>
                <strong>{donor.name}</strong>
                <span>{formatKes(donor.totalGiving)}</span>
                <span>{donor.giftCount} {donor.giftCount === 1 ? "gift" : "gifts"}</span>
                <em>{donor.status}</em>
              </div>
            )) : (
              <div><strong>No donors yet</strong><span>New checkout donors will appear here.</span><span>0 gifts</span><em>Waiting</em></div>
            )}
          </div>
        </article>
        <article className="appPanel span12">
          <div className="panelHeader">
            <div><p className="eyebrow">Selected donor</p><h2>{selectedDonor?.name || "No donor selected"}</h2></div>
            {selectedDonor ? <span className="status success">{selectedDonor.status}</span> : <span className="status warning">Empty CRM</span>}
          </div>
          {selectedDonor ? (
            <>
              <div className="profileStats">
                <span><strong>{formatKes(selectedDonor.totalGiving)}</strong>Total giving</span>
                <span><strong>{selectedDonor.giftCount}</strong>Gifts</span>
                <span><strong>{selectedDonor.eventCount}</strong>Events</span>
                <span><strong>{selectedDonor.sponsorshipCount}</strong>Sponsorships</span>
              </div>
              <div className="timeline">
                {selectedDonor.timeline.length ? selectedDonor.timeline.map((item) => (
                  <div key={`${item.title}-${item.meta}`}><strong>{item.title}</strong><span>{item.meta}</span></div>
                )) : (
                  <div><strong>No activity yet</strong><span>This donor has a profile but no donations or registrations.</span></div>
                )}
              </div>
            </>
          ) : (
            <div className="timeline">
              <div><strong>Ready for first donor</strong><span>Donors are created automatically from successful checkout submissions.</span></div>
            </div>
          )}
        </article>
      </section>
    </>
  );
}
