export default function GalaDinnerPage() {
  return (
    <main>
      <section className="detailHero galaDinnerHero">
        <div>
          <p className="eyebrow">Gala Dinner</p>
          <h1>An evening of giving for children&apos;s heart care.</h1>
          <p>
            Gala Dinner brings major donors, corporate partners, medical leaders,
            and friends of the foundation together to fund treatment and sustain
            long-term impact.
          </p>
          <div className="actions">
            <a className="button primary" href="/corporate">Discuss sponsorship</a>
            <a className="button secondary" href="/donate">Make a gift</a>
          </div>
        </div>
        <aside className="detailDonateCard">
          <p className="eyebrow">Event focus</p>
          <strong>Major donors</strong>
          <span>Corporate tables, donor pledges, partner recognition, and impact storytelling.</span>
          <small>Packages managed from the admin events workspace.</small>
        </aside>
      </section>

      <section className="eventLandingTrust">
        {[
          ["Donor pledges", "Create a focused giving moment around children waiting for care."],
          ["Corporate tables", "Host partners, teams, and invited guests around the mission."],
          ["Impact reporting", "Connect gifts to campaign progress and post-event updates."]
        ].map(([title, copy]) => (
          <article key={title}>
            <strong>{title}</strong>
            <span>{copy}</span>
          </article>
        ))}
      </section>

      <section className="detailLayout heartRunJoin">
        <article className="detailStory heartRunStory">
          <p className="eyebrow">Why it matters</p>
          <h2>Gala Dinner gives high-value supporters a clear way to stand with families.</h2>
          <p>
            The evening can combine storytelling, clinical impact, partner
            recognition, and pledge moments so supporters understand exactly how
            their generosity helps children receive specialist heart care.
          </p>
          <div className="heartRunImpact">
            <span><strong>3</strong> giving moments</span>
            <span><strong>1</strong> campaign focus</span>
            <span><strong>100%</strong> mission-led</span>
          </div>
        </article>
        <aside className="givingMenu">
          <h3>Potential packages</h3>
          {[
            ["Corporate table", "Host guests and receive recognition during the evening."],
            ["Programme sponsor", "Support production, storytelling, and donor engagement."],
            ["Surgery pledge", "Make a named contribution toward treatment support."]
          ].map(([title, copy]) => (
            <a href="/corporate" key={title}>
              <strong>{title}</strong>
              <span>{copy}</span>
            </a>
          ))}
        </aside>
      </section>

      <section className="eventActionBand">
        <div>
          <p className="eyebrow">Gala participation</p>
          <h2>Invite partners into a meaningful evening of impact.</h2>
        </div>
        <div className="eventActionLinks">
          <a className="button primary" href="/corporate">Become a sponsor</a>
          <a className="button secondary" href="/campaigns/fund-20-heart-surgeries">Support campaign</a>
        </div>
      </section>
    </main>
  );
}
