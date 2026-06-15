import { HeartRunRegistrationForm } from "@/components/HeartRunRegistrationForm";

const registrationSteps = [
  ["1", "Choose package", "Individual, family, school, or corporate team"],
  ["2", "Add details", "Participant and team information"],
  ["3", "Confirm payment", "Receive registration confirmation"]
];

export default function HeartRunRegisterPage() {
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

      <HeartRunRegistrationForm />
    </main>
  );
}
