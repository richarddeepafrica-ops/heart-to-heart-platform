const tiers = [
  ["Surgery Sponsor", "KES 1M+", "Help fund life-changing heart surgery and receive clear impact reporting.", "Support treatment"],
  ["Heart Run Partner", "KES 500K+", "Sponsor teams, event zones, schools, wellness activations, or public awareness moments.", "Sponsor an event"],
  ["Workplace Giving", "Custom", "Create payroll giving, employee matching, volunteering, or staff fundraising programmes.", "Start workplace giving"]
];

export default function CorporatePage() {
  return (
    <main>
      <section className="pageHero compact">
        <p className="eyebrow">Corporate giving</p>
        <h1>Partner in children&apos;s heart care.</h1>
        <p>
          Corporations and institutions have helped sustain the foundation&apos;s
          work through goodwill, fundraising, and community support.
        </p>
      </section>

      <section className="corporateIntro">
        <div>
          <p className="eyebrow">Ways to support</p>
          <h2>Stand with families who cannot meet the cost of treatment.</h2>
          <p>
            Partners can support surgeries, prevention programmes, events,
            public awareness, research, and volunteer work.
          </p>
        </div>
        <div className="corporateStats">
          <span><strong>Events</strong> Heart Run, Goat Derby, Gala Dinner</span>
          <span><strong>Care</strong> Surgery and treatment support</span>
          <span><strong>Awareness</strong> Schools, parents, and communities</span>
        </div>
      </section>

      <section className="corporatePathwaySection">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">Partnership options</p>
          <h2>Choose the way your organisation can make the greatest difference.</h2>
          <p>
            Every partnership can be shaped around your CSR priorities, audience,
            budget, and the kind of impact you want to create.
          </p>
        </div>
        <div className="corporatePathwayGrid">
        {tiers.map(([name, value, description, action]) => (
          <article className="corporatePathwayCard" key={name}>
            <span>{value}</span>
            <h2>{name}</h2>
            <p>{description}</p>
            <a className="button primary" href="/partners">
              {action}
            </a>
          </article>
        ))}
        </div>
      </section>

      <section className="section corporatePartnerCta">
        <div>
          <p className="eyebrow">Become a partner</p>
          <h2>Let us build a partnership that fits your organisation.</h2>
          <p>
            Talk to the foundation team about sponsorship, employee giving,
            event visibility, or funding support for children awaiting care.
          </p>
        </div>
        <a className="button primary" href="/partners">Discuss partnership</a>
      </section>
    </main>
  );
}
