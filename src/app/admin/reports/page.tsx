import { formatKes } from "@/lib/content";
import { getReportDashboard } from "@/lib/report-data";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export default async function ReportsPage() {
  const report = await getReportDashboard();

  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Reports</p><h1>Impact and board reporting</h1></div>
        <div className="adminActions"><a href="/api/reports/fundraising">Download CSV</a><a className="primaryAction" href="/admin/finance">Review finance</a></div>
      </header>
      <section className="adminKpis">
        {[
          ["Confirmed raised", formatKes(report.confirmedRaised), "confirmed or reconciled", "#fundraising-report"],
          ["Pending", formatKes(report.pendingAmount), "awaiting payment review", "/admin/donations?status=PENDING"],
          ["Failed", formatKes(report.failedAmount), "needs follow-up", "/admin/donations?status=FAILED"],
          ["Donors", String(report.donorCount), "CRM contacts", "/admin/donors"],
          ["Registrations", String(report.eventRegistrationCount), "event tickets", "/admin/events"]
        ].map(([label, value, meta, href]) => <a className="adminKpiCard" href={href} key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></a>)}
      </section>
      <section className="adminDashboardGrid">
        <article className="appPanel span8" id="fundraising-report">
          <div className="panelHeader"><div><p className="eyebrow">Fundraising summary</p><h2>Campaign performance</h2></div><span className="status">Generated {formatDate(report.generatedAt)}</span></div>
          <div className="simpleTable reportCampaignTable">
            {report.campaigns.map((campaign) => (
              <div key={campaign.name}>
                <strong>{campaign.name}</strong>
                <span>{formatKes(campaign.raised)}</span>
                <span>{formatKes(campaign.goal)}</span>
                <span><b>{campaign.percent}%</b><i><em style={{ width: `${campaign.percent}%` }} /></i></span>
                <em>{campaign.status}</em>
              </div>
            ))}
          </div>
        </article>
        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">Report builder</p><h2>Generate PDF pack</h2></div></div>
          <form className="financeActionForm reportBuilderForm">
            <label><span>Report type</span><select><option>Board fundraising report</option><option>Monthly P&L</option><option>Campaign performance</option><option>Partner contribution</option><option>Children helped / waiting list</option></select></label>
            <label><span>Period</span><select><option>Today</option><option>This week</option><option>This month</option><option>This year</option><option>Custom range</option></select></label>
            <button className="primaryAction" type="button">Prepare PDF</button>
            <a className="panelLink" href="/api/reports/fundraising">Download CSV data</a>
            <small className="formSuccess">PDF rendering is ready to connect to the report generator endpoint.</small>
          </form>
        </article>
        <article className="appPanel span6">
          <div className="panelHeader"><div><p className="eyebrow">Finance export</p><h2>Payment methods</h2></div></div>
          <div className="reportBreakdown">
            {report.methods.length ? report.methods.map((method) => (
              <div key={method.name}><span><strong>{method.name}</strong><small>{method.count} gifts</small></span><b>{formatKes(method.amount)}</b></div>
            )) : <div><span><strong>No received gifts</strong><small>Confirmed payments will appear here.</small></span><b>{formatKes(0)}</b></div>}
          </div>
        </article>
        <article className="appPanel span6">
          <div className="panelHeader"><div><p className="eyebrow">Impact report</p><h2>Destination mix</h2></div></div>
          <div className="reportBreakdown">
            {report.destinations.length ? report.destinations.map((destination) => (
              <div key={destination.name}><span><strong>{destination.name}</strong><small>{destination.count} gifts</small></span><b>{formatKes(destination.amount)}</b></div>
            )) : <div><span><strong>No destination activity</strong><small>Received gifts will appear here.</small></span><b>{formatKes(0)}</b></div>}
          </div>
        </article>
        <article className="appPanel span12">
          <div className="panelHeader"><div><p className="eyebrow">Report shortcuts</p><h2>Choose a working period</h2></div></div>
          <div className="quickActionGrid reportPeriodGrid">
            {["Day", "Week", "Month", "Year"].map((period) => (
              <a href={`/admin/reports?period=${period.toLowerCase()}`} key={period}>
                <strong>{period}</strong>
                <span>Generate and review fundraising, finance, impact, and event performance by {period.toLowerCase()}.</span>
              </a>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
