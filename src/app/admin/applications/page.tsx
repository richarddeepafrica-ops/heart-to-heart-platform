import { ApplicationStatusForm } from "@/components/ApplicationStatusForm";
import { formatKes } from "@/lib/content";
import { formatApplicationStatus, getApplicationDashboard } from "@/lib/application-data";

export default async function AdminApplicationsPage() {
  const dashboard = await getApplicationDashboard();

  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Applications</p><h1>Online intake review</h1></div>
        <div className="adminActions"><a href="/apply">Parent form</a><a className="primaryAction" href="/partners/apply">Institution form</a></div>
      </header>

      <section className="adminKpis">
        {[
          ["New", String(dashboard.newCount), "awaiting triage", "#child-care"],
          ["In review", String(dashboard.reviewCount), "team follow-up", "#child-care"],
          ["Approved", String(dashboard.approvedCount), "converted records", "#institutions"],
          ["Declined", String(dashboard.declinedCount), "closed applications", "#institutions"]
        ].map(([label, value, meta, href]) => (
          <a className="adminKpiCard" href={href} key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></a>
        ))}
      </section>

      <section className="adminDashboardGrid">
        <article className="appPanel span12" id="child-care">
          <div className="panelHeader"><div><p className="eyebrow">Child care</p><h2>Parent and guardian applications</h2></div></div>
          <div className="applicationReviewList">
            {dashboard.childApplications.map((application) => (
              <article key={application.id}>
                <div>
                  <span>{formatApplicationStatus(application.status)}</span>
                  <h3>{application.childName}</h3>
                  <p>{application.diagnosis}</p>
                  <small>{application.guardianName} | {application.guardianPhone} | {application.county || "Location not provided"}</small>
                  <em>{application.estimatedNeed ? formatKes(application.estimatedNeed) : "Need not estimated"}</em>
                  <ul className="applicationChecklist">
                    <li>Guardian contact captured</li>
                    <li>Clinical diagnosis captured</li>
                    <li>{application.beneficiaryId ? "Beneficiary profile created" : "No beneficiary profile yet"}</li>
                  </ul>
                </div>
                <ApplicationStatusForm id={application.id} kind="child-care" initialStatus={application.status} />
              </article>
            ))}
          </div>
        </article>

        <article className="appPanel span12" id="institutions">
          <div className="panelHeader"><div><p className="eyebrow">Institutions</p><h2>Partner institution applications</h2></div></div>
          <div className="applicationReviewList">
            {dashboard.partnerApplications.map((application) => (
              <article key={application.id}>
                <div>
                  <span>{formatApplicationStatus(application.status)}</span>
                  <h3>{application.organization}</h3>
                  <p>{application.proposal}</p>
                  <small>{application.institutionType} | {application.contactName} | {application.contactEmail}</small>
                  <em>{application.county || "Location not provided"}</em>
                  <ul className="applicationChecklist">
                    <li>Contact person captured</li>
                    <li>Partnership proposal captured</li>
                    <li>{application.partnerId ? "Partner record created" : "No partner record yet"}</li>
                  </ul>
                </div>
                <ApplicationStatusForm id={application.id} kind="partner-institutions" initialStatus={application.status} />
              </article>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
