import { getAdminSystemStatus, getRecentAuditLogs } from "@/lib/admin-system";

function statusLabel(status: "healthy" | "warning" | "blocked") {
  if (status === "healthy") return "Ready";
  if (status === "warning") return "Needs setup";
  return "Blocked";
}

export default async function AdminSystemPage() {
  const [{ checks, metrics }, auditLogs] = await Promise.all([
    getAdminSystemStatus(),
    getRecentAuditLogs()
  ]);

  const blockedCount = checks.filter((check) => check.status === "blocked").length;
  const warningCount = checks.filter((check) => check.status === "warning").length;

  return (
    <>
      <header className="adminTopbar">
        <div>
          <p className="eyebrow">System operations</p>
          <h1>Admin health and activity</h1>
        </div>
        <div className="adminActions">
          <a href="/admin/content">Content studio</a>
          <a className="primaryAction" href="/admin/reports">Reports</a>
        </div>
      </header>

      <section className="adminKpis">
        {[
          ["Readiness", blockedCount ? "Blocked" : warningCount ? "Review" : "Ready", `${blockedCount} blockers, ${warningCount} warnings`],
          ["Admin users", String(metrics.users), "seeded accounts"],
          ["Applications", String(metrics.childApplications + metrics.partnerApplications), "children and partners"],
          ["Audit trail", String(metrics.auditLogs), "recorded actions"]
        ].map(([label, value, meta]) => (
          <article key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>
        ))}
      </section>

      <section className="adminDashboardGrid">
        <article className="appPanel span7">
          <div className="panelHeader">
            <div><p className="eyebrow">Readiness checks</p><h2>What is ready for demo</h2></div>
          </div>
          <div className="systemCheckGrid">
            {checks.map((check) => (
              <div className={`systemCheck ${check.status}`} key={check.label}>
                <span>{statusLabel(check.status)}</span>
                <strong>{check.label}</strong>
                <p>{check.detail}</p>
                {check.action && <small>{check.action}</small>}
              </div>
            ))}
          </div>
        </article>

        <article className="appPanel span5">
          <div className="panelHeader">
            <div><p className="eyebrow">Operations snapshot</p><h2>Backend coverage</h2></div>
          </div>
          <div className="systemMetricList">
            <div><span>Donations in database</span><strong>{metrics.donations}</strong></div>
            <div><span>Child applications</span><strong>{metrics.childApplications}</strong></div>
            <div><span>Partner applications</span><strong>{metrics.partnerApplications}</strong></div>
            <div><span>Audit events</span><strong>{metrics.auditLogs}</strong></div>
          </div>
        </article>

        <article className="appPanel span12">
          <div className="panelHeader">
            <div><p className="eyebrow">Audit trail</p><h2>Recent admin actions</h2></div>
          </div>
          {auditLogs.length ? (
            <div className="auditTimeline">
              {auditLogs.map((log) => (
                <div key={log.id}>
                  <span>{log.createdAt.toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}</span>
                  <strong>{log.action}</strong>
                  <p>{log.entityType}{log.entityId ? ` · ${log.entityId}` : ""}</p>
                  <small>{log.actorEmail}</small>
                </div>
              ))}
            </div>
          ) : (
            <div className="emptyState">
              <strong>No audit logs yet</strong>
              <p>When the database is connected, key admin actions will appear here for accountability.</p>
            </div>
          )}
        </article>
      </section>
    </>
  );
}
