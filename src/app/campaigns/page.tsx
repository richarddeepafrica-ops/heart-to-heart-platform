import { ProgressBar } from "@/components/ProgressBar";
import { campaigns, formatKes, fundedPercent } from "@/lib/content";

export default function CampaignsPage() {
  return (
    <main>
      <section className="pageHero compact">
        <p className="eyebrow">Campaign hub</p>
        <h1>Support children who need heart treatment.</h1>
        <p>
          Give toward surgery, prevention, awareness, and care for children
          affected by heart disease.
        </p>
      </section>

      <section className="campaignLead">
        <div>
          <p className="eyebrow">Open heart surgery</p>
          <h2>Over 300 children have already been assisted.</h2>
          <p>
            The foundation continues to raise funds for children from families
            who cannot afford treatment costs.
          </p>
        </div>
        <div className="campaignLeadStats">
          <span><strong>20</strong> surgeries targeted</span>
          <span><strong>KES 10M</strong> campaign goal</span>
          <span><strong>64%</strong> already funded</span>
        </div>
      </section>

      <section className="cardGrid campaignListingGrid">
        {campaigns.map((campaign) => {
          const percent = fundedPercent(campaign.raised, campaign.goal);
          return (
            <a className="campaignCard campaignListingCard" href={campaign.href} key={campaign.id}>
              <div className="campaignCardHeader">
                <p className="eyebrow">{campaign.type}</p>
                <span>Open story</span>
              </div>
              <h2>{campaign.title}</h2>
              <p>{campaign.summary}</p>
              <ProgressBar value={percent} />
              <div className="splitMeta">
                <strong>{formatKes(campaign.raised)} raised</strong>
                <span>{percent}% funded</span>
              </div>
              <div className="campaignJourney">
                <span>Read the story</span>
                <span>Opt in for updates</span>
                <span>Donate to this cause</span>
              </div>
              <strong className="campaignCardCta">View story and give</strong>
            </a>
          );
        })}
      </section>

      <section className="section donorPath">
        <div className="sectionHeading">
          <p className="eyebrow">Programme focus</p>
          <h2>Campaigns follow the foundation&apos;s core work.</h2>
        </div>
        <div className="featureGrid">
          {[
            ["Treatment", "Open heart surgery and financial assistance for needy patients."],
            ["Prevention", "Rheumatic fever and rheumatic heart disease awareness."],
            ["Fundraising", "Heart Run, Goat Derby, and Gala Dinner."],
            ["Research", "Programmes that strengthen heart disease prevention and care."]
          ].map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
