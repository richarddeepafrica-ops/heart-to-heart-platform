const newsItems = [
  ["Foundation updates", "Stories from programmes, children supported, and families walking the treatment journey."],
  ["Event recaps", "Photos, highlights, and outcomes from Heart Run / Walk, gala dinners, campaigns, and partner activities."],
  ["Heart health notes", "Simple prevention and awareness articles for schools, families, and communities."]
];

export default function NewsPage() {
  return (
    <main>
      <section className="newsHero">
        <div>
          <p className="eyebrow">News & Blogs</p>
          <h1>Stories, updates, and heart health notes.</h1>
          <p>
            This section will carry foundation news, programme updates, event
            recaps, and educational articles that help more families understand
            heart disease prevention and care.
          </p>
          <div className="heroActions">
            <a className="button primary" href="/events">See events</a>
            <a className="button secondary" href="/impact">Read impact stories</a>
          </div>
        </div>
      </section>

      <section className="section newsIntroSection">
        <div className="sectionHeading">
          <p className="eyebrow">Coming next</p>
          <h2>A home for foundation updates.</h2>
          <p>
            As the system grows, the admin team can publish news, galleries,
            campaign recaps, and education posts here.
          </p>
        </div>
        <div className="newsCards">
          {newsItems.map(([title, copy]) => (
            <article key={title}>
              <span>{title}</span>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
