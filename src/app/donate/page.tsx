import { DonationForm } from "@/components/DonationForm";

export default function DonatePage() {
  return (
    <main className="donateApp">
      <section className="donateHero">
        <div>
          <p className="eyebrow">Give today</p>
          <h1>Help a child receive heart care.</h1>
          <p>
            Your gift supports surgery, prevention, treatment, and follow-up
            for children whose families cannot carry the cost alone.
          </p>
          <div className="donateHeroActions">
            <a className="button primary" href="#give">Make a gift</a>
            <a className="button secondary" href="/events/heart-run/donate">Support Heart Run</a>
          </div>
        </div>
        <aside className="donateHeroPanel">
          <div className="donateHeroImage" aria-label="Heart to Heart Foundation care moment" />
          <div className="donateTopStats">
            <span><strong>600+</strong> surgeries and growing</span>
            <span><strong>10K</strong> children taught about rheumatic fever</span>
            <span><strong>25K</strong> Heart Run / Walk participants annually</span>
          </div>
        </aside>
      </section>

      <section className="givingChoiceSection">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">Choose how to give</p>
          <h2>Support the foundation, a campaign, or an event.</h2>
        </div>
        <div className="givingChoiceGrid">
          {[
            ["General giving", "Support the area of greatest need across surgery, prevention, and follow-up.", "/donate"],
            ["Event giving", "Donate toward a specific fundraising event such as Heart Run / Walk.", "/events/heart-run/donate"],
            ["Event registration", "Buy tickets or register a family, school, or corporate team.", "/events/heart-run/register"]
          ].map(([title, copy, href]) => (
            <a href={href} key={title}>
              <strong>{title}</strong>
              <span>{copy}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="checkoutWorkspace" id="give">
        <div className="sectionHeading compactHeading givingFormHeading">
          <p className="eyebrow">Make your gift</p>
          <h2>Choose an amount and the cause you want to support.</h2>
        </div>
        <DonationForm />
      </section>

      <section className="offlineGivingSection" id="offline-giving">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">Offline donations</p>
          <h2>Give by M-Pesa, bank deposit, or cheque.</h2>
          <p>
            Supporters who prefer offline giving can use the foundation&apos;s
            official payment details below.
          </p>
        </div>
        <div className="offlineGivingGrid">
          <article className="offlineGivingCard primaryOfflineCard">
            <span>M-Pesa Paybill</span>
            <strong>517800</strong>
            <p>Account: your name</p>
          </article>
          <article className="offlineGivingCard">
            <span>Cheque / bank donation</span>
            <strong>Heart to Heart Foundation</strong>
            <p>Equity Bank, Community Corporate Branch</p>
            <p>Account number: <b>0180 2919 43847</b></p>
          </article>
          <article className="offlineGivingCard">
            <span>Mail or deliver cheque to</span>
            <strong>Heart to Heart Foundation</strong>
            <p>Langata Road, The Karen Hospital</p>
            <p>Nairobi, Kenya</p>
          </article>
        </div>
        <div className="paymentPartnerStrip" aria-label="Supported payment methods">
          {["M-Pesa", "Airtel Money", "Equity Bank", "Equitel", "Visa", "Mastercard"].map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
        <div className="offlineContactCard">
          <span><strong>Tel:</strong> +254 738 150 092</span>
          <span><strong>Email:</strong> hearttoheart@karenhospital.org</span>
        </div>
      </section>
    </main>
  );
}
