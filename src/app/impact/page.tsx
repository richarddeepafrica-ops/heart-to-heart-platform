import { impactMetrics } from "@/lib/content";

const proofPoints = [
  "Open-heart surgeries supported for children whose families cannot afford care alone.",
  "Rheumatic fever awareness and prevention through school and community education.",
  "Heart Run / Walk participation that keeps the mission visible nationally.",
  "A committed cardiac team behind diagnosis, surgery, recovery, and follow-up."
];

const beneficiaries = [
  {
    name: "Joy Wambui",
    image: "/assets/impact/joy-wambui.png",
    href: "/sponsor/joy-wambui",
    story: "Just like her name, Joy is a joyful girl. Born deaf and unable to speak, she underwent open heart surgery and reminds us to be thankful for the simple things we often take for granted."
  },
  {
    name: "J'sean Kairu",
    image: "/assets/impact/jsean-kairu.jpeg",
    href: "/sponsor/jsean-kairu",
    story: "J'sean is a daddy's boy. He underwent successful open heart surgery, and his father stayed with him through the entire hospital journey."
  },
  {
    name: "Jedidah Mukami",
    image: "/assets/impact/jedidah-story.jpg",
    href: "/impact#beneficiary-stories",
    story: "Schools are among H2HF's biggest sponsors. Jedidah was referred through school, and after surgery the entire school visited her. Her recovery brought relief to her family and school community."
  },
  {
    name: "Leon Karanja",
    image: "/assets/impact/leon-story.jpg",
    href: "/impact#beneficiary-stories",
    story: "Master Leon kept his beautiful smile even after surgery in the ICU. His joyful personality was contagious to everyone who met him."
  },
  {
    name: "Anjema",
    image: "/assets/impact/anjema.jpg",
    href: "/impact#beneficiary-stories",
    story: "Anjema is a very jolly girl born with Down syndrome. Her parents went out of their way to get help and make sure she received the right surgery for her heart condition through H2HF."
  },
  {
    name: "Repha",
    image: "/assets/impact/repha.jpg",
    href: "/impact#beneficiary-stories",
    story: "Repha was awaiting surgery in the same year she sat for her K.C.P.E. final exams. She passed and was able to pursue her secondary education."
  },
  {
    name: "Lydia",
    image: "/assets/impact/lydia.jpg",
    href: "/impact#beneficiary-stories",
    story: "Lydia was living in a children's home and estranged from her mother. After successful surgery, one sponsor helped restore the family by taking Lydia to boarding school and buying land for the family to build."
  }
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
          <p className="eyebrow">Donor promise</p>
          <h2>Every gift should be connected to a clear programme path.</h2>
          <p>
            The redesigned platform should let supporters see the campaign,
            beneficiary, event, and follow-up story connected to their giving.
          </p>
        </article>
      </section>

      <section className="section beneficiarySection" id="beneficiary-stories">
        <div className="sectionHeading">
          <p className="eyebrow">Beneficiaries</p>
          <h2>Put children and recovery stories at the centre of the impact page.</h2>
        </div>
        <div className="beneficiaryGrid">
          {beneficiaries.map((child) => (
            <a className="beneficiaryCard" href={child.href} key={child.name}>
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
