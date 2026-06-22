import { notFound } from "next/navigation";
import { formatKes } from "@/lib/content";
import { CampaignEditForm } from "@/components/CampaignEditForm";
import { campaignPercent, getAdminCampaignBySlug } from "@/lib/campaign-data";

type CampaignAdminDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CampaignAdminDetailPage({ params }: CampaignAdminDetailPageProps) {
  const { slug } = await params;
  const campaign = await getAdminCampaignBySlug(slug);
  if (!campaign) notFound();

  const percent = campaignPercent(campaign);
  const adminCampaign = {
    slug: campaign.id,
    title: campaign.title,
    type: campaign.type,
    summary: campaign.summary,
    goalAmount: campaign.goal,
    status: campaign.status
  };

  return (
    <>
      <header className="adminTopbar">
        <div>
          <p className="eyebrow">Campaign detail</p>
          <h1>{campaign.title}</h1>
        </div>
        <div className="adminActions">
          <a href={campaign.href}>Preview public page</a>
          <a href={`/admin/donations?type=campaign&sort=amount-high`}>Donors</a>
          <a href="/api/admin/donations/export">Export gifts</a>
          <a className="primaryAction" href="#campaign-editor">Edit campaign</a>
        </div>
      </header>

      <section className="adminKpis">
        {[
          ["Raised", formatKes(campaign.raised), "campaign gifts", "#campaign-donations"],
          ["Goal", formatKes(campaign.goal), "target amount", "#campaign-editor"],
          ["Funded", `${percent}%`, "progress", "#campaign-donations"],
          ["Status", campaign.status, "publishing state", "#campaign-editor"]
        ].map(([label, value, meta, href]) => (
          <a className="adminKpiCard" href={href} key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></a>
        ))}
      </section>

      <section className="adminDashboardGrid">
        <article className="appPanel span8">
          <div className="panelHeader">
            <div><p className="eyebrow">Performance</p><h2>Fundraising health</h2></div>
            <span className="status success">Active</span>
          </div>
          <div className="adminDetailHero">
            <span><strong>{formatKes(campaign.raised)}</strong> raised</span>
            <span><strong>{formatKes(campaign.goal)}</strong> goal</span>
            <span><strong>{percent}%</strong> funded</span>
          </div>
          <div className="adminProgressRail"><i><em style={{ width: `${percent}%` }} /></i></div>
        </article>

        <article className="appPanel span4">
          <div className="panelHeader" id="campaign-editor"><div><p className="eyebrow">Editor</p><h2>Campaign settings</h2></div></div>
          <CampaignEditForm campaign={adminCampaign} />
        </article>

        <article className="appPanel span8" id="campaign-donations">
          <div className="panelHeader"><div><p className="eyebrow">Donation list</p><h2>Campaign-linked gifts</h2></div><a href="/admin/donations?type=campaign">Open ledger</a></div>
          <div className="simpleTable">
            {[
              ["Donation ledger", "Filter by campaign destination", formatKes(campaign.raised), "Open"],
              ["Major gifts", "Sort amount high to low", formatKes(campaign.raised), "Review"],
              ["Pending gifts", "Check finance status before reporting", "See finance", "Queue"]
            ].map(([name, detail, amount, status]) => (
              <a className="adminTableLink" href="/admin/donations?type=campaign&sort=amount-high" key={name}>
                <strong>{name}</strong><span>{detail}</span><span>{amount}</span><em>{status}</em>
              </a>
            ))}
          </div>
        </article>

        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">Controls</p><h2>Campaign actions</h2></div></div>
          <div className="quickActionGrid">
            <a href="#campaign-editor"><strong>Publish / pause</strong><span>Update campaign status and public visibility.</span></a>
            <a href="/admin/marketing"><strong>Update supporters</strong><span>Create donor segment and campaign update.</span></a>
            <a href="/api/admin/donations/export"><strong>Export gifts</strong><span>Download donation records for finance.</span></a>
          </div>
        </article>
      </section>
    </>
  );
}
