import { HeartRunRegistrationForm } from "@/components/HeartRunRegistrationForm";
import { getEventTicketPackages } from "@/lib/event-ticket-data";

const registrationSteps = [
  ["1", "Choose package", "Individual, family, school, or corporate team"],
  ["2", "Add details", "Participant and team information"],
  ["3", "Confirm payment", "Receive registration confirmation"]
];

type HeartRunRegisterPageProps = {
  searchParams: Promise<{ package?: string }>;
};

export default async function HeartRunRegisterPage({ searchParams }: HeartRunRegisterPageProps) {
  const params = await searchParams;
  const tickets = await getEventTicketPackages({ eventSlug: "heart-run" });

  return (
    <main>
      <section className="eventFlowHero registerHero">
        <div>
          <p className="eyebrow">Heart Run / Walk registration</p>
          <h1>Register for Heart Run and walk with the mission.</h1>
        </div>
        <aside>
          {registrationSteps.map(([number, title, copy]) => (
            <span key={title}><b>{number}</b><strong>{title}</strong><small>{copy}</small></span>
          ))}
        </aside>
      </section>

      <HeartRunRegistrationForm tickets={tickets} initialPackage={params.package} />
    </main>
  );
}
