const partnerLogos = [
  ["Kingdom Bank", "/assets/partners/kingdom-bank.png"],
  ["KCB Bank", "/assets/partners/kcb-bank.png"],
  ["Co-operative Bank", "/assets/partners/coop-bank.jpg"],
  ["Krishna", "/assets/partners/krishna.jpeg"],
  ["Architectural Association of Kenya", "/assets/partners/aak.png"],
  ["Antarc", "/assets/partners/antarc.png"],
  ["Biometric Technologies", "/assets/partners/biometric-techs.png"],
  ["Chem Labs", "/assets/partners/chem-labs.png"],
  ["Chiromo Lane Medical Centre", "/assets/partners/chiromo-lane-medical.png"],
  ["Solution Sacco", "/assets/partners/solution-sacco.png"],
  ["Jubilee", "/assets/partners/jubilee.webp"],
  ["Frank's Air", "/assets/partners/franks-air.webp"],
  ["HFC", "/assets/partners/hfc.png"],
  ["I&M", "/assets/partners/i-m-logo.png"],
  ["Sam Tech", "/assets/partners/sam-tech.png"],
  ["Konrad Terumo", "/assets/partners/konrad-terumo.png"],
  ["Medinova", "/assets/partners/medinova.png"],
  ["Melvins", "/assets/partners/melvins.webp"],
  ["Premier Credit", "/assets/partners/premier-credit.png"],
  ["Minet", "/assets/partners/minet.png"],
  ["Nairobi Enterprises", "/assets/partners/nairobi-enterprises.png"],
  ["Overseas Healthcare", "/assets/partners/overseas-healthcare.jpg"],
  ["Philips", "/assets/partners/philips.png"]
];

const tiers = [
  {
    name: "Bronze",
    price: "KShs 300,000",
    className: "tierBronze",
    benefits: ["Promotion during events", "Mention as a sponsor", "3-minute talk or presentation"]
  },
  {
    name: "Silver",
    price: "KShs 500,000",
    className: "tierSilver",
    benefits: ["Promotion during events", "Sponsor mention", "4-minute talk or presentation", "One exhibition stand"]
  },
  {
    name: "Gold",
    price: "KShs 700,000",
    className: "tierGold",
    benefits: ["Promotion during events", "Sponsor mention", "4-minute talk or presentation", "One exhibition stand", "Two corporate banners"]
  },
  {
    name: "Platinum",
    price: "KShs 1,000,000",
    className: "tierPlatinum",
    benefits: ["Premium event promotion", "Sponsor mention", "4-minute talk or presentation", "One exhibition stand", "Three corporate banners"]
  }
];

const pathways = [
  ["Sponsor treatment", "Support surgeries, recovery, and follow-up care for children living with heart disease."],
  ["Support events", "Stand with the Heart Run / Walk and other fundraising moments that bring families, schools, and companies together."],
  ["Advance prevention", "Help take rheumatic fever awareness and heart health education into schools and communities."],
  ["Mobilise teams", "Bring staff, customers, and networks into a shared cause through giving, volunteering, and advocacy."]
];

export default function PartnersPage() {
  return (
    <main>
      <section className="partnersHero">
        <div>
          <p className="eyebrow">Our partners</p>
          <h1>Partnerships that help children access heart care.</h1>
          <p>
            Heart to Heart Foundation is strengthened by companies, institutions,
            medical partners, and community supporters who stand with children
            and families when specialist heart care is out of reach.
          </p>
          <div className="heroActions">
            <a className="button primary" href="/corporate">Become a partner</a>
            <a className="button secondary" href="/impact">See impact</a>
          </div>
        </div>
        <aside className="partnerHeroCard">
          <span>Shared impact</span>
          <strong>Partners help fund care, support events, expand awareness, and give children a healthier future.</strong>
          <a href="/corporate">Explore partnership options</a>
        </aside>
      </section>

      <section className="section partnerLogoSection">
        <div className="sectionHeading">
          <p className="eyebrow">Trusted support</p>
          <h2>Our partners and supporters.</h2>
        </div>
        <div className="partnerLogoGrid">
          {partnerLogos.map(([name, image]) => (
            <div className="partnerLogoCard" key={name}>
              <img src={image} alt={name} />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section partnerPathways">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">Ways to stand with us</p>
          <h2>Every partnership can help children receive care, families find hope, and communities learn prevention.</h2>
        </div>
        <div className="pathwayGrid">
          {pathways.map(([title, copy], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section sponsorshipSection">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">Sponsorship plans</p>
          <h2>Choose a sponsorship package that matches your visibility goals.</h2>
          <p>
            Annual partnership packages give companies a clear way to support
            events, public awareness, and children&apos;s heart care.
          </p>
        </div>
        <div className="tierGrid">
          {tiers.map((tier) => (
            <article className={`tierCard ${tier.className}`} key={tier.name}>
              <div className="tierCardTop">
                <span>{tier.name}</span>
                <small>Annual package</small>
              </div>
              <div className="tierCardBody">
                <div className="tierPriceRow">
                  <h3>{tier.name}</h3>
                  <strong>{tier.price}</strong>
                </div>
                <ul>
                  {tier.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
                <a className="button secondary" href="/corporate">Discuss package</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section partnerCta">
        <div>
          <p className="eyebrow">Become a partner</p>
          <h2>Let us work together to leave a mark on a child&apos;s heart.</h2>
          <p>
            Whether through event sponsorship, surgery support, workplace
            giving, or awareness programmes, your organisation can help make
            specialist heart care possible for more children.
          </p>
        </div>
        <a className="button primary" href="/corporate">Partner with us</a>
      </section>
    </main>
  );
}
