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
          ["Readiness", blockedCount ? "Blocked" : warningCount ? "Review" : "Ready", `${blockedCount} blockers, ${warningCount} warnings`, "#readiness-checks"],
          ["Admin users", String(metrics.users), "seeded accounts", "/admin/staff"],
          ["Applications", String(metrics.childApplications + metrics.partnerApplications), "children and partners", "/admin/applications"],
          ["Audit trail", String(metrics.auditLogs), "recorded actions", "#audit-trail"]
        ].map(([label, value, meta, href]) => (
          <a className="adminKpiCard" href={href} key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></a>
        ))}
      </section>

      <section className="adminDashboardGrid">
        <article className="appPanel span7" id="readiness-checks">
          <div className="panelHeader">
            <div><p className="eyebrow">Readiness checks</p><h2>What is ready for launch</h2></div>
          </div>
          <div className="systemCheckGrid">
            {checks.map((check) => (
              <a className={`systemCheck ${check.status}`} href={check.status === "blocked" ? "/admin/system" : "/admin/help"} key={check.label}>
                <span>{statusLabel(check.status)}</span>
                <strong>{check.label}</strong>
                <p>{check.detail}</p>
                {check.action && <small>{check.action}</small>}
              </a>
            ))}
          </div>
        </article>

        <article className="appPanel span5">
          <div className="panelHeader">
            <div><p className="eyebrow">Operations snapshot</p><h2>Backend coverage</h2></div>
          </div>
          <div className="systemMetricList">
            <a href="/admin/donations"><span>Donations in database</span><strong>{metrics.donations}</strong></a>
            <a href="/admin/applications"><span>Child applications</span><strong>{metrics.childApplications}</strong></a>
            <a href="/admin/applications"><span>Partner applications</span><strong>{metrics.partnerApplications}</strong></a>
            <a href="#audit-trail"><span>Audit events</span><strong>{metrics.auditLogs}</strong></a>
          </div>
        </article>

        <article className="appPanel span12" id="audit-trail">
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
