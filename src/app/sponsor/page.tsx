import { formatKes } from "@/lib/content";
import { sponsorDonateHref, sponsorshipProfiles } from "@/lib/sponsorships";

export default function SponsorPage() {
  return (
    <main>
      <section className="pageHero compact sponsorHero">
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

      <section className="section applicationCtaBand">
        <div>
          <p className="eyebrow">Need support?</p>
          <h2>Parents and guardians can apply online for review.</h2>
          <p>Applications are kept private until the team contacts the family and completes consent and medical review.</p>
        </div>
        <a className="button primary" href="/apply">Apply for child support</a>
      </section>

      <section className="cardGrid">
        {sponsorshipProfiles.map((child) => (
          <article className="campaignCard" key={child.slug}>
            <p className="eyebrow">{child.age}</p>
            <h2>{child.name}</h2>
            <p>{child.need}</p>
            <strong className="price">{formatKes(child.goalAmount)}</strong>
            <a className="button primary" href={`/sponsor/${child.slug}`}>
              View profile
            </a>
            <a className="button secondary" href={sponsorDonateHref(child)}>
              Sponsor care
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
