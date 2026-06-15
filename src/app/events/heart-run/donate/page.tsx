import { Suspense } from "react";
import { DonationForm } from "@/components/DonationForm";

export default function HeartRunDonatePage() {
  return (
    <main className="donateApp eventDonateApp">
      <section className="eventFlowHero donateEventHero">
        <div>
          <p className="eyebrow">Donate toward Heart Run / Walk</p>
          <h1>Support the event even if you cannot attend.</h1>
          <p>
            Your gift helps Heart Run raise funds for children&apos;s heart surgery
            and expand awareness around preventable heart conditions.
          </p>
          <div className="heroActions">
            <a className="button primary" href="#event-gift">Donate to Heart Run</a>
            <a className="button secondary" href="/events/heart-run/register">Register instead</a>
          </div>
        </div>
      </section>

      <section className="eventGivingIntro">
        <div>
          <p className="eyebrow">Why give to the event</p>
          <h2>Heart Run turns community energy into treatment support.</h2>
          <p>
            The annual Heart Run / Walk brings families, schools, corporate teams,
            and friends of the foundation together around one goal: helping more
            children access life-changing heart care. Event gifts are separate
            from registration fees and go directly toward the fundraising target.
          </p>
        </div>
        <div className="eventGivingStats">
          <span><strong>25K</strong> annual participants and supporters</span>
          <span><strong>600+</strong> heart surgeries supported over time</span>
          <span><strong>10K</strong> children reached through prevention education</span>
        </div>
      </section>

      <section className="givingRouteSection">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">Choose the right path</p>
          <h2>Donate, register, or support a campaign.</h2>
          <p>
            These actions serve different needs. Pick the one that matches how
            you want to participate.
          </p>
        </div>
        <div className="givingRouteGrid">
          <a className="givingRouteCard featured" href="#event-gift">
            <span>Event donation</span>
            <strong>Give toward Heart Run / Walk</strong>
            <p>Best for supporters who want their gift counted toward this specific event.</p>
          </a>
          <a className="givingRouteCard" href="/events/heart-run/register">
            <span>Event registration</span>
            <strong>Buy tickets or register a team</strong>
            <p>Best for individuals, families, schools, and corporate teams joining the run.</p>
          </a>
          <a className="givingRouteCard" href="/campaigns/fund-20-heart-surgeries">
            <span>Campaign donation</span>
            <strong>Support a named appeal</strong>
            <p>Best for giving directly to a surgery or prevention campaign outside event participation.</p>
          </a>
        </div>
      </section>

      <section className="eventGiftDepth">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">What your event gift supports</p>
          <h2>Every contribution helps move the mission forward.</h2>
        </div>
        <div className="eventGiftUseGrid">
          {[
            ["Awareness and mobilisation", "Materials, outreach, and education that help families understand preventable heart conditions."],
            ["Screening and follow-up", "Support around early identification, clinic follow-ups, medication, and care coordination."],
            ["Surgery fundraising", "Contributions toward the larger pool that helps children from underprivileged backgrounds receive treatment."],
            ["Family support", "Practical support that helps families stay connected to care before and after treatment."]
          ].map(([title, copy]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="checkoutWorkspace eventDonateWorkspace" id="event-gift">
        <div className="sectionHeading compactHeading givingFormHeading">
          <p className="eyebrow">Donate to Heart Run / Walk</p>
          <h2>Make a dedicated event gift.</h2>
          <p>
            This form is preselected for Heart Run / Walk giving. You can still
            change the destination if you decide to support another campaign.
          </p>
        </div>
        <Suspense fallback={<div className="notice">Loading payment details...</div>}>
          <DonationForm defaultCampaignSlug="heart-run-walk" source="heart-run-donation-page" />
        </Suspense>
      </section>
    </main>
  );
}
