export default function GoatDerbyPage() {
  return (
    <main>
      <section className="detailHero goatDerbyHero">
        <div>
          <p className="eyebrow">Goat Derby</p>
          <h1>A community fundraising day with heart.</h1>
          <p>
            Goat Derby creates a playful public gathering where families,
            companies, schools, and community supporters can raise funds and
            awareness for children&apos;s heart care.
          </p>
          <div className="actions">
            <a className="button primary" href="/partners">Sponsor the event</a>
            <a className="button secondary" href="/donate">Donate to the mission</a>
          </div>
        </div>
        <aside className="detailDonateCard">
          <p className="eyebrow">Event focus</p>
          <strong>Community</strong>
          <span>Family participation, sponsor visibility, public awareness, and fundraising activations.</span>
          <small>Package setup belongs to the event admin workspace.</small>
        </aside>
      </section>

      <section className="eventLandingTrust">
        {[
          ["Family day", "Create a welcoming environment for supporters of all ages."],
          ["Sponsor zones", "Give companies visible ways to support the mission."],
          ["Awareness moments", "Use the gathering to educate people about preventable heart conditions."]
        ].map(([title, copy]) => (
          <article key={title}>
            <strong>{title}</strong>
            <span>{copy}</span>
          </article>
        ))}
      </section>

      <section className="detailLayout heartRunJoin">
        <article className="detailStory heartRunStory">
          <p className="eyebrow">Why it works</p>
          <h2>Community events make fundraising feel visible, joyful, and shared.</h2>
          <p>
            Goat Derby can bring together sponsor activations, public
            entertainment, awareness booths, donor asks, and family participation
            in one accessible event experience.
          </p>
          <div className="carePath heartRunSteps">
            {[
              ["Sponsor", "Create branded zones, activity areas, or campaign moments"],
              ["Participate", "Bring families, teams, customers, and community groups"],
              ["Give", "Collect event gifts and campaign pledges"],
              ["Follow up", "Share receipts, photos, and impact reports after the event"]
            ].map(([title, copy], index) => (
              <article key={title}>
                <em>{String(index + 1).padStart(2, "0")}</em>
                <strong>{title}</strong>
                <span>{copy}</span>
              </article>
            ))}
          </div>
        </article>
        <aside className="givingMenu">
          <h3>Package ideas</h3>
          {[
            ["Family ticket", "Entry package for families and general supporters."],
            ["Activity sponsor", "Support a featured zone or community activation."],
            ["Corporate sponsor", "Visibility package for companies and staff teams."]
          ].map(([title, copy]) => (
            <a href="/partners" key={title}>
              <strong>{title}</strong>
              <span>{copy}</span>
            </a>
          ))}
        </aside>
      </section>

      <section className="eventActionBand">
        <div>
          <p className="eyebrow">Community support</p>
          <h2>Turn a public gathering into meaningful care for children.</h2>
        </div>
        <div className="eventActionLinks">
          <a className="button primary" href="/partners">Become a partner</a>
          <a className="button secondary" href="/donate">Give today</a>
        </div>
      </section>
    </main>
  );
}
