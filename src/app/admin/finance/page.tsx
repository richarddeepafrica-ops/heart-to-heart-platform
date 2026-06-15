import { FinanceActionForm } from "@/components/FinanceActionForm";
import { formatKes } from "@/lib/content";
import { getFinanceDashboard } from "@/lib/finance-data";

export default async function FinancePage() {
  const dashboard = await getFinanceDashboard();

  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Finance</p><h1>Reconciliation and receipts</h1></div>
        <div className="adminActions"><a href="/admin/donations">Gift records</a><a className="primaryAction" href="/donate">Test payment</a></div>
      </header>
      <section className="adminKpis">
        {[
          ["Received today", formatKes(dashboard.receivedToday), `${dashboard.todayCount} payments`],
          ["Reconciled", formatKes(dashboard.reconciledTotal), `${dashboard.reconciledPercent}% complete`],
          ["Pending receipts", String(dashboard.pendingReceipts), "confirmed gifts missing receipt"],
          ["Failed payments", String(dashboard.failedCount), "needs follow-up"],
          ["Bank transfers", String(dashboard.bankTransferCount), "proof required"]
        ].map(([label, value, meta]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>)}
      </section>
      <article className="appPanel">
        <div className="panelHeader"><div><p className="eyebrow">Queue</p><h2>Payment review</h2></div><a href="/admin/donations">Open donation ledger</a></div>
        <div className="financeTable financeReviewTable">
          {dashboard.queue.length ? dashboard.queue.map((record) => (
            <div key={record.id}>
              <span><strong>{record.donor}</strong><small>{record.source}</small></span>
              <span>{record.method.replace("_", " ")}</span>
              <strong>{formatKes(record.amount)}</strong>
              <span>{record.receiptNumber}</span>
              <em>{record.donationStatus} / {record.transactionStatus}</em>
              <FinanceActionForm donationId={record.id} initialStatus={record.donationStatus} initialProviderRef={record.providerRef} />
            </div>
          )) : (
            <div>
              <span><strong>No payments yet</strong><small>New checkout activity will appear here.</small></span>
              <span>None</span>
              <strong>{formatKes(0)}</strong>
              <span>Pending</span>
              <em>Waiting</em>
              <span>No action</span>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
