const queue = [
  ["Mary A.", "M-Pesa", "Fund 20 Heart Surgeries", "KES 10,000", "Auto-match"],
  ["Corporate Team Alpha", "Bank transfer", "CSR Surgery Fund", "KES 250,000", "Needs proof"],
  ["Heart Run Family", "Card", "Event registration", "KES 5,000", "Ready"],
  ["Anonymous", "M-Pesa", "Where most needed", "KES 2,500", "Receipt pending"]
];

export default function FinancePage() {
  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Finance</p><h1>Reconciliation and receipts</h1></div>
        <div className="adminActions"><button type="button">Export</button><button className="primaryAction" type="button">Approve selected</button></div>
      </header>
      <section className="adminKpis">
        {[
          ["Received today", "KES 842K", "21 payments"],
          ["Reconciled", "KES 721K", "86% complete"],
          ["Pending receipts", "7", "needs review"],
          ["Bank transfers", "3", "proof required"]
        ].map(([label, value, meta]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{meta}</small></article>)}
      </section>
      <article className="appPanel">
        <div className="panelHeader"><div><p className="eyebrow">Queue</p><h2>Payment review</h2></div></div>
        <div className="financeTable">
          {queue.map(([donor, method, source, amount, status]) => <div key={`${donor}-${amount}`}><span><strong>{donor}</strong><small>{source}</small></span><span>{method}</span><strong>{amount}</strong><em>{status}</em></div>)}
        </div>
      </article>
    </>
  );
}
