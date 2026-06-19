import { formatKes } from "@/lib/content";
import { getPartnerDashboard } from "@/lib/partner-data";

export default async function PartnersPage() {
  const dashboard = await getPartnerDashboard();
  const newInquiries = dashboard.records.filter((record) => record.pipelineStage === "NEW_INQUIRY").slice(0, 3);
  const proposals = dashboard.records.filter((record) => record.pipelineStage === "PROPOSAL_SENT").slice(0, 3);
  const active = dashboard.records.filter((record) => record.pipelineStage === "ACTIVE").slice(0, 3);

  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Partners</p><h1>Corporate pipeline</h1></div>
        <div className="adminActions"><a href="/api/admin/partners/export">Export pipeline</a><a className="primaryAction" href="/partners/inquiry">Add partner</a></div>
      </header>
      <section className="adminKpis">
        {[
          ["Active partners", String(dashboard.activeCount), "2 reports due"],
          ["Open proposals", String(dashboard.openProposalCount), `${formatKes(dashboard.potentialValue)} potential`],
          ["Event sponsors", String(dashboard.eventSponsorCount), "Heart Run focus"],
          ["Renewals", String(dashboard.renewalCount), "next 30 days"]
        ].map(([label, value, meta]) => (
          <article key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>
        ))}
      </section>
      <section className="adminDashboardGrid">
        <article className="appPanel span8">
          <div className="panelHeader"><div><p className="eyebrow">Pipeline</p><h2>CSR and event partners</h2></div></div>
          <div className="pipelineBoard">
            <div><strong>New inquiries</strong>{newInquiries.length ? newInquiries.map((record) => <span key={record.id}>{record.organization} - {record.interest}</span>) : <span>No new inquiries</span>}</div>
            <div><strong>Proposal sent</strong>{proposals.length ? proposals.map((record) => <span key={record.id}>{record.organization} - {formatKes(record.estimatedValue)}</span>) : <span>No proposals pending</span>}</div>
            <div><strong>Active partners</strong>{active.length ? active.map((record) => <span key={record.id}>{record.organization} - {record.interest}</span>) : <span>No active partners yet</span>}</div>
          </div>
        </article>
        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">Next actions</p><h2>This week</h2></div></div>
          <div className="reviewStack">
            <div><strong>New inquiry triage</strong><span>Review open institution and corporate requests before proposal work.</span><em>Today</em></div>
            <div><strong>Prepare value note</strong><span>Attach estimated contribution, event category, and follow-up owner.</span><em>2 days</em></div>
            <div><strong>Approval path</strong><span>Approved institution applications can become public partners.</span><em>Next</em></div>
          </div>
        </article>
        <article className="appPanel span12">
          <div className="panelHeader"><div><p className="eyebrow">Partner workflow</p><h2>Inquiry to approved partner</h2></div></div>
          <div className="eventPackageRules">
            <span><strong>Apply online</strong>Partner institutions submit contacts, county, type, and proposal through the public form.</span>
            <span><strong>Review</strong>Admin moves the application through new, review, approved, or declined with internal notes.</span>
            <span><strong>Convert</strong>Approved institutions become partner records and can be listed publicly after confirmation.</span>
          </div>
        </article>
        <article className="appPanel span12">
          <div className="panelHeader"><div><p className="eyebrow">Partner records</p><h2>Recently updated</h2></div><a className="panelLink" href="/partners/inquiry">New inquiry</a></div>
          <div className="simpleTable">
            {dashboard.records.map((record) => (
              <div key={record.id}><strong>{record.organization}</strong><span>{record.interest}</span><span>{record.pipelineStage.replace("_", " ")}</span><em>{record.contactName}</em></div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
