import { notFound } from "next/navigation";
import { formatKes } from "@/lib/content";
import { getPartnerDashboard } from "@/lib/partner-data";

type PartnerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PartnerDetailPage({ params }: PartnerDetailPageProps) {
  const { id } = await params;
  const dashboard = await getPartnerDashboard();
  const partner = dashboard.records.find((record) => record.id === id);
  if (!partner) notFound();

  return (
    <>
      <header className="adminTopbar">
        <div>
          <p className="eyebrow">Partner record</p>
          <h1>{partner.organization}</h1>
        </div>
        <div className="adminActions">
          <a href="/admin/partners">Pipeline</a>
          <a href="/api/admin/partners/export">Export partners</a>
          <a className="primaryAction" href="/partners/inquiry">Add partner</a>
        </div>
      </header>

      <section className="adminKpis">
        {[
          ["Pipeline stage", partner.pipelineStage.replace("_", " "), "current segment", "#partner-details"],
          ["Estimated value", formatKes(partner.estimatedValue), "expected contribution", "#partner-actions"],
          ["Interest", partner.interest, "partnership area", "#partner-details"],
          ["Updated", partner.updatedAt.toLocaleDateString("en-KE"), "latest record activity", "#partner-actions"]
        ].map(([label, value, meta, href]) => (
          <a className="adminKpiCard" href={href} key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></a>
        ))}
      </section>

      <section className="adminDashboardGrid">
        <article className="appPanel span7" id="partner-details">
          <div className="panelHeader"><div><p className="eyebrow">Registration details</p><h2>Contact and partnership file</h2></div></div>
          <div className="reportBreakdown">
            <div><span><strong>Contact person</strong><small>{partner.contactName}</small></span><b>{partner.contactEmail}</b></div>
            <div><span><strong>Interest</strong><small>{partner.interest}</small></span><b>{partner.pipelineStage.replace("_", " ")}</b></div>
            <div><span><strong>Estimated value</strong><small>Pipeline estimate</small></span><b>{formatKes(partner.estimatedValue)}</b></div>
          </div>
        </article>

        <article className="appPanel span5" id="partner-actions">
          <div className="panelHeader"><div><p className="eyebrow">Actions</p><h2>Follow-up plan</h2></div></div>
          <div className="quickActionGrid">
            <a href={`mailto:${partner.contactEmail}`}><strong>Email contact</strong><span>Send proposal, confirmation, or renewal note.</span></a>
            <a href="/admin/help"><strong>Partnership workflow</strong><span>Open the admin guide for next steps.</span></a>
            <a href="/admin/reports"><strong>Report contribution</strong><span>Include this partner in board-ready reports.</span></a>
          </div>
        </article>
      </section>
    </>
  );
}
