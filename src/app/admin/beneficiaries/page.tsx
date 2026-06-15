const beneficiaries = [
  ["Joy Wambui", "Approved", "KES 288,000 raised", "Public sponsorship"],
  ["Draft beneficiary", "Guardian pending", "KES 0 raised", "Private"],
  ["Post-care update", "Medical review", "Follow-up story", "Hold"]
];

export default function BeneficiariesPage() {
  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Beneficiaries</p><h1>Child review and consent</h1></div>
        <div className="adminActions"><button type="button">Review queue</button><button className="primaryAction" type="button">Add beneficiary</button></div>
      </header>
      <section className="adminDashboardGrid">
        <article className="appPanel span8">
          <div className="panelHeader"><div><p className="eyebrow">Review queue</p><h2>Profiles and updates</h2></div></div>
          <div className="simpleTable">
            {beneficiaries.map(([name, status, funding, visibility]) => <div key={name}><strong>{name}</strong><span>{status}</span><span>{funding}</span><em>{visibility}</em></div>)}
          </div>
        </article>
        <article className="appPanel span4">
          <div className="panelHeader"><div><p className="eyebrow">Approval checklist</p><h2>Before publication</h2></div></div>
          <div className="reviewStack">
            <div><strong>Guardian consent</strong><span>Required before public profile</span><em>Required</em></div>
            <div><strong>Medical summary</strong><span>Reviewed by care team</span><em>Required</em></div>
            <div><strong>Story review</strong><span>Dignity and privacy check</span><em>Required</em></div>
          </div>
        </article>
      </section>
    </>
  );
}
