import { DonationForm } from "@/components/DonationForm";
import { ProgressBar } from "@/components/ProgressBar";
import { campaigns, formatKes, fundedPercent } from "@/lib/content";

const campaign = campaigns.find((item) => item.id === "rheumatic-fever-awareness") ?? campaigns[1];
const percent = fundedPercent(campaign.raised, campaign.goal);

export default function RheumaticFeverCampaignPage() {
  return (
    <main>
      <section className="detailHero preventionDetailHero">
        <div>
          <p className="eyebrow">Prevention and control</p>
          <h1>Prevent rheumatic fever before it damages young hearts.</h1>
          <p>
            Support awareness, teacher training, school outreach, screening, and
            follow-up for children at risk of rheumatic heart disease.
          </p>
          <div className="actions">
            <a className="button primary" href="#prevention-gift">Donate to prevention</a>
            <a className="button secondary" href="/impact">See impact</a>
          </div>
        </div>
        <aside className="detailDonateCard">
          <p className="eyebrow">Campaign progress</p>
          <strong>{formatKes(campaign.raised)}</strong>
          <span>raised of {formatKes(campaign.goal)}</span>
          <ProgressBar value={percent} />
          <small>{percent}% funded</small>
        </aside>
      </section>

      <section className="campaignTransparency">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">Prevention pathway</p>
          <h2>Early awareness can prevent lifelong heart complications.</h2>
          <p>
            This campaign supports public education and community-based
            prevention work, helping children, teachers, and families recognise
            symptoms early and seek care in time.
          </p>
        </div>
        <div className="allocationGrid">
          {[
            ["Teacher workshops", "Equip teachers to identify warning signs and reinforce prevention messages."],
            ["School awareness", "Reach learners with practical education around sore throat, fever, and follow-up care."],
            ["Screening support", "Help coordinate early checks and referrals for children who need clinical review."],
            ["Follow-up reminders", "Support continuity so families stay connected to preventive care."]
          ].map(([title, copy]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="checkoutWorkspace campaignDonateWorkspace" id="prevention-gift">
        <div className="sectionHeading compactHeading givingFormHeading">
          <p className="eyebrow">Donate to prevention</p>
          <h2>Support rheumatic fever awareness and follow-up.</h2>
        </div>
        <DonationForm defaultCampaignSlug="rheumatic-fever-awareness" source="prevention-campaign-page" />
      </section>
    </main>
  );
}
