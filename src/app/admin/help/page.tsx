const knowledgeSections = [
  {
    title: "Donation reconciliation",
    eyebrow: "Finance help",
    items: [
      ["Match payment", "Compare donor name, amount, payment method, provider reference, and bank proof before confirming."],
      ["Confirm receipt", "Move the gift to confirmed once money is verified and receipt details are ready."],
      ["Reconcile", "Mark reconciled after M-Pesa settlement, bank statement, or finance review is complete."],
      ["Export", "Use CSV exports for working ledgers. Use Reports for board-ready summaries."]
    ]
  },
  {
    title: "Production finance readiness",
    eyebrow: "Accounting",
    items: [
      ["Expense ledger", "Capture real expense entries, categories, vendors, attachments, and approval status."],
      ["P&L reports", "Generate branded monthly income, expense, net position, and campaign allocation reports."],
      ["Public summaries", "Publish approved annual or quarterly transparency summaries, not raw internal ledgers."]
    ]
  },
  {
    title: "Campaign publishing",
    eyebrow: "Fundraising",
    items: [
      ["Preview", "Keep campaigns in draft while images, goals, and copy are being reviewed."],
      ["Publish", "Set active once the donation route, public story, finance destination, and receipt wording are ready."],
      ["Pause or archive", "Use paused or completed status when an appeal no longer needs prominent traffic."]
    ]
  },
  {
    title: "Marketing playbooks",
    eyebrow: "Communications",
    items: [
      ["Donor thank-you", "Send receipt, appreciation, and next-step impact copy after confirmed giving."],
      ["Monthly donor ask", "Invite repeat donors into recurring giving based on prior campaign interest."],
      ["Corporate prospecting", "Package appeals, event sponsorship, and CSR outcomes for partner follow-up."]
    ]
  },
  {
    title: "Event operations",
    eyebrow: "Events",
    items: [
      ["Package setup", "Confirm ticket names, benefits, pricing, capacity, and checkout copy before launch."],
      ["Registration review", "Track payment status and export attendee records before event day."],
      ["Check-in", "Use the latest registration queue to mark arrivals and correct mistakes quickly."]
    ]
  }
];

export default function AdminHelpPage() {
  return (
    <>
      <header className="adminTopbar">
        <div>
          <p className="eyebrow">Knowledge Base</p>
          <h1>Admin portal how-to</h1>
        </div>
        <div className="adminActions">
          <a href="/admin">Dashboard</a>
          <a className="primaryAction" href="/admin/system">System status</a>
        </div>
      </header>

      <section className="adminDashboardGrid">
        {knowledgeSections.map((section) => (
          <article className="appPanel span6 knowledgeCard" key={section.title}>
            <div className="panelHeader">
              <div>
                <p className="eyebrow">{section.eyebrow}</p>
                <h2>{section.title}</h2>
              </div>
            </div>
            <div className="adminActionList">
              {section.items.map(([title, copy]) => (
                <span key={title}><strong>{title}</strong><small>{copy}</small></span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
