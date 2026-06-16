const volunteerPositions = [
  ["Event support", "Help with Heart Run / Walk registration, guest welcome, route support, and donor care."],
  ["Community outreach", "Join prevention drives, school visits, awareness campaigns, and family support activities."],
  ["Professional skills", "Support communications, photography, administration, logistics, finance, or clinical education."],
  ["Corporate teams", "Bring your workplace into a structured volunteer day or fundraising activation."]
];

const volunteerSteps = [
  ["1", "Tell us about yourself", "Share your contacts, interest, availability, and the skills you would like to offer."],
  ["2", "We match your interest", "The team reviews your submission and aligns you with the right campaign, event, or programme."],
  ["3", "Serve with purpose", "Join a volunteer activity and help leave a mark on a child's heart."]
];

export default function VolunteerPage() {
  return (
    <main>
      <section className="volunteerHero">
        <div>
          <p className="eyebrow">Get involved</p>
          <h1>Volunteer</h1>
          <p>
            Give your time, skills, and energy to support children with heart
            disease, strengthen awareness, and help the foundation deliver
            meaningful events and community programmes.
          </p>
          <div className="heroActions">
            <a className="button primary" href="#join-us">Join us today</a>
            <a className="button secondary" href="/contact">Talk to the team</a>
          </div>
        </div>
      </section>

      <section className="volunteerWorkspace" id="join-us">
        <div className="volunteerPositions">
          <p className="eyebrow">Volunteer positions</p>
          <h2>Find a place to serve.</h2>
          <p>
            Whether you can help for one event or support an ongoing programme,
            there is room to contribute in a practical, dignified way.
          </p>
          <div className="volunteerPositionGrid">
            {volunteerPositions.map(([title, copy]) => (
              <article key={title}>
                <strong>{title}</strong>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>

        <form
          action="mailto:hearttoheart@karenhospital.org"
          className="volunteerForm"
          encType="text/plain"
          method="post"
        >
          <p className="eyebrow">We make a life by what we give</p>
          <h2>Join Us Today</h2>
          <p>Be part of leaving a mark on a child&apos;s heart.</p>
          <label>
            Your Names
            <input name="name" placeholder="Your Names" type="text" />
          </label>
          <label>
            Your Email
            <input name="email" placeholder="Your Email" type="email" />
          </label>
          <label>
            Your Phone
            <input name="phone" placeholder="Your Phone" type="tel" />
          </label>
          <label>
            Your Organization
            <input name="organization" placeholder="Your Organization" type="text" />
          </label>
          <label>
            Your Interest
            <textarea name="interest" placeholder="Your Interest" rows={4} />
          </label>
          <label>
            Your Expertise
            <textarea name="expertise" placeholder="Your Expertise" rows={4} />
          </label>
          <button className="button primary" type="submit">Submit interest</button>
        </form>
      </section>

      <section className="section volunteerStepsSection">
        <div className="sectionHeading">
          <p className="eyebrow">How it works</p>
          <h2>A simple path into service.</h2>
          <p>
            The foundation team will review volunteer interest and follow up
            with the best next step.
          </p>
        </div>
        <div className="volunteerSteps">
          {volunteerSteps.map(([number, title, copy]) => (
            <article key={title}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
