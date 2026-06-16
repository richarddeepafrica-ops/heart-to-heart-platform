import { notFound } from "next/navigation";
import { findImpactStory, impactStories } from "@/lib/impact-stories";

type ImpactStoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return impactStories.map((story) => ({ slug: story.slug }));
}

export default async function ImpactStoryPage({ params }: ImpactStoryPageProps) {
  const { slug } = await params;
  const story = findImpactStory(slug);
  if (!story) notFound();

  return (
    <main>
      <section className="impactStoryHero">
        <div className="impactStoryImage">
          <img src={story.image} alt={story.name} />
        </div>
        <div>
          <p className="eyebrow">Beneficiary story</p>
          <h1>{story.name}</h1>
          <p>{story.story}</p>
          <div className="heroActions">
            {story.sponsorHref ? (
              <a className="button primary" href={story.sponsorHref}>Sponsor {story.name}</a>
            ) : (
              <a className="button primary" href="/donate">Fund more care</a>
            )}
            <a className="button secondary" href="/impact#beneficiary-stories">Back to impact stories</a>
          </div>
        </div>
      </section>

      <section className="section impactStoryBody">
        <article>
          <p className="eyebrow">Care journey</p>
          <h2>Why these stories matter.</h2>
          <p>
            Every recovery story reflects a network of family support, medical
            care, donors, schools, volunteers, and partners working together so
            a child can access treatment with dignity.
          </p>
        </article>
        <article>
          <p className="eyebrow">How to help</p>
          <h2>Keep the path open for the next child.</h2>
          <p>
            Your giving helps cover reviews, surgery support, medication,
            transport, follow-up, and the practical needs families face during
            the treatment journey.
          </p>
          <a className="button primary" href="/donate">Give toward care</a>
        </article>
      </section>
    </main>
  );
}
