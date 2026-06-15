import { campaigns, formatKes, fundedPercent } from "@/lib/content";

const urgentTasks = [
  ["Finance", "7 receipts pending review", "High"],
  ["Beneficiaries", "4 child stories need approval", "High"],
  ["Events", "Heart Run packages need confirmation", "Medium"],
  ["Marketing", "Monthly donors update is ready", "Medium"]
];

export default function AdminPage() {
  return (
    <>
      <header className="adminTopbar">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Today&apos;s operating dashboard</h1>
        </div>
        <div className="adminActions">
          <a href="/admin/reports">View reports</a>
          <a className="primaryAction" href="/admin/campaigns">Create campaign</a>
        </div>
      </header>

      <section className="adminKpis" aria-label="Key metrics">
        {[
          ["Raised this month", "KES 2.8M", "+18% vs last month"],
          ["New donors", "246", "68 from Heart Run"],
          ["Recurring donors", "91", "KES 412K monthly"],
          ["Receipts pending", "7", "Finance review"],
          ["Children waiting", "13", "4 urgent reviews"],
          ["Campaign conversion", "8.4%", "+1.2% this week"]
        ].map(([label, value, meta]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{meta}</small>
          </article>
        ))}
      </section>

      <section className="adminDashboardGrid">
        <article className="appPanel span7">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Campaign performance</p>
              <h2>Active appeals</h2>
            </div>
            <a href="/admin/campaigns">Manage</a>
          </div>
          <div className="dataTable">
            <div className="tableHead">
              <span>Campaign</span>
              <span>Raised</span>
              <span>Goal</span>
              <span>Funded</span>
              <span>Status</span>
            </div>
            {campaigns.map((campaign) => {
              const percent = fundedPercent(campaign.raised, campaign.goal);
              return (
                <div className="tableLine" key={campaign.id}>
                  <span><strong>{campaign.title}</strong><small>{campaign.type}</small></span>
                  <span>{formatKes(campaign.raised)}</span>
                  <span>{formatKes(campaign.goal)}</span>
                  <span><b>{percent}%</b><i><em style={{ width: `${percent}%` }} /></i></span>
                  <span className="status success">Active</span>
                </div>
              );
            })}
          </div>
        </article>

        <article className="appPanel span5">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Priority queue</p>
              <h2>Needs attention</h2>
            </div>
          </div>
          <div className="reviewStack">
            {urgentTasks.map(([area, task, priority]) => (
              <div key={task}>
                <strong>{area}</strong>
                <span>{task}</span>
                <em>{priority}</em>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
