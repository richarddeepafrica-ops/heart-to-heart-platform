const featuredEvents = [
  {
    title: "Teachers Workshop",
    type: "Prevention and awareness",
    image: "/assets/hero/CDB_6210-scaled.jpg",
    copy: "Equipping teachers with practical knowledge around rheumatic fever, early warning signs, and prevention messaging for schools.",
    href: "/campaigns/rheumatic-fever-awareness"
  },
  {
    title: "Gala Dinner",
    type: "Major donor evening",
    image: "/assets/hero/DSC_8428-scaled.jpg",
    copy: "A formal fundraising evening for partners, donors, and friends of the foundation to support children awaiting care.",
    href: "/events/gala-dinner"
  },
  {
    title: "Goat Derby",
    type: "Community fundraising",
    image: "/assets/hero/Heart-to-Heart-Foundation-5.jpg",
    copy: "A community event concept that brings supporters together around fun, visibility, sponsorship, and fundraising.",
    href: "/events/goat-derby"
  }
];

export default function EventsPage() {
  return (
    <main>
      <section className="eventsHero">
        <div>
          <p className="eyebrow">Events and community</p>
          <h1>Annual fundraising events for children&apos;s heart care.</h1>
          <p>
            Heart Run, Goat Derby, and Gala Dinner bring families, schools,
            companies, and supporters together to fund care and raise awareness.
          </p>
          <div className="heroActions">
            <a className="button primary" href="/events/heart-run">View Heart Run</a>
            <a className="button secondary" href="/partners">Become a sponsor</a>
          </div>
        </div>
        <aside className="eventsHeroStats">
          <span><strong>25K</strong> Heart Run / Walk participants annually</span>
          <span><strong>3</strong> signature fundraising moments</span>
          <span><strong>1</strong> mission for children&apos;s heart care</span>
        </aside>
      </section>

      <section className="eventFeature">
        <div className="eventFeatureImage" aria-label="Heart Run / Walk gathering" />
        <div>
          <p className="eyebrow">Signature event</p>
          <h2>Heart Run / Walk</h2>
          <p>
            The Heart Run raises funds for heart surgeries for children from
            underprivileged backgrounds and creates public awareness around
            preventable heart conditions.
          </p>
          <div className="eventFeatureActions">
            <a className="button primary" href="/events/heart-run">Explore event</a>
            <a className="button secondary" href="/events/heart-run/register">Register interest</a>
          </div>
        </div>
        <div className="eventChecklist">
          <span>Families and supporters</span>
          <span>Schools and corporate teams</span>
          <span>Public awareness</span>
          <span>Health through sport</span>
        </div>
      </section>

      <section className="section eventCardsSection">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">Featured events</p>
          <h2>Signature event first, with more ways for supporters to gather around the mission.</h2>
          <p>
            Events help the foundation raise funds, create public awareness,
            mobilise partners, and keep children&apos;s heart care visible.
          </p>
        </div>
        <div className="eventShowcaseGrid">
          <a className="eventShowcaseCard signatureEventCard" href="/events/heart-run">
            <div className="eventShowcaseImage heartRunEventImage" />
            <div>
              <span>Signature event</span>
              <h3>Heart Run / Walk</h3>
              <p>Families, schools, corporate teams, and supporters run or walk to raise funds for children&apos;s heart care.</p>
              <strong>Explore Heart Run</strong>
            </div>
          </a>
          {featuredEvents.map((event) => (
            <a className="eventShowcaseCard" href={event.href} key={event.title}>
              <div className="eventShowcaseImage" style={{ backgroundImage: `linear-gradient(0deg, rgba(15, 63, 115, 0.08), rgba(15, 63, 115, 0.08)), url(${event.image})` }} />
              <div>
                <span>{event.type}</span>
                <h3>{event.title}</h3>
                <p>{event.copy}</p>
                <strong>Learn more</strong>
              </div>
            </a>
          ))}
        </div>
      </section>

    </main>
  );
}
