export default function JoySponsorPage() {
  return (
    <main>
      <section className="childDetailHero">
        <div className="childPortrait" />
        <div>
          <p className="eyebrow">Child sponsorship</p>
          <h1>Help Joy reach the care she needs.</h1>
          <p>
            Many children need financial assistance before treatment can move
            forward. Sponsorship helps close that gap with dignity.
          </p>
          <div className="actions">
            <a className="button primary" href="/donate">Sponsor Joy</a>
            <a className="button secondary" href="/impact">See impact</a>
          </div>
        </div>
      </section>

      <section className="detailLayout">
        <article className="detailStory">
          <p className="eyebrow">Care journey</p>
          <h2>Support the practical path to treatment.</h2>
          <p>
            A child may need review, diagnosis, treatment, medication, and follow-up.
            Sponsorship helps families stay on that path.
          </p>
          <div className="carePath">
            {[
              ["Review", "Clinical review and diagnosis"],
              ["Support", "Financial assistance toward care"],
              ["Treatment", "Hospital care and family logistics"],
              ["Follow-up", "Medication, reviews, and monitoring"]
            ].map(([title, copy]) => (
              <article key={title}>
                <strong>{title}</strong>
                <span>{copy}</span>
              </article>
            ))}
          </div>
        </article>
        <aside className="givingMenu">
          <h3>Sponsorship options</h3>
          {[
            ["KES 2,500 monthly", "Help with medication and follow-up support"],
            ["KES 5,000 monthly", "Support transport, reviews, and family needs"],
            ["KES 25,000 once", "Fund a major care milestone"],
            ["Custom gift", "Give what you can toward Joy&apos;s care"]
          ].map(([amount, copy]) => (
            <a href="/donate" key={amount}>
              <strong>{amount}</strong>
              <span>{copy}</span>
            </a>
          ))}
        </aside>
      </section>
    </main>
  );
}
