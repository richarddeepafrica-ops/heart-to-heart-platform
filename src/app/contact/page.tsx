const contactCards = [
  {
    label: "Phone",
    value: "+254 738 150 092",
    copy: "Call the foundation office during working hours.",
    href: "tel:+254738150092"
  },
  {
    label: "Email",
    value: "hearttoheart@karenhospital.org",
    copy: "Send partnership, donation, programme, or visit enquiries.",
    href: "mailto:hearttoheart@karenhospital.org"
  },
  {
    label: "Address",
    value: "P.O. Box 66399 - 000800 Nairobi",
    copy: "Nairobi - Off Langa'ta Road, next to Don Bosco Utume.",
    href: "https://www.google.com/maps?q=-1.3307646618885933,36.726345447322224"
  }
];

const officeHours = [
  ["Monday - Friday", "8 AM - 5 PM"],
  ["Saturday", "8 AM - 1 PM"]
];

export default function ContactPage() {
  return (
    <main>
      <section className="contactHero">
        <div>
          <p className="eyebrow">Contact us</p>
          <h1>Reach Heart to Heart Foundation.</h1>
          <p>
            Visit the foundation office, call during office hours, or send an
            email and the team will guide you on donations, partnerships,
            events, sponsorship, and programme support.
          </p>
          <div className="heroActions">
            <a className="button primary" href="tel:+254738150092">Call the office</a>
            <a className="button secondary" href="mailto:hearttoheart@karenhospital.org">Send email</a>
          </div>
        </div>
        <div className="contactMapCard">
          <iframe
            aria-label="Heart to Heart Foundation location map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=-1.3307646618885933,36.726345447322224&z=16&output=embed"
            title="Heart to Heart Foundation location"
          />
          <div>
            <span>Location</span>
            <strong>Off Langa&apos;ta Road</strong>
            <p>Next to Don Bosco Utume, Nairobi.</p>
            <a
              href="https://www.google.com/maps?q=-1.3307646618885933,36.726345447322224"
              rel="noreferrer"
              target="_blank"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>

      <section className="section contactDetailsSection">
        <div className="sectionHeading">
          <p className="eyebrow">Office details</p>
          <h2>Everything you need to reach us.</h2>
          <p>
            Use the contact route that works best for you. The office is based
            in Nairobi and is open on weekdays and Saturday mornings.
          </p>
        </div>
        <div className="contactCards">
          {contactCards.map((card) => (
            <a className="contactCard" href={card.href} key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <p>{card.copy}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section contactHoursSection">
        <div>
          <p className="eyebrow">Office hours</p>
          <h2>Plan your visit.</h2>
          <p>
            For in-person visits, please come during office hours or call ahead
            so the right team member can be ready to assist.
          </p>
        </div>
        <div className="officeHoursCard">
          {officeHours.map(([day, time]) => (
            <div key={day}>
              <span>{day}</span>
              <strong>{time}</strong>
            </div>
          ))}
          <a className="button primary" href="/donate">Support the foundation</a>
        </div>
      </section>
    </main>
  );
}
