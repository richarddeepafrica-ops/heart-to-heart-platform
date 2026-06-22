import { notFound } from "next/navigation";
import { formatKes } from "@/lib/content";
import { formatConsentStatus, getBeneficiaryDashboard } from "@/lib/beneficiary-data";

type BeneficiaryDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BeneficiaryDetailPage({ params }: BeneficiaryDetailPageProps) {
  const { slug } = await params;
  const dashboard = await getBeneficiaryDashboard();
  const beneficiary = dashboard.records.find((record) => record.slug === slug);
  if (!beneficiary) notFound();

  const percent = beneficiary.fundingGoal ? Math.min(Math.round((beneficiary.raised / beneficiary.fundingGoal) * 100), 100) : 0;

  return (
    <>
      <header className="adminTopbar">
        <div>
          <p className="eyebrow">Beneficiary record</p>
          <h1>{beneficiary.publicName}</h1>
        </div>
        <div className="adminActions">
          <a href={`/sponsor/${beneficiary.slug}`}>Public profile</a>
          <a href={`/admin/donations?type=child&sort=amount-high`}>Donation ledger</a>
          <a className="primaryAction" href="/admin/beneficiaries">All beneficiaries</a>
        </div>
      </header>

      <section className="adminKpis">
        {[
          ["Raised", formatKes(beneficiary.raised), "child-linked gifts", "#beneficiary-gifts"],
          ["Goal", formatKes(beneficiary.fundingGoal), "care target", "#beneficiary-gifts"],
          ["Funded", `${percent}%`, "progress", "#beneficiary-gifts"],
          ["Status", formatConsentStatus(beneficiary.consentStatus), "consent and visibility", "#beneficiary-profile"]
        ].map(([label, value, meta, href]) => (
          <a className="adminKpiCard" href={href} key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></a>
        ))}
      </section>

      <section className="adminDashboardGrid">
        <article className="appPanel span7" id="beneficiary-profile">
          <div className="panelHeader"><div><p className="eyebrow">Profile</p><h2>Care and publishing status</h2></div><span className="status">{beneficiary.visibility}</span></div>
          <div className="adminDetailHero">
            <span><strong>{formatConsentStatus(beneficiary.consentStatus)}</strong> consent status</span>
            <span><strong>{formatKes(beneficiary.raised)}</strong> raised</span>
            <span><strong>{formatKes(beneficiary.fundingGoal - beneficiary.raised)}</strong> remaining</span>
          </div>
          <div className="adminProgressRail"><i><em style={{ width: `${percent}%` }} /></i></div>
        </article>

        <article className="appPanel span5" id="beneficiary-gifts">
          <div className="panelHeader"><div><p className="eyebrow">Donations</p><h2>Linked giving</h2></div></div>
          <div className="quickActionGrid">
            <a href={`/admin/donations?type=child&sort=amount-high`}><strong>View child gifts</strong><span>Open donation records sorted by highest gift.</span></a>
            <a href="/admin/finance"><strong>Finance review</strong><span>Confirm receipts and reconciliation for child-linked gifts.</span></a>
            <a href="/admin/reports"><strong>Report impact</strong><span>Include this beneficiary in board and impact reporting.</span></a>
          </div>
        </article>
      </section>
    </>
  );
}
