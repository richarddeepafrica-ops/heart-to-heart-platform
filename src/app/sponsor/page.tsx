const children = [
  {
    name: "Joy",
    age: "8 years",
    need: "Post-surgery review and medication support",
    goal: "KES 180,000"
  },
  {
    name: "Brian",
    age: "11 years",
    need: "Diagnostic tests and travel support",
    goal: "KES 95,000"
  },
  {
    name: "Amina",
    age: "6 years",
    need: "Surgery fund and family accommodation",
    goal: "KES 620,000"
  }
];

export default function SponsorPage() {
  return (
    <main>
      <section className="pageHero compact">
        <p className="eyebrow">Child sponsorship</p>
        <h1>Support a child&apos;s treatment journey.</h1>
        <p>
          Help children from families facing financial hardship access heart care.
        </p>
      </section>

      <section className="sponsorIntro">
        <div>
          <p className="eyebrow">Care with dignity</p>
          <h2>Support should protect the child and family.</h2>
          <p>
            Sponsorship focuses on practical care needs while keeping children&apos;s
            dignity and privacy at the centre.
          </p>
        </div>
        <div className="sponsorPromise">
          <span>Consent before publication</span>
          <span>Medical review before fundraising</span>
          <span>Updates after care milestones</span>
        </div>
      </section>

      <section className="cardGrid">
        {children.map((child) => (
          <article className="campaignCard" key={child.name}>
            <p className="eyebrow">{child.age}</p>
            <h2>{child.name}</h2>
            <p>{child.need}</p>
            <strong className="price">{child.goal}</strong>
            <a className="button primary" href={child.name === "Joy" ? "/sponsor/joy" : "/donate"}>
              Sponsor care
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
