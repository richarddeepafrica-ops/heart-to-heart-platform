import { formatKes } from "@/lib/content";
import { CampaignBuilderForm } from "@/components/CampaignBuilderForm";
import { campaignPercent, getAdminCampaigns } from "@/lib/campaign-data";

export default async function CampaignsAdminPage() {
  const campaigns = await getAdminCampaigns();
  const activeCount = campaigns.filter((campaign) => campaign.status === "ACTIVE").length;
  const draftCount = campaigns.filter((campaign) => campaign.status === "DRAFT").length;
  const totalRaised = campaigns.reduce((total, campaign) => total + campaign.raised, 0);
  const totalGoal = campaigns.reduce((total, campaign) => total + campaign.goal, 0);

  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Campaigns</p><h1>Campaign manager</h1></div>
        <div className="adminActions"><a href="/campaigns">Preview public site</a><a className="primaryAction" href="#campaign-builder">Create campaign</a></div>
      </header>
      <section className="adminKpis">
        {[
          ["Total raised", formatKes(totalRaised), `${campaignPercent({ raised: totalRaised, goal: totalGoal })}% of all goals`, "#campaign-performance"],
          ["Active", String(activeCount), "public fundraising appeals", "/admin/campaigns?status=ACTIVE"],
          ["Drafts", String(draftCount), "preview before publishing", "/admin/campaigns?status=DRAFT"],
          ["Campaigns", String(campaigns.length), "managed appeals", "#campaign-performance"]
        ].map(([label, value, meta, href]) => <a className="adminKpiCard" href={href} key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></a>)}
      </section>
      <section className="adminDashboardGrid">
        <article className="appPanel span8" id="campaign-performance">
          <div className="panelHeader"><div><p className="eyebrow">Active appeals</p><h2>Fundraising progress</h2></div></div>
          <div className="dataTable">
            <div className="tableHead"><span>Campaign</span><span>Raised</span><span>Goal</span><span>Funded</span><span>Status</span></div>
            {campaigns.map((campaign) => {
              const percent = campaignPercent(campaign);
              return <a className="tableLine adminTableLink" href={`/admin/campaigns/${campaign.id}`} key={campaign.id}><span><strong>{campaign.title}</strong><small>{campaign.type}</small></span><span>{formatKes(campaign.raised)}</span><span>{formatKes(campaign.goal)}</span><span><b>{percent}%</b><i><em style={{ width: `${percent}%` }} /></i></span><span className={campaign.status === "ACTIVE" ? "status success" : "status warning"}>{campaign.status}</span></a>;
            })}
          </div>
        </article>
        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">Builder</p><h2>Draft appeal</h2></div></div>
          <CampaignBuilderForm />
        </article>
        <div className="adminInlineHelp span12"><a href="/admin/help">Open campaign publishing guide</a></div>
      </section>
    </>
  );
}
