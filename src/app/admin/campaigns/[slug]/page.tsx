import { campaigns, formatKes, fundedPercent } from "@/lib/content";
import { CampaignEditForm } from "@/components/CampaignEditForm";

type CampaignAdminDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CampaignAdminDetailPage({ params }: CampaignAdminDetailPageProps) {
  const { slug } = await params;
  const campaign = campaigns.find((item) => item.id === slug) ?? campaigns[0];
  const percent = fundedPercent(campaign.raised, campaign.goal);
  const adminCampaign = {
    slug: campaign.id,
    title: campaign.title,
    summary: campaign.summary,
    goalAmount: campaign.goal,
    status: "ACTIVE"
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
          <a className="primaryAction" href="#campaign-editor">Edit campaign</a>
        </div>
      </header>

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

        <article className="appPanel span6">
          <div className="panelHeader"><div><p className="eyebrow">Actions</p><h2>Next best steps</h2></div></div>
          <div className="adminActionList">
            <span><strong>Publish update</strong><small>Share progress with donors.</small></span>
            <span><strong>Segment donors</strong><small>Retarget supporters who opened the last appeal.</small></span>
            <span><strong>Export gifts</strong><small>Prepare reconciliation for finance.</small></span>
          </div>
        </article>

        <article className="appPanel span6">
          <div className="panelHeader"><div><p className="eyebrow">Content</p><h2>Public page readiness</h2></div></div>
          <div className="adminChecklist">
            {["Campaign story", "Progress meter", "Use of funds", "FAQ", "Donation form"].map((item) => (
              <span key={item}><b>OK</b>{item}</span>
            ))}
          </div>
        </article>

        <article className="appPanel span6">
          <div className="panelHeader"><div><p className="eyebrow">Marketing</p><h2>Suggested journeys</h2></div></div>
          <div className="adminActionList">
            <span><strong>New donor thank-you</strong><small>Email + SMS receipt follow-up.</small></span>
            <span><strong>Monthly donor ask</strong><small>Invite repeat donors into recurring giving.</small></span>
            <span><strong>Corporate prospecting</strong><small>Package the appeal for CSR partners.</small></span>
          </div>
        </article>
      </section>
    </>
  );
}
