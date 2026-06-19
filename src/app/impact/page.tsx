import { impactMetrics } from "@/lib/content";
import { impactStories } from "@/lib/impact-stories";

const proofPoints = [
  "Open-heart surgeries supported for children whose families cannot afford care alone.",
  "Rheumatic fever awareness and prevention through school and community education.",
  "Heart Run / Walk participation that keeps the mission visible nationally.",
  "A committed cardiac team behind diagnosis, surgery, recovery, and follow-up."
];

const careTeam = [
  "Cardiologists",
  "Cardiothoracic surgeons",
  "Cardiac anaesthetists",
  "Theatre and ICU nurses",
  "Physiotherapists",
  "Patient coordination and administration"
];

const cardiacLeads = [
  {
    name: "Dr. Premanand Ponoth",
    role: "Chief of Cardiothoracic and Vascular Surgery at The Karen Hospital",
    image: "/assets/impact/cardiac-surgeon.jpg"
  },
  {
    name: "Mercy Nyakio",
    role: "Patient Coordinator",
    image: "/assets/impact/patient-coordinator.jpg"
  }
];

export default function ImpactPage() {
  return (
    <main>
      <section className="impactHero">
        <div>
          <p className="eyebrow">Our impact</p>
          <h1>Proof that a child&apos;s heart can change a whole community.</h1>
          <p>
            Heart to Heart Foundation combines treatment, prevention, education,
            fundraising, and specialist care so more children in Kenya can access
            the help they need.
          </p>
          <div className="heroActions">
            <a className="button primary" href="/donate">Fund more care</a>
            <a className="button secondary" href="/events">Join Heart Run / Walk</a>
          </div>
        </div>
        <div className="impactHeroImage" aria-label="Heart to Heart Foundation beneficiary" />
      </section>

      <section className="metricBand light">
        {impactMetrics.map((metric) => (
          <article key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <section className="sectionGrid impactProof">
        <article className="featurePanel impactProofCard">
          <p className="eyebrow">Foundation record</p>
          <h2>Impact is strongest when treatment and prevention move together.</h2>
          <ul className="checkList">
            {proofPoints.map((report) => (
              <li key={report}>{report}</li>
            ))}
          </ul>
        </article>
        <article className="featurePanel blue">
          <p className="eyebrow">For supporters</p>
          <h2>Your support helps children receive care and families keep hope.</h2>
          <p>
            Donations support treatment, prevention, events, and follow-up work
            so more children can move from diagnosis to recovery.
          </p>
        </article>
      </section>

      <section className="section beneficiarySection" id="beneficiary-stories">
        <div className="sectionHeading">
          <p className="eyebrow">Beneficiaries</p>
          <h2>Children and recovery stories are at the heart of this work.</h2>
        </div>
        <div className="beneficiaryGrid">
          {impactStories.map((child) => (
            <a className="beneficiaryCard" href={`/impact/${child.slug}`} key={child.name}>
              <img src={child.image} alt={child.name} />
              <span>Beneficiary story</span>
              <h3>{child.name}</h3>
              <p>{child.story}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section allocationSection">
        <div className="sectionHeading">
          <p className="eyebrow">Objectives</p>
          <h2>What the foundation works to advance.</h2>
        </div>
        <div className="allocationGrid">
          {[
            ["Open-heart surgery", "Financial assistance for needy heart disease patients."],
            ["Access to services", "Programmes that increase access to cardiovascular services."],
            ["Awareness", "Education on congenital and acquired heart disease risk factors."],
            ["Training", "Support for medical and paramedical personnel in cardiology."]
          ].map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section cardiacTeamSection">
        <div className="cardiacTeamIntro">
          <p className="eyebrow">Acknowledgement</p>
          <h2>The Cardiac Team</h2>
          <p>
            Behind the scenes is another group of people without whose assistance
            these surgeries would not be possible. The cardiac team includes
            cardiologists, cardiothoracic surgeons, cardiac anaesthetists,
            theatre nurses, ICU nurses, physiotherapists, and administration
            staff who help ensure surgeries are scheduled and performed well.
          </p>
        </div>
        <div className="cardiacPeople">
          {cardiacLeads.map((person) => (
            <article className="cardiacPerson" key={person.name}>
              <img src={person.image} alt={person.name} />
              <div>
                <h3>{person.name}</h3>
                <p>{person.role}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="careTeamList centered">
          {careTeam.map((role) => (
            <span key={role}>{role}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
