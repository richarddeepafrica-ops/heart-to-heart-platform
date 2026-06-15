const founders = [
  {
    name: "Dr. Dan K. Gikonyo",
    role: "Founder and Trustee",
    image: "/assets/team/dan-gikonyo.jpg",
    note: "Co-founder of the foundation and part of the clinical leadership that shaped its mission for children's heart care."
  },
  {
    name: "Dr. Betty M. Gikonyo",
    role: "Founder and Trustee",
    image: "/assets/team/betty-gikonyo.jpg",
    note: "Co-founder and trustee helping steward a long-running Kenyan effort for prevention, treatment, and access."
  }
];

const board = [
  {
    name: "Mr. Anthony M. Mathiga",
    role: "Chairman",
    image: "/assets/team/anthony-mathiga.png"
  },
  {
    name: "Mr. Karimi Randall",
    role: "Executive Director",
    image: "/assets/team/karimi-randall.jpg"
  },
  {
    name: "Ms. Carolyne Nandwa",
    role: "Project Manager",
    image: "/assets/team/carolyne-nandwa.png"
  }
];

const stewardship = [
  ["Founded", "1993"],
  ["Focus", "Children under 18"],
  ["Mission", "Prevention, control, and treatment"],
  ["Model", "Trustees, board, partners, and volunteers"]
];

export default function TeamPage() {
  return (
    <main>
      <section className="teamHero">
        <div>
          <p className="eyebrow">Leadership and stewardship</p>
          <h1>The people behind Heart to Heart Foundation.</h1>
          <p>
            A Kenyan medical charity is only as strong as the people trusted to
            carry its mission. Meet the founders and leadership team guiding the
            work of helping children access heart care.
          </p>
          <div className="heroActions centeredOnMobile">
            <a className="button primary" href="/donate">Support the mission</a>
            <a className="button secondary" href="/impact">See impact</a>
          </div>
        </div>
        <aside className="teamHeroPanel" aria-label="Foundation overview">
          {stewardship.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </aside>
      </section>

      <section className="section teamSection">
        <div className="sectionHeading">
          <p className="eyebrow">Founder Trustees</p>
          <h2>Clinical founders with a long view of children's heart care.</h2>
        </div>
        <div className="founderGrid">
          {founders.map((person) => (
            <article className="founderCard" key={person.name}>
              <img src={person.image} alt={person.name} />
              <div>
                <span>{person.role}</span>
                <h3>{person.name}</h3>
                <p>{person.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section boardSection">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">The Heart to Heart Board</p>
          <h2>Leadership that connects care, fundraising, partnerships, and delivery.</h2>
        </div>
        <div className="teamGrid">
          {board.map((person) => (
            <article className="teamCard" key={person.name}>
              <img src={person.image} alt={person.name} />
              <div>
                <span>{person.role}</span>
                <h3>{person.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section teamCta">
        <div>
          <p className="eyebrow">Work with the foundation</p>
          <h2>World-class governance should make it easier to give, partner, and volunteer.</h2>
        </div>
        <div className="teamCtaActions">
          <a className="button primary" href="/corporate">Partner with us</a>
          <a className="button secondary" href="/events">Join an event</a>
        </div>
      </section>
    </main>
  );
}
