import { EmailQueueActions } from "@/components/EmailQueueActions";
import { getAdminEmailQueue } from "@/lib/admin-email-data";

function formatDate(value: Date | null) {
  if (!value) return "Not sent";
  return value.toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" });
}

export default async function AdminEmailsPage() {
  const emails = await getAdminEmailQueue();
  const queued = emails.filter((email) => email.status === "QUEUED").length;
  const sent = emails.filter((email) => email.status === "SENT").length;
  const failed = emails.filter((email) => email.status === "FAILED").length;

  return (
    <>
      <header className="adminTopbar">
        <div>
          <p className="eyebrow">Communications</p>
          <h1>Email queue</h1>
        </div>
        <div className="adminActions">
          <a href="/admin/system">System status</a>
          <a className="primaryAction" href="/admin/events">Event tickets</a>
        </div>
      </header>

      <section className="adminKpis">
        {[
          ["Queued", String(queued), "waiting to be sent", "#email-queue"],
          ["Sent", String(sent), "marked as delivered", "#email-queue"],
          ["Failed", String(failed), "needs resend or review", "#email-queue"],
          ["Total", String(emails.length), "latest queue records", "#email-queue"]
        ].map(([label, value, meta, href]) => (
          <a className="adminKpiCard" href={href} key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></a>
        ))}
      </section>

      <section className="adminDashboardGrid">
        <article className="appPanel span12" id="email-queue">
          <div className="panelHeader">
            <div><p className="eyebrow">Outbound queue</p><h2>Receipts, tickets, and confirmations</h2></div>
          </div>
          {emails.length ? (
            <div className="simpleTable emailQueueTable">
              {emails.map((email) => (
                <div key={email.id}>
                  <strong>{email.subject}<small>{email.context || "GENERAL"} / {email.entityId || "No linked record"}</small></strong>
                  <span>{email.toName || "Recipient"}<small>{email.toEmail || "No email on file"}</small></span>
                  <em className={email.status === "SENT" ? "status success" : email.status === "FAILED" ? "status warning" : "status"}>{email.status}</em>
                  <span>{formatDate(email.sentAt)}<small>Created {formatDate(email.createdAt)}</small></span>
                  <EmailQueueActions emailId={email.id} status={email.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="adminEmptyState">
              <strong>No emails in the queue</strong>
              <span>Ticket confirmations, complimentary tickets, and receipts will appear here once created.</span>
            </div>
          )}
        </article>
      </section>
    </>
  );
}
