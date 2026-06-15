import { formatKes } from "@/lib/content";
import { getDonationDashboard } from "@/lib/donation-data";

export default async function DonationsPage() {
  const dashboard = await getDonationDashboard();

  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Donations</p><h1>Gift records</h1></div>
        <div className="adminActions"><button type="button">Export CSV</button><button className="primaryAction" type="button">Record offline gift</button></div>
      </header>
      <section className="adminKpis">
        {[ 
          ["Today", formatKes(dashboard.todayTotal), "latest gifts"],
          ["Confirmed", formatKes(dashboard.confirmedTotal), "paid or reconciled"],
          ["Pending", String(dashboard.pendingCount), "receipt queue"],
          ["Failed", String(dashboard.failedCount), "needs follow-up"]
        ].map(([label, value, meta]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>)}
      </section>
      <article className="appPanel">
        <div className="panelHeader"><div><p className="eyebrow">Records</p><h2>Latest donations</h2></div><button type="button">Filter</button></div>
        <div className="simpleTable six">
          {dashboard.records.map((record) => (
            <div key={record.id}><strong>{record.id}</strong><span>{record.donor}</span><span>{formatKes(record.amount)}</span><span>{record.method.replace("_", " ")}</span><span>{record.destination}</span><em>{record.status}</em></div>
          ))}
        </div>
      </article>
    </>
  );
}
