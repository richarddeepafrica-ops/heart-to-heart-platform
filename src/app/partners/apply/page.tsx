import { PartnerInstitutionApplicationForm } from "@/components/PartnerInstitutionApplicationForm";

export default function PartnerInstitutionApplyPage() {
  return (
    <main>
      <section className="applicationHero partnerApplicationHero">
        <div>
          <p className="eyebrow">Partner institution application</p>
          <h1>Apply to collaborate with Heart to Heart Foundation.</h1>
          <p>
            Hospitals, schools, companies, community groups, and institutions
            can apply online. The admin team reviews each submission before
            adding approved institutions to the partner pipeline.
          </p>
        </div>
        <aside>
          <span>Review before approval</span>
          <strong>Approved institutions are added into the partner list for follow-up and relationship management.</strong>
        </aside>
      </section>
      <section className="section applicationSection">
        <div className="sectionHeading compactHeading">
          <p className="eyebrow">Institution form</p>
          <h2>Share your proposal and contact details.</h2>
        </div>
        <PartnerInstitutionApplicationForm />
      </section>
    </main>
  );
}
