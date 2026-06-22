import { getAdminOperationsDashboard } from "@/lib/admin-ops";
import { formatKes, fundedPercent } from "@/lib/content";

export default async function AdminPage() {
  const dashboard = await getAdminOperationsDashboard();

  return (
    <>
      <header className="adminTopbar">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Today&apos;s command center</h1>
        </div>
        <div className="adminActions">
          <a href="/admin/system">Open system</a>
          <a href="/admin/reports">View reports</a>
          <a className="primaryAction" href="/admin/campaigns">Create campaign</a>
        </div>
      </header>

      <section className="adminKpis" aria-label="Key metrics">
        {dashboard.kpis.map(({ label, value, meta, href }) => (
          <a className="adminKpiCard" href={href} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{meta}</small>
          </a>
        ))}
      </section>

      <section className="adminDashboardGrid">
        <article className="appPanel span8 commandPanel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Today&apos;s tasks</p>
              <h2>What needs action first</h2>
            </div>
            <a href="/admin/system">System status</a>
          </div>
          <div className="taskBoard">
            {dashboard.tasks.map((task) => (
              <a className={`taskCard priority${task.priority}`} href={task.href} key={`${task.area}-${task.title}`}>
                <span>{task.area}</span>
                <strong>{task.title}</strong>
                <small>{task.detail}</small>
                <em>{task.priority}</em>
                <b>{task.action}</b>
              </a>
            ))}
          </div>
        </article>

        <article className="appPanel span4">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Quick actions</p>
              <h2>Start work</h2>
            </div>
          </div>
          <div className="quickActionGrid">
            {dashboard.quickActions.map((action) => (
              <a href={action.href} key={action.label}>
                <strong>{action.label}</strong>
                <span>{action.detail}</span>
              </a>
            ))}
          </div>
        </article>

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
            {dashboard.campaigns.map((campaign) => {
              const percent = fundedPercent(campaign.raised, campaign.goal);
              return (
                <div className="tableLine" key={campaign.id}>
                  <span><strong>{campaign.title}</strong><small>{campaign.type}</small></span>
                  <span>{formatKes(campaign.raised)}</span>
                  <span>{formatKes(campaign.goal)}</span>
                  <span><b>{percent}%</b><i><em style={{ width: `${percent}%` }} /></i></span>
                  <span className={campaign.status === "ACTIVE" ? "status success" : "status warning"}>{campaign.status}</span>
                </div>
              );
            })}
          </div>
        </article>

        <article className="appPanel span5">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Access model</p>
              <h2>Role-based operations</h2>
            </div>
          </div>
          <div className="roleMatrix">
            {dashboard.roleCapabilities.map((role) => (
              <div key={role.role}>
                <strong>{role.role}</strong>
                <span>{role.focus}</span>
                <small>{role.access.join(" / ")}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="appPanel span12">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Audit trail</p>
              <h2>Recent admin activity</h2>
            </div>
            <a href="/admin/system">Full log</a>
          </div>
          <div className="auditCompactList">
            {dashboard.auditLogs.length ? dashboard.auditLogs.map((log) => (
              <div key={log.id}>
                <strong>{log.action}</strong>
                <span>{log.entityType} {log.entityId}</span>
                <small>{log.actorEmail} - {new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short" }).format(log.createdAt)}</small>
              </div>
            )) : (
              <div>
                <strong>No audit events yet</strong>
                <span>Admin changes will appear here when the database is connected.</span>
                <small>Preview mode keeps the layout ready for the real audit trail.</small>
              </div>
            )}
          </div>
        </article>
      </section>
    </>
  );
}
