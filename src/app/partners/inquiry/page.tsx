const partnershipOptions = [
  "Bronze sponsorship",
  "Silver sponsorship",
  "Gold sponsorship",
  "Platinum sponsorship",
  "Event partnership",
  "Surgery support",
  "Workplace giving",
  "Custom partnership"
];

export default function PartnerInquiryPage() {
  return (
    <main>
      <section className="partnerInquiryHero">
        <div>
          <p className="eyebrow">Partnership inquiry</p>
          <h1>Tell us how your organisation would like to help.</h1>
          <p>
            Share your details and the foundation team will follow up on the
            right sponsorship package, event opportunity, CSR partnership, or
            custom giving route.
          </p>
        </div>
        <aside className="partnerInquiryAside">
          <span>Admin follow-up</span>
          <strong>Submitted details go to the foundation team for partnership review.</strong>
          <p>For urgent matters, call +254 738 150 092 or email hearttoheart@karenhospital.org.</p>
        </aside>
      </section>

      <section className="section partnerInquirySection">
        <form
          action="mailto:hearttoheart@karenhospital.org"
          className="partnerInquiryForm"
          encType="text/plain"
          method="post"
        >
          <div className="sectionHeading compactHeading">
            <p className="eyebrow">Discuss partnership</p>
            <h2>Complete the form and our admin team will contact you.</h2>
          </div>
          <div className="partnerInquiryGrid">
            <label>
              Contact person
              <input name="contact_person" placeholder="Your full name" type="text" />
            </label>
            <label>
              Organization
              <input name="organization" placeholder="Company or institution" type="text" />
            </label>
            <label>
              Email
              <input name="email" placeholder="you@example.com" type="email" />
            </label>
            <label>
              Phone
              <input name="phone" placeholder="+254..." type="tel" />
            </label>
            <label>
              Partnership interest
              <select name="partnership_interest" defaultValue="">
                <option value="" disabled>Select an option</option>
                {partnershipOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              Estimated budget
              <input name="estimated_budget" placeholder="KES / custom" type="text" />
            </label>
            <label className="span2">
              Message
              <textarea
                name="message"
                placeholder="Tell us what you would like to support, timelines, visibility needs, or questions."
                rows={5}
              />
            </label>
          </div>
          <button className="button primary" type="submit">Send inquiry</button>
        </form>
      </section>
    </main>
  );
}
