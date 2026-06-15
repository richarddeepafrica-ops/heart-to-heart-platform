const segments = [
  ["All donors", "1,842", "+126 this month"],
  ["Monthly donors", "91", "12 failed payments"],
  ["Heart Run attendees", "684", "43 team leads"],
  ["Corporate contacts", "38", "9 active proposals"],
  ["Lapsed donors", "214", "reactivation ready"]
];

const donors = [
  ["Mary A.", "KES 85,000", "6 gifts", "High engagement"],
  ["Corporate Team Alpha", "KES 250,000", "1 gift", "Partner lead"],
  ["Anonymous donor", "KES 5,000", "1 gift", "Receipt sent"],
  ["Heart Run Family", "KES 5,000", "Event", "Registered"]
];

export default function DonorsPage() {
  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Donor CRM</p><h1>Donors and relationships</h1></div>
        <div className="adminActions"><button type="button">Import</button><button className="primaryAction" type="button">Add donor</button></div>
      </header>
      <section className="adminDashboardGrid">
        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">Segments</p><h2>Audience groups</h2></div></div>
          <div className="segmentList">
            {segments.map(([name, count, note]) => (
              <button className={name === "All donors" ? "active" : ""} key={name} type="button">
                <span><strong>{name}</strong><small>{note}</small></span><b>{count}</b>
              </button>
            ))}
          </div>
        </article>
        <article className="appPanel span8">
          <div className="panelHeader"><div><p className="eyebrow">Directory</p><h2>Recent donors</h2></div><button type="button">Filter</button></div>
          <div className="simpleTable">
            {donors.map(([name, giving, gifts, status]) => (
              <div key={name}><strong>{name}</strong><span>{giving}</span><span>{gifts}</span><em>{status}</em></div>
            ))}
          </div>
        </article>
        <article className="appPanel span12">
          <div className="panelHeader"><div><p className="eyebrow">Selected donor</p><h2>Mary A.</h2></div><span className="status success">High engagement</span></div>
          <div className="profileStats">
            <span><strong>KES 85K</strong>Total giving</span><span><strong>6</strong>Gifts</span><span><strong>2</strong>Events</span><span><strong>1</strong>Sponsorship</span>
          </div>
          <div className="timeline">
            <div><strong>KES 10,000 donation</strong><span>Fund 20 Heart Surgeries - today</span></div>
            <div><strong>Heart Run registration</strong><span>Family ticket - March 2026</span></div>
            <div><strong>Opened sponsorship update</strong><span>Joy Wambui - email engagement</span></div>
          </div>
        </article>
      </section>
    </>
  );
}
