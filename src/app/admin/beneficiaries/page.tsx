import { BeneficiaryStatusForm } from "@/components/BeneficiaryStatusForm";
import { formatKes } from "@/lib/content";
import { formatConsentStatus, getBeneficiaryDashboard } from "@/lib/beneficiary-data";

export default async function BeneficiariesPage() {
  const dashboard = await getBeneficiaryDashboard();

  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Beneficiaries</p><h1>Child review and consent</h1></div>
        <div className="adminActions"><a href="/sponsor">Public sponsor page</a><a className="primaryAction" href="/admin/donations">View gifts</a></div>
      </header>
      <section className="adminKpis">
        {[
          ["Total raised", formatKes(dashboard.totalRaised), "beneficiary gifts", "#beneficiary-list"],
          ["Approved", String(dashboard.approvedCount), "public profiles", "#beneficiary-list"],
          ["In review", String(dashboard.reviewCount), "consent workflow", "#beneficiary-list"],
          ["Still funding", String(dashboard.pendingCount), "below goal", "#beneficiary-list"]
        ].map(([label, value, meta, href]) => <a className="adminKpiCard" href={href} key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></a>)}
      </section>
      <section className="adminDashboardGrid">
        <article className="appPanel span8" id="beneficiary-list">
          <div className="panelHeader"><div><p className="eyebrow">Review queue</p><h2>Profiles and updates</h2></div></div>
          <div className="simpleTable beneficiaryAdminTable">
            {dashboard.records.length ? dashboard.records.map((beneficiary) => (
              <div key={beneficiary.id}>
                <a className="adminInlineRecordLink" href={`/admin/beneficiaries/${beneficiary.slug}`}><strong>{beneficiary.publicName}</strong></a>
                <span>{formatConsentStatus(beneficiary.consentStatus)}</span>
                <span>{formatKes(beneficiary.raised)} of {formatKes(beneficiary.fundingGoal)}</span>
                <em>{beneficiary.visibility}</em>
                <BeneficiaryStatusForm slug={beneficiary.slug} initialStatus={beneficiary.consentStatus} />
              </div>
            )) : (
              <div>
                <strong>No beneficiaries yet</strong>
                <span>Create the first care profile.</span>
                <span>{formatKes(0)} raised</span>
                <em>Private review</em>
                <span>Waiting</span>
              </div>
            )}
          </div>
        </article>
        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">Approval checklist</p><h2>Before publication</h2></div></div>
          <div className="reviewStack">
            <div><strong>Guardian consent</strong><span>Required before public profile</span><em>Required</em></div>
            <div><strong>Medical summary</strong><span>Reviewed by care team</span><em>Required</em></div>
            <div><strong>Story review</strong><span>Dignity and privacy check</span><em>Required</em></div>
            <div><strong>Public status</strong><span>Set status to Approved to show as sponsor-ready</span><em>Actionable</em></div>
          </div>
        </article>
      </section>
    </>
  );
}
