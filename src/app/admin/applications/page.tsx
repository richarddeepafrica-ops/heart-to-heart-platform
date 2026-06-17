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
          ["New", String(dashboard.newCount), "awaiting triage"],
          ["In review", String(dashboard.reviewCount), "team follow-up"],
          ["Approved", String(dashboard.approvedCount), "converted records"],
          ["Declined", String(dashboard.declinedCount), "closed applications"]
        ].map(([label, value, meta]) => (
          <article key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>
        ))}
      </section>

      <section className="adminDashboardGrid">
        <article className="appPanel span12">
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
                </div>
                <ApplicationStatusForm id={application.id} kind="child-care" initialStatus={application.status} />
              </article>
            ))}
          </div>
        </article>

        <article className="appPanel span12">
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
