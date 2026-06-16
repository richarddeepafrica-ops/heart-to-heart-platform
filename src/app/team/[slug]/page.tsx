import { notFound } from "next/navigation";
import { getTeamProfile, teamProfiles } from "@/lib/team";

type TeamProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return teamProfiles.map((profile) => ({ slug: profile.slug }));
}

export async function generateMetadata({ params }: TeamProfilePageProps) {
  const { slug } = await params;
  const profile = getTeamProfile(slug);
  if (!profile) return {};

  return {
    title: `${profile.name} | Heart to Heart Foundation`,
    description: profile.headline
  };
}

export default async function TeamProfilePage({ params }: TeamProfilePageProps) {
  const { slug } = await params;
  const profile = getTeamProfile(slug);
  if (!profile) notFound();

  const relatedProfiles = teamProfiles.filter((person) => person.slug !== profile.slug).slice(0, 3);

  return (
    <main>
      <section className="teamProfileHero">
        <div className="teamProfilePortrait">
          <img src={profile.image} alt={profile.name} />
        </div>
        <div className="teamProfileIntro">
          <a className="backLink" href="/team">Back to team</a>
          <p className="eyebrow">{profile.role}</p>
          <h1>{profile.name}</h1>
          <p>{profile.headline}</p>
          <div className="teamProfileActions">
            <a className="button primary" href="/donate">Support the mission</a>
            <a className="button secondary" href="/team">View leadership</a>
          </div>
        </div>
      </section>

      <section className="teamProfileLayout">
        <aside className="teamProfileSummary">
          <span>Role</span>
          <strong>{profile.headline}</strong>
          <p>{profile.note}</p>
        </aside>
        <article className="teamProfileStory">
          {profile.story.map((paragraph) => {
            const isHeading =
              !paragraph.endsWith(".") &&
              paragraph.length < 80 &&
              !paragraph.includes(": ");

            return isHeading
              ? <h2 key={paragraph}>{paragraph}</h2>
              : <p key={paragraph}>{paragraph}</p>;
          })}
        </article>
      </section>

      <section className="section relatedTeamSection">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">Leadership</p>
          <h2>More people guiding the foundation.</h2>
        </div>
        <div className="relatedTeamGrid">
          {relatedProfiles.map((person) => (
            <a className="relatedTeamCard" href={`/team/${person.slug}`} key={person.slug}>
              <img src={person.image} alt={person.name} />
              <span>{person.role}</span>
              <strong>{person.name}</strong>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
