import { FinanceActionForm } from "@/components/FinanceActionForm";
import { formatKes } from "@/lib/content";
import { getFinanceDashboard, getMonthlyProfitLoss } from "@/lib/finance-data";

export default async function FinancePage() {
  const [dashboard, profitLoss] = await Promise.all([
    getFinanceDashboard(),
    getMonthlyProfitLoss()
  ]);

  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Finance</p><h1>Reconciliation and receipts</h1></div>
        <div className="adminActions"><a href="/admin/donations">Gift records</a><a className="primaryAction" href="/donate">Test payment</a></div>
      </header>
      <section className="adminKpis">
        {[
          ["Received today", formatKes(dashboard.receivedToday), `${dashboard.todayCount} payments`, "/admin/finance?period=today"],
          ["Reconciled", formatKes(dashboard.reconciledTotal), `${dashboard.reconciledPercent}% complete`, "/admin/finance?status=RECONCILED"],
          ["Pending receipts", String(dashboard.pendingReceipts), "confirmed gifts missing receipt", "/admin/finance?status=PENDING"],
          ["Failed payments", String(dashboard.failedCount), "needs follow-up", "/admin/finance?status=FAILED"],
          ["Bank transfers", String(dashboard.bankTransferCount), "proof required", "/admin/finance?method=BANK_TRANSFER"],
          ["Net position", formatKes(profitLoss.netPosition), profitLoss.monthLabel, "#profit-loss"]
        ].map(([label, value, meta, href]) => <a className="adminKpiCard" href={href} key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></a>)}
      </section>
      <section className="adminDashboardGrid financeMonthlyGrid">
        <article className="appPanel span8" id="profit-loss">
          <div className="panelHeader">
            <div><p className="eyebrow">Monthly P&amp;L</p><h2>{profitLoss.monthLabel}</h2></div>
            <span className="status warning">Planning basis</span>
          </div>
          <div className="profitLossLayout">
            <div>
              <h3>Income</h3>
              {profitLoss.income.map((line) => (
                <span key={line.label}>
                  <strong>{line.label}</strong>
                  <small>{line.note}</small>
                  <b>{formatKes(line.amount)}</b>
                </span>
              ))}
              <em>Total income {formatKes(profitLoss.totalIncome)}</em>
            </div>
            <div>
              <h3>Expense allocations</h3>
              {profitLoss.expenses.map((line) => (
                <span key={line.label}>
                  <strong>{line.label}</strong>
                  <small>{line.note}</small>
                  <b>{formatKes(line.amount)}</b>
                </span>
              ))}
              <em>Total expenses {formatKes(profitLoss.totalExpenses)}</em>
            </div>
          </div>
        </article>
        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">Audit snapshot</p><h2>Presentation metrics</h2></div></div>
          <div className="reportBreakdown">
            <div><span><strong>Restricted funds</strong><small>Campaign and event-linked income</small></span><b>{formatKes(profitLoss.restrictedFunds)}</b></div>
            <div><span><strong>Unrestricted funds</strong><small>General giving available for operations</small></span><b>{formatKes(profitLoss.unrestrictedFunds)}</b></div>
            <div><span><strong>Net position</strong><small>Income less planning allocations</small></span><b>{formatKes(profitLoss.netPosition)}</b></div>
          </div>
          <p className="financeReportNote">{profitLoss.reconciliationStatus}</p>
        </article>
        <article className="appPanel span7">
          <div className="panelHeader"><div><p className="eyebrow">Accounting controls</p><h2>Add expense or obligation</h2></div><a href="/admin/help">Finance guide</a></div>
          <form className="financeActionForm financeExpenseForm">
            <label><span>Type</span><select name="type"><option>Expense</option><option>Pending obligation</option><option>Vendor payable</option><option>Campaign allocation</option></select></label>
            <label><span>Category</span><select name="category"><option>Treatment</option><option>Prevention</option><option>Events</option><option>Operations</option><option>Compliance</option></select></label>
            <label><span>Amount</span><input min="0" name="amount" placeholder="KES" type="number" /></label>
            <label><span>Campaign / event</span><input name="source" placeholder="Optional related campaign or event" /></label>
            <label className="wide"><span>Description</span><input name="description" placeholder="Vendor, invoice, note, or obligation details" /></label>
            <button className="primaryAction" type="button">Save accounting entry</button>
            <small className="formSuccess">Ready for database persistence in the next finance migration.</small>
          </form>
        </article>
        <article className="appPanel span5">
          <div className="panelHeader"><div><p className="eyebrow">Performance lens</p><h2>Income views</h2></div></div>
          <div className="quickActionGrid">
            {["Day", "Week", "Month", "Year"].map((period) => (
              <a href={`/admin/finance?period=${period.toLowerCase()}`} key={period}>
                <strong>{period}</strong>
                <span>Review donations, registrations, income, and obligations by {period.toLowerCase()}.</span>
              </a>
            ))}
          </div>
        </article>
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
