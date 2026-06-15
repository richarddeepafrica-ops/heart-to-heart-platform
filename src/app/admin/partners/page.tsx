export default function PartnersPage() {
  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Partners</p><h1>Corporate pipeline</h1></div>
        <div className="adminActions"><button type="button">Export pipeline</button><button className="primaryAction" type="button">Add partner</button></div>
      </header>
      <section className="adminKpis">
        {[
          ["Active partners", "18", "2 reports due"],
          ["Open proposals", "9", "KES 4.2M potential"],
          ["Event sponsors", "6", "Heart Run focus"],
          ["Renewals", "3", "next 30 days"]
        ].map(([label, value, meta]) => (
          <article key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>
        ))}
      </section>
      <section className="adminDashboardGrid">
        <article className="appPanel span8">
          <div className="panelHeader"><div><p className="eyebrow">Pipeline</p><h2>CSR and event partners</h2></div></div>
          <div className="pipelineBoard">
            <div><strong>New inquiries</strong><span>Company Ltd - surgery support</span><span>School Network - Heart Run teams</span></div>
            <div><strong>Proposal sent</strong><span>Corporate Team Alpha - KES 1M package</span><span>Wellness Partner - screening support</span></div>
            <div><strong>Active partners</strong><span>Kingdom Bank - event sponsor</span><span>Healthcare Partner - surgery support</span></div>
          </div>
        </article>
        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">Next actions</p><h2>This week</h2></div></div>
          <div className="reviewStack">
            <div><strong>Send proposal</strong><span>School Network Heart Run package</span><em>Today</em></div>
            <div><strong>Prepare report</strong><span>Kingdom Bank event visibility report</span><em>2 days</em></div>
            <div><strong>Follow up</strong><span>Corporate Team Alpha board approval</span><em>Friday</em></div>
          </div>
        </article>
        <article className="appPanel span12">
          <div className="panelHeader"><div><p className="eyebrow">Partner records</p><h2>Recently updated</h2></div><button type="button">Filter</button></div>
          <div className="simpleTable">
            {[
              ["Kingdom Bank", "Event sponsor", "Active", "Report due"],
              ["Healthcare Partner", "Surgery support", "Active", "Quarterly update"],
              ["Corporate Team Alpha", "CSR Surgery Fund", "Proposal", "Awaiting approval"],
              ["School Network", "Heart Run teams", "New", "Package requested"]
            ].map(([name, interest, status, next]) => (
              <div key={name}><strong>{name}</strong><span>{interest}</span><span>{status}</span><em>{next}</em></div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
