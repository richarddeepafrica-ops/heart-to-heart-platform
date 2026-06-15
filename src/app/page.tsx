import { ProgressBar } from "@/components/ProgressBar";
import { HeroCarousel } from "@/components/HeroCarousel";
import { campaigns, formatKes, fundedPercent, heroImages, impactMetrics } from "@/lib/content";
import { sponsorshipProfiles } from "@/lib/sponsorships";

export default function Home() {
  const primaryCampaign = campaigns[0];
  const percent = fundedPercent(primaryCampaign.raised, primaryCampaign.goal);

  return (
    <main>
      <section className="hero">
        <HeroCarousel images={heroImages} />
        <div className="heroOverlay" />
        <div className="heroContent">
          <p className="eyebrow">Children&apos;s heart care in Kenya</p>
          <h1>Ensuring every child&apos;s heart in Kenya beats healthy</h1>
          <p>
            Heart to Heart Foundation is a Kenyan medical charity dedicated to the
            prevention, control, and treatment of heart disease in children.
          </p>
          <div className="actions">
            <a className="button primary" href="/donate">
              Donate Now
            </a>
            <a className="button secondary" href="/impact">
              Learn More
            </a>
          </div>
          <div className="heroStats" aria-label="Impact highlights">
            <span><strong>300+</strong> surgeries supported</span>
            <span><strong>1993</strong> founded</span>
            <span><strong>Kenya</strong> nationwide mission</span>
          </div>
        </div>
      </section>

      <section className="quickDonate">
        <div className="givingStory">
          <p className="eyebrow">Give today</p>
          <h2>Support surgery, prevention, and follow-up care.</h2>
          <p>
            Your gift helps children receive the care their families cannot afford alone.
          </p>
          <div className="givingImpactTiles">
            <span><strong>KES 1,000</strong> helps with clinic supplies or medication</span>
            <span><strong>KES 5,000</strong> supports transport and follow-up reviews</span>
            <span><strong>KES 10,000</strong> contributes to diagnostics and specialist care</span>
          </div>
        </div>
        <article className="miniCheckout">
          <div className="miniCheckoutHeader">
            <div>
              <span>Quick gift</span>
              <strong>Secure giving</strong>
            </div>
            <small>2 min</small>
          </div>
          <div className="amountGrid">
            {[1000, 5000, 10000, 50000].map((amount) => (
              <a className={amount === 5000 ? "amount recommended" : "amount"} href="/donate" key={amount}>
                {formatKes(amount)}
                {amount === 5000 ? <small>Most chosen</small> : null}
              </a>
            ))}
          </div>
          <div className="togglePreview">
            <span>One-time</span>
            <span>Monthly</span>
          </div>
          <a className="button primary wide" href="/donate">
            Continue to secure donation
          </a>
          <div className="givingTrust">
            <span><strong>Paybill</strong> 517800</span>
            <span><strong>Giving</strong> Once or monthly</span>
            <span><strong>Receipt</strong> Supported</span>
          </div>
        </article>
      </section>

      <section className="routeStrip" aria-label="Explore giving pathways">
        <a href="/campaigns">
          <span>01</span>
          <strong>Fund a Campaign</strong>
          <small>Open heart surgery and treatment support</small>
        </a>
        <a href="/events">
          <span>02</span>
          <strong>Join an Event</strong>
          <small>Heart Run, Goat Derby, and Gala Dinner</small>
        </a>
        <a href="/corporate">
          <span>03</span>
          <strong>Partner With Us</strong>
          <small>Corporates, schools, families, and volunteers</small>
        </a>
      </section>

      <section className="metricBand">
        {impactMetrics.map((metric) => (
          <article key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <section className="sectionGrid">
        <article className="featurePanel">
          <p className="eyebrow">Current campaign</p>
          <h2>{primaryCampaign.title}</h2>
          <p>{primaryCampaign.summary}</p>
          <ProgressBar value={percent} />
          <div className="splitMeta">
            <strong>{formatKes(primaryCampaign.raised)} raised</strong>
            <span>{percent}% funded</span>
          </div>
          <a className="button primary" href={primaryCampaign.href}>
            View campaign
          </a>
        </article>

        <article className="featurePanel blue">
          <p className="eyebrow">Core programmes</p>
          <h2>Four areas of work guide the foundation.</h2>
          <ul>
            <li>Management and treatment of heart disease</li>
            <li>Rheumatic fever and rheumatic heart disease prevention</li>
            <li>Annual fundraising programmes</li>
            <li>Research programme</li>
          </ul>
        </article>
      </section>

      <section className="storyFeature">
        <div className="storyImage" />
        <div className="storyCopy">
          <p className="eyebrow">Why it matters</p>
          <h2>A local solution for children who need heart care.</h2>
          <p>
            The foundation was born from the realization that specialist care was
            available, but many families could not carry treatment costs to the end.
          </p>
          <div className="storyStats">
            <span><strong>Prevent</strong> Rheumatic heart disease</span>
            <span><strong>Treat</strong> Open heart surgeries</span>
            <span><strong>Educate</strong> Schools and communities</span>
          </div>
        </div>
      </section>

      <section className="programmesShowcase">
        <div className="sectionHeading">
          <p className="eyebrow">Our work</p>
          <h2>Four programmes. One purpose.</h2>
          <p>
            Prevent heart disease where possible, treat children who need care,
            and keep families supported through the journey.
          </p>
        </div>
        <div className="programmeCards">
          {[
            ["Treatment", "Open heart surgery and management of heart disease.", "DSC_0101-scaled.jpg"],
            ["Prevention", "Rheumatic fever and rheumatic heart disease awareness.", "Heart-to-Heart-Foundation-9.jpg"],
            ["Fundraising", "Heart Run, Goat Derby, Gala Dinner, and community giving.", "Heart-to-Heart-Foundation-6.jpg"],
            ["Research", "Learning that strengthens prevention, care, and education.", "DSC_8428-scaled.jpg"]
          ].map(([title, copy, image]) => (
            <article className="programmeCard" key={title}>
              <div style={{ backgroundImage: `url(/assets/hero/${image})` }} />
              <span>{title}</span>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section splitStory">
        <div>
          <p className="eyebrow">Sponsor a child</p>
          <h2>Help a child and family reach treatment.</h2>
          <p>
            Sponsorship supports the practical journey around care: review,
            treatment, transport, medication, and recovery.
          </p>
          <a className="button secondary" href="/sponsor">View sponsorship</a>
        </div>
        <div className="childStack">
          {sponsorshipProfiles.map((profile) => (
            <a className="childCard" href={`/sponsor/${profile.slug}`} key={profile.slug}>
              <div className="avatar">{profile.initials}</div>
              <div>
                <h3>{profile.displayName}</h3>
                <p>{profile.need}</p>
                <small>{profile.raisedPercent}</small>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="sectionHeading">
          <p className="eyebrow">Events and community</p>
          <h2>Fundraising has always been part of the mission.</h2>
          <p>
            Annual events bring families, schools, companies, and supporters
            together for children&apos;s heart care.
          </p>
        </div>
        <div className="eventBoard">
          {[
            ["Every March", "Heart Run", "Raising funds for children from underprivileged backgrounds.", "/events/heart-run"],
            ["Every August", "Goat Derby", "A community fundraising tradition.", "/events/goat-derby"],
            ["Nov / Dec", "Gala Dinner", "A giving moment for partners and major supporters.", "/events/gala-dinner"]
          ].map(([date, title, copy, href]) => (
            <a href={href} key={title}>
              <p className="date">{date}</p>
              <h3>{title}</h3>
              <p>{copy}</p>
              <ul>
                <li>Families and supporters</li>
                <li>Schools and companies</li>
                <li>Awareness and fundraising</li>
              </ul>
            </a>
          ))}
        </div>
      </section>

      <section className="section backendBand">
        <div className="sectionHeading">
          <p className="eyebrow">Vision and mission</p>
          <h2>Prevent heart disease and remove poverty as a barrier to treatment.</h2>
        </div>
        <div className="featureGrid">
          {[
            ["Vision", "Eradicate preventable heart disease in children under 18."],
            ["Treatment", "Carry out heart surgery for needy heart disease patients."],
            ["Prevention", "Spearhead the campaign against rheumatic fever and rheumatic heart disease."],
            ["Education", "Share information with schools, parents, communities, and agencies."]
          ].map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="finalGivingBand">
        <div>
          <p className="eyebrow">Make a gift</p>
          <h2>Help the next child reach treatment.</h2>
          <p>
            Every gift moves the foundation closer to a Kenya where heart disease
            is prevented, treated early, and never ignored because of poverty.
          </p>
        </div>
        <div className="finalGivingActions">
          <a className="button primary" href="/donate">Donate now</a>
          <a className="button secondary" href="/corporate">Partner with us</a>
        </div>
      </section>
    </main>
  );
}
