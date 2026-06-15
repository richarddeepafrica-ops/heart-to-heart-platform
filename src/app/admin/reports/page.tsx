const reports = [
  ["Fundraising summary", "Donations, campaigns, events, and corporate support"],
  ["Impact report", "Surgeries, prevention, awareness, and children supported"],
  ["Finance export", "Receipts, reconciliation, methods, and bank review"],
  ["Board pack", "Monthly executive summary and priorities"]
];

export default function ReportsPage() {
  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Reports</p><h1>Impact and board reporting</h1></div>
        <div className="adminActions"><button type="button">Schedule</button><button className="primaryAction" type="button">Generate report</button></div>
      </header>
      <section className="adminDashboardGrid">
        {reports.map(([title, copy]) => <article className="appPanel span6" key={title}><div className="panelHeader"><div><p className="eyebrow">Report</p><h2>{title}</h2></div><button type="button">Open</button></div><p className="muted">{copy}</p></article>)}
      </section>
    </>
  );
}
