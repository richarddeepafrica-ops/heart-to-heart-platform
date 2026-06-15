const workflows = [
  ["Donation thank-you", "Live", "Receipt, impact story, monthly giving invite"],
  ["Failed monthly payment", "Draft", "SMS reminder, retry link, call task"],
  ["Heart Run follow-up", "Scheduled", "Photos, impact recap, next campaign ask"]
];

export default function MarketingPage() {
  return (
    <>
      <header className="adminTopbar">
        <div><p className="eyebrow">Marketing</p><h1>Broadcasts and donor journeys</h1></div>
        <div className="adminActions"><button type="button">Preview audience</button><button className="primaryAction" type="button">Create broadcast</button></div>
      </header>
      <section className="adminDashboardGrid">
        <article className="appPanel span7">
          <div className="panelHeader"><div><p className="eyebrow">Journeys</p><h2>Automations</h2></div></div>
          <div className="workflowList">
            {workflows.map(([name, state, copy]) => <div key={name}><span className={state === "Live" ? "status success" : "status"}>{state}</span><strong>{name}</strong><p>{copy}</p></div>)}
          </div>
        </article>
        <article className="appPanel span5">
          <div className="panelHeader"><div><p className="eyebrow">Broadcast draft</p><h2>Fund 20 Heart Surgeries</h2></div></div>
          <div className="builderPreview"><label>Audience<select defaultValue="all"><option value="all">All donors</option></select></label><label>Channel<select defaultValue="multi"><option value="multi">Email, SMS, WhatsApp</option></select></label><button className="primaryAction" type="button">Prepare broadcast</button></div>
        </article>
      </section>
    </>
  );
}
