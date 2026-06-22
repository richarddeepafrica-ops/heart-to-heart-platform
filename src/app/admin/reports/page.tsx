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
        <article className="appPanel span4 reportBuilderCard">
          <div className="reportBuilderHeader">
            <p className="eyebrow">Report builder</p>
            <h2>Generate board-ready reports</h2>
            <p>Select the report pack and period, then download a PDF for review or presentation.</p>
          </div>
          <form className="reportBuilderForm" action="/api/reports/fundraising/pdf" method="get">
            <label><span>Report type</span><select name="type" defaultValue="board"><option value="board">Board fundraising report</option><option value="pl">Monthly P&L</option><option value="campaigns">Campaign performance</option><option value="partners">Partner contribution</option><option value="children">Children helped / waiting list</option></select></label>
            <label><span>Period</span><select name="period" defaultValue="month"><option value="today">Today</option><option value="week">This week</option><option value="month">This month</option><option value="year">This year</option><option value="custom">Custom range</option></select></label>
            <button className="primaryAction reportPdfButton" type="submit"><strong>Generate PDF</strong><span>Downloads instantly</span></button>
            <a className="reportCsvLink" href="/api/reports/fundraising">Download CSV data</a>
            <small>Includes campaign performance, payment methods, destination mix, and board priorities.</small>
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
