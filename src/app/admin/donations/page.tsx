import { formatKes } from "@/lib/content";
import { getDonationDashboard } from "@/lib/donation-data";
import { OfflineDonationForm } from "@/components/OfflineDonationForm";

export default async function DonationsPage() {
  const dashboard = await getDonationDashboard();
  const statuses = Array.from(new Set(dashboard.records.map((record) => record.status)));
  const methods = Array.from(new Set(dashboard.records.map((record) => record.method)));

  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Donations</p><h1>Gift records</h1></div>
        <div className="adminActions"><a href="/api/admin/donations/export">Export CSV</a><a className="primaryAction" href="#record-offline-gift">Record offline gift</a></div>
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
        <div className="panelHeader"><div><p className="eyebrow">Records</p><h2>Latest donations</h2></div><a className="panelLink" href="/admin/finance">Finance review</a></div>
        <div className="adminFilterBar" aria-label="Donation filters">
          <span>Filter-ready ledger</span>
          {statuses.map((status) => <a href={`/admin/donations?status=${status}`} key={status}>{status}</a>)}
          {methods.map((method) => <a href={`/admin/donations?method=${method}`} key={method}>{method.replace("_", " ")}</a>)}
        </div>
        <div className="simpleTable six">
          {dashboard.records.map((record) => (
            <div key={record.id}>
              <strong>{record.id}</strong>
              <span>{record.donor}</span>
              <span>{formatKes(record.amount)}</span>
              <span>{record.method.replace("_", " ")}</span>
              <span>{record.destination}</span>
              <em>{record.status}</em>
            </div>
          ))}
        </div>
      </article>
      <section className="adminDashboardGrid donationOpsGrid">
        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">Reconciliation</p><h2>Finance workflow</h2></div></div>
          <div className="adminActionList">
            <span><strong>1. Match payment</strong><small>Compare donor, amount, provider reference, and bank proof.</small></span>
            <span><strong>2. Confirm receipt</strong><small>Move the gift to confirmed once money is verified.</small></span>
            <span><strong>3. Reconcile</strong><small>Mark reconciled after statement or M-Pesa settlement review.</small></span>
          </div>
        </article>
        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">Notes</p><h2>Finance guidance</h2></div></div>
          <div className="reviewStack">
            <div><strong>Provider refs</strong><span>Use the finance page to store M-Pesa, bank, or receipt references.</span><em>Required</em></div>
            <div><strong>Flagged gifts</strong><span>Failed and refunded gifts stay visible in reports for audit clarity.</span><em>Audit</em></div>
          </div>
        </article>
        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">Exports</p><h2>Board-ready data</h2></div></div>
          <div className="quickActionGrid">
            <a href="/api/admin/donations/export"><strong>Donation CSV</strong><span>Finance ledger for reconciliation.</span></a>
            <a href="/api/reports/fundraising"><strong>Fundraising CSV</strong><span>Campaign and method breakdown.</span></a>
          </div>
        </article>
      </section>
      <article className="appPanel adminFormPanel" id="record-offline-gift">
        <div className="panelHeader">
          <div><p className="eyebrow">Offline gifts</p><h2>Record cash or bank transfer</h2></div>
        </div>
        <OfflineDonationForm />
      </article>
    </>
  );
}
