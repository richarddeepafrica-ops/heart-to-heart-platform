const donations = [
  ["H2H-1042", "Mary A.", "KES 10,000", "M-Pesa", "Fund 20 Heart Surgeries", "Pending receipt"],
  ["H2H-1041", "Corporate Team Alpha", "KES 250,000", "Bank transfer", "CSR Surgery Fund", "Review"],
  ["H2H-1040", "Anonymous", "KES 5,000", "Card", "Where most needed", "Confirmed"],
  ["H2H-1039", "Heart Run Family", "KES 5,000", "Card", "Event registration", "Confirmed"]
];

export default function DonationsPage() {
  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Donations</p><h1>Gift records</h1></div>
        <div className="adminActions"><button type="button">Export CSV</button><button className="primaryAction" type="button">Record offline gift</button></div>
      </header>
      <section className="adminKpis">
        {[
          ["Today", "KES 842K", "21 gifts"],
          ["Confirmed", "KES 721K", "86% reconciled"],
          ["Pending", "7", "receipt queue"],
          ["Failed", "3", "needs follow-up"]
        ].map(([label, value, meta]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>)}
      </section>
      <article className="appPanel">
        <div className="panelHeader"><div><p className="eyebrow">Records</p><h2>Latest donations</h2></div><button type="button">Filter</button></div>
        <div className="simpleTable six">
          {donations.map(([id, donor, amount, method, source, status]) => (
            <div key={id}><strong>{id}</strong><span>{donor}</span><span>{amount}</span><span>{method}</span><span>{source}</span><em>{status}</em></div>
          ))}
        </div>
      </article>
    </>
  );
}
