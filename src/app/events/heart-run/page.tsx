import { eventProducts, formatKes } from "@/lib/content";

export default function HeartRunPage() {
  return (
    <main>
      <section className="detailHero eventDetailHero">
        <div>
          <p className="eyebrow">Heart Run / Walk</p>
          <h1>Run for children&apos;s heart surgeries.</h1>
          <p>
            The Karen Hospital Heart Run raises funds for heart surgeries for
            children from underprivileged backgrounds.
          </p>
          <div className="actions">
            <a className="button primary" href="/events/heart-run/register">Register for event</a>
            <a className="button secondary" href="/corporate">Sponsor the event</a>
          </div>
        </div>
        <aside className="detailDonateCard">
          <p className="eyebrow">Event focus</p>
          <strong>March 2027</strong>
          <span>Individuals, families, schools, and corporate teams</span>
          <small>Registration packages below</small>
        </aside>
      </section>

      <section className="eventLandingTrust">
        {[
          ["Event giving", "Dedicated donations toward Heart Run / Walk fundraising."],
          ["Registration", "Packages for individuals, families, schools, and corporate teams."],
          ["Corporate support", "Sponsorship visibility and team participation opportunities."]
        ].map(([title, copy]) => (
          <article key={title}>
            <strong>{title}</strong>
            <span>{copy}</span>
          </article>
        ))}
      </section>

      <section className="detailLayout heartRunJoin">
        <article className="detailStory heartRunStory">
          <p className="eyebrow">Why join</p>
          <h2>Heart Run brings families together through sport.</h2>
          <p>
            It also raises public awareness around preventable heart
            conditions, bringing families together for health and fundraising.
          </p>
          <div className="heartRunImpact">
            <span><strong>25K</strong> annual participants</span>
            <span><strong>4</strong> ways to take part</span>
            <span><strong>1</strong> shared cause</span>
          </div>
          <div className="carePath heartRunSteps">
            {[
              ["Register", "Choose an individual, family, school, or corporate package"],
              ["Participate", "Run or walk with family, colleagues, or classmates"],
              ["Raise funds", "Support children awaiting heart surgery"],
              ["Create awareness", "Help more people understand preventable heart conditions"]
            ].map(([title, copy], index) => (
              <article key={title}>
                <em>{String(index + 1).padStart(2, "0")}</em>
                <strong>{title}</strong>
                <span>{copy}</span>
              </article>
            ))}
          </div>
        </article>
        <aside className="givingMenu heartRunPackages">
          <div className="packageHeader">
            <p className="eyebrow">Registration</p>
            <h3>Choose your package</h3>
            <span>Every registration helps fund care and raise public awareness.</span>
          </div>
          {eventProducts.map((ticket) => (
            <a href={`/donate?type=event-registration&eventSlug=heart-run&eventName=Heart+Run+%2F+Walk&packageName=${encodeURIComponent(ticket.name)}&amount=${ticket.price}#give`} key={ticket.name} className={ticket.name === "Family" ? "featuredPackage" : ""}>
              <strong>{ticket.name}</strong>
              <em>{formatKes(ticket.price)}</em>
              <span>{ticket.description}</span>
            </a>
          ))}
          <div className="packageFooter">
            <small>Schools and corporates can coordinate team registration with the foundation.</small>
            <a className="button primary wide" href="/events/heart-run/register">Register interest</a>
            <a className="button secondary wide" href="/donate?type=event-donation&eventSlug=heart-run&eventName=Heart+Run+%2F+Walk&campaignSlug=heart-run-walk#give">Donate to Heart Run</a>
          </div>
        </aside>
      </section>

      <section className="eventExperienceSection">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">Event experience</p>
          <h2>A public fundraising day with clear ways to take part.</h2>
          <p>
            Whether you are attending, sponsoring, donating, or mobilising a
            school or company team, Heart Run gives you a clear way to help.
          </p>
        </div>
        <div className="eventExperienceGrid">
          {[
            ["Before the run", "Registration packages, team coordination, sponsor onboarding, and public awareness content."],
            ["During the event", "Participant check-in, campaign visibility, partner recognition, and live fundraising moments."],
            ["After the event", "Receipts, impact updates, galleries, donor follow-up, and campaign conversion journeys."]
          ].map(([title, copy]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="eventActionBand">
        <div>
          <p className="eyebrow">Take part</p>
          <h2>Choose how you want to support Heart Run / Walk.</h2>
        </div>
        <div className="eventActionLinks">
          <a className="button primary" href="/events/heart-run/register">Register</a>
          <a className="button secondary" href="/donate?type=event-donation&eventSlug=heart-run&eventName=Heart+Run+%2F+Walk&campaignSlug=heart-run-walk#give">Donate to event</a>
          <a className="button secondary" href="/corporate">Sponsor</a>
        </div>
      </section>
    </main>
  );
}
