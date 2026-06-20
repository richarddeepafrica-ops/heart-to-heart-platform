import { Suspense } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { DonationForm } from "@/components/DonationForm";
import { campaigns, formatKes, fundedPercent } from "@/lib/content";

const campaign = campaigns[0];
const percent = fundedPercent(campaign.raised, campaign.goal);

export default function SurgeryCampaignPage() {
  return (
    <main>
      <section className="detailHero campaignDetailHero">
        <div>
          <p className="eyebrow">Urgent surgery appeal</p>
          <h1>Fund 20 Heart Surgeries</h1>
          <p>
            Support open heart surgeries for children whose families cannot
            meet the cost of treatment.
          </p>
          <div className="actions">
            <a className="button primary" href="/donate?type=campaign&campaignSlug=fund-20-heart-surgeries&amount=5000#give">Donate now</a>
            <a className="button secondary" href="/corporate">Become a partner</a>
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

      <section className="detailLayout">
        <article className="detailStory">
          <p className="eyebrow">The need</p>
          <h2>Heart treatment continues beyond diagnosis.</h2>
          <p>
            Heart to Heart Foundation was founded because local specialists
            could diagnose and treat heart disease, but many affected families
            could not afford care to the logical end.
          </p>
          <p>
            This appeal continues the foundation&apos;s curative programme:
            management and treatment of heart disease through open heart surgery
            for children.
          </p>
          <div className="campaignProofGrid">
            {[
              ["Clinical pathway", "Children move from diagnosis to treatment planning, surgery support, and follow-up care."],
              ["Financial support", "Donations reduce the treatment burden for families who cannot meet the full cost."],
              ["Ongoing updates", "Supporters receive milestones, receipts, and progress updates as care moves forward."]
            ].map(([title, copy]) => (
              <span key={title}><strong>{title}</strong>{copy}</span>
            ))}
          </div>
        </article>
        <aside className="givingMenu">
          <h3>What your gift can support</h3>
          {[
            [1000, "Medication, clinic supplies, or follow-up support"],
            [5000, "Transport and review support for a child and guardian"],
            [10000, "Diagnostic tests or specialist consultation"],
            [50000, "A meaningful contribution toward surgery costs"]
          ].map(([amount, copy]) => (
            <a href={`/donate?type=campaign&campaignSlug=fund-20-heart-surgeries&amount=${amount}#give`} key={String(amount)}>
              <strong>{formatKes(Number(amount))}</strong>
              <span>{copy}</span>
            </a>
          ))}
        </aside>
      </section>

      <section className="campaignTransparency">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">Where support goes</p>
          <h2>Clear giving categories help supporters understand the impact.</h2>
        </div>
        <div className="allocationGrid">
          {[
            ["Surgery funding", "The largest portion of the appeal supports treatment costs for children awaiting surgery."],
            ["Diagnostics and reviews", "Specialist consultations, tests, and clinical review moments before treatment."],
            ["Family support", "Transport, follow-up, and practical care needs that keep families connected to treatment."],
            ["Donor reporting", "Receipts, updates, and campaign reporting so supporters understand the impact."]
          ].map(([title, copy]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section updateSection">
        <div className="sectionHeading">
          <p className="eyebrow">Campaign updates</p>
          <h2>Follow the progress from appeal to care.</h2>
        </div>
        <div className="timelineGrid">
          {[
            ["Appeal launched", "Campaign opened for children awaiting surgery support."],
            ["64% funded", "Supporters have helped raise KES 6.4M toward the target."],
            ["Next milestone", "Reach KES 8M toward the next treatment commitments."]
          ].map(([title, copy]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="campaignFaqSection">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">Donor questions</p>
          <h2>Make the campaign transparent before someone gives.</h2>
        </div>
        <div className="faqGrid">
          {[
            ["Can I give to this campaign specifically?", "Yes. You can direct your gift to Fund 20 Heart Surgeries."],
            ["Will I receive a receipt?", "The giving flow captures contact details so the foundation can prepare confirmation and follow-up."],
            ["Can a company support this appeal?", "Yes. Corporate partners can sponsor surgery support, events, or broader programme work."],
            ["Can I give monthly?", "Yes. Monthly giving is available in the form for supporters who want ongoing impact."]
          ].map(([question, answer]) => (
            <article key={question}>
              <strong>{question}</strong>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="checkoutWorkspace campaignDonateWorkspace" id="campaign-gift">
        <div className="sectionHeading compactHeading givingFormHeading">
          <p className="eyebrow">Donate to this campaign</p>
          <h2>Help fund children waiting for heart surgery.</h2>
          <p>
            Your gift will support Fund 20 Heart Surgeries. You can also choose
            another giving destination.
          </p>
        </div>
        <Suspense fallback={<div className="notice">Loading payment details...</div>}>
          <DonationForm defaultCampaignSlug="fund-20-heart-surgeries" source="surgery-campaign-page" />
        </Suspense>
      </section>
    </main>
  );
}
