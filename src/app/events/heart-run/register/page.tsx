import { eventProducts, formatKes } from "@/lib/content";

const registrationSteps = [
  ["1", "Choose package", "Individual, family, school, or corporate team"],
  ["2", "Add details", "Participant and team information"],
  ["3", "Confirm payment", "Receive registration confirmation"]
];

export default function HeartRunRegisterPage() {
  const defaultPackage = eventProducts[1];
  const addOn = 2500;

  return (
    <main>
      <section className="eventFlowHero registerHero">
        <div>
          <p className="eyebrow">Heart Run / Walk registration</p>
          <h1>Register for Heart Run and walk with the mission.</h1>
          <p>
            Choose your package, tell us who is participating, and add an
            optional gift toward children awaiting heart treatment.
          </p>
        </div>
        <aside>
          {registrationSteps.map(([number, title, copy]) => (
            <span key={title}><b>{number}</b><strong>{title}</strong><small>{copy}</small></span>
          ))}
        </aside>
      </section>

      <section className="eventFlowLayout">
        <form className="eventFlowForm">
          <div className="flowBlock">
            <div className="blockTitle">
              <strong>Registration package</strong>
              <span>Choose one package</span>
            </div>
            <div className="eventPackageChoices">
              {eventProducts.map((ticket) => (
                <label className={ticket.name === defaultPackage.name ? "selected" : ""} key={ticket.name}>
                  <input defaultChecked={ticket.name === defaultPackage.name} name="package" type="radio" />
                  <span>
                    <strong>{ticket.name}</strong>
                    <small>{ticket.description}</small>
                  </span>
                  <b>{formatKes(ticket.price)}</b>
                </label>
              ))}
            </div>
          </div>

          <div className="flowBlock">
            <div className="blockTitle">
              <strong>Participant details</strong>
              <span>Used for registration confirmation</span>
            </div>
            <div className="formGrid">
              <label>Name<input placeholder="Full name" /></label>
              <label>Phone<input placeholder="07..." /></label>
              <label>Email<input placeholder="you@example.com" type="email" /></label>
              <label>Team or organisation<input placeholder="Family, school, company, or club" /></label>
            </div>
          </div>

          <div className="flowBlock">
            <div className="blockTitle">
              <strong>Optional add-on gift</strong>
              <span>Support children even beyond your registration</span>
            </div>
            <div className="addOnGift">
              {[1000, 2500, 5000, 10000].map((amount) => (
                <button className={amount === addOn ? "active" : ""} type="button" key={amount}>
                  {formatKes(amount)}
                </button>
              ))}
            </div>
          </div>
        </form>

        <aside className="eventFlowSummary">
          <p className="eyebrow">Registration summary</p>
          <h2>{defaultPackage.name}</h2>
          <div className="summaryRows">
            <span>Package</span><strong>{formatKes(defaultPackage.price)}</strong>
            <span>Add-on gift</span><strong>{formatKes(addOn)}</strong>
            <span>Total</span><strong>{formatKes(defaultPackage.price + addOn)}</strong>
          </div>
          <p>
            Payment confirmation will reserve the package and prepare a receipt
            for the participant or organisation.
          </p>
          <a className="button primary wide" href="/donate">Continue to payment</a>
          <a className="button secondary wide" href="/events/heart-run/donate">Donate instead</a>
        </aside>
      </section>
    </main>
  );
}
