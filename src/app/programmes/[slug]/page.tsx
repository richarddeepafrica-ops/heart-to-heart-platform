import { notFound } from "next/navigation";
import { getProgramme, programmes } from "@/lib/programmes";

type ProgrammePageContext = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return programmes.map((programme) => ({ slug: programme.slug }));
}

export default async function ProgrammeDetailPage({ params }: ProgrammePageContext) {
  const { slug } = await params;
  const programme = getProgramme(slug);

  if (!programme) notFound();

  const relatedProgrammes = programmes.filter((item) => item.slug !== programme.slug);

  return (
    <main>
      <section className="programmeDetailHero">
        <div>
          <p className="eyebrow">{programme.eyebrow}</p>
          <h1>{programme.title}</h1>
          <p>{programme.summary}</p>
          <div className="actions">
            <a className="button primary" href="/donate">Support this work</a>
            <a className="button secondary" href="/contact">Talk to the team</a>
          </div>
        </div>
        <img src={programme.imageUrl} alt="" />
      </section>

      <section className="programmeDetailBody">
        <article className="programmeNarrative">
          <p className="eyebrow">Programme overview</p>
          <h2>{programme.eyebrow}</h2>
          {programme.introduction.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>

        <aside className="programmeImpactCard">
          <span>Results</span>
          <strong>{programme.results.length}</strong>
          <small>documented programme outcomes and activities</small>
        </aside>
      </section>

      <section className="programmeResultsSection">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">Results</p>
          <h2>What this programme has delivered.</h2>
        </div>
        <div className="programmeResultGrid">
          {programme.results.map((result, index) => (
            <article key={result}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{result}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="programmeRelatedSection">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">Explore more</p>
          <h2>See the other foundation programmes.</h2>
        </div>
        <div className="programmeRelatedGrid">
          {relatedProgrammes.map((item) => (
            <a href={`/programmes/${item.slug}`} key={item.slug}>
              <img src={item.imageUrl} alt="" />
              <span>{item.title}</span>
              <p>{item.summary}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
