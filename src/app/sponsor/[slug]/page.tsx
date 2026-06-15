import { notFound } from "next/navigation";
import { formatKes } from "@/lib/content";
import { findSponsorshipProfile, sponsorDonateHref } from "@/lib/sponsorships";

type SponsorDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SponsorDetailPage({ params }: SponsorDetailPageProps) {
  const { slug } = await params;
  const profile = findSponsorshipProfile(slug);
  if (!profile) notFound();

  return (
    <main>
      <section className="childDetailHero">
        <div
          className="childPortrait"
          style={profile.portraitImage ? { backgroundImage: `url(${profile.portraitImage})` } : undefined}
        />
        <div>
          <p className="eyebrow">Child sponsorship</p>
          <h1>Help {profile.displayName} reach care.</h1>
          <p>{profile.story}</p>
          <div className="actions">
            <a className="button primary" href={sponsorDonateHref(profile)}>Sponsor {profile.name}</a>
            <a className="button secondary" href="/impact">See impact</a>
          </div>
        </div>
      </section>

      <section className="detailLayout">
        <article className="detailStory">
          <p className="eyebrow">Care journey</p>
          <h2>Support the practical path to treatment.</h2>
          <p>
            Sponsorship helps families cover review, diagnosis, treatment,
            medication, transport, and follow-up needs with dignity.
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
            [2500, "Help with medication and follow-up support"],
            [5000, "Support transport, reviews, and family needs"],
            [25000, "Fund a major care milestone"],
            [profile.goalAmount, `Give toward the full ${formatKes(profile.goalAmount)} target`]
          ].map(([amount, copy]) => (
            <a href={sponsorDonateHref(profile, Number(amount))} key={String(amount)}>
              <strong>{formatKes(Number(amount))}</strong>
              <span>{copy}</span>
            </a>
          ))}
        </aside>
      </section>
    </main>
  );
}
